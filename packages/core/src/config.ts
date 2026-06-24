import { readFile } from "node:fs/promises"
import path from "node:path"
import { parse } from "yaml"
import { z } from "zod"
import { checkConfigPath } from "./config-path.js"
import type { ConfigError, ConfigIssue, MissingConfigError, Result } from "./errors.js"
import { configError, err, ok } from "./errors.js"
import type { Thresholds } from "./result.js"

const ThresholdSchema = z
  .object({
    passRate: z.number().min(0).max(1).optional(),
    maxFailures: z.number().int().min(0).optional(),
    maxErrors: z.number().int().min(0).optional(),
  })
  .strict()

const DefaultsSchema = z
  .object({
    required: z.boolean().optional(),
    threshold: ThresholdSchema.optional(),
  })
  .strict()

const SuiteSchema = z
  .object({
    id: z.string().min(1),
    description: z.string().min(1).optional(),
    adapter: z.enum(["fixture", "promptfoo"]),
    cases: z.string().min(1),
    thresholds: ThresholdSchema.optional(),
    required: z.boolean().optional(),
  })
  .strict()

const ConfigSchema = z
  .object({
    version: z.literal(1),
    name: z.string().min(1),
    defaults: DefaultsSchema.optional(),
    suites: z.array(SuiteSchema).min(1),
  })
  .strict()

type RawConfig = z.infer<typeof ConfigSchema>
type RawSuite = RawConfig["suites"][number]
type RawThresholds = z.infer<typeof ThresholdSchema>

export type SuiteConfig = {
  readonly id: string
  readonly description?: string
  readonly adapter: "fixture" | "promptfoo"
  readonly cases: string
  readonly casesPath: string
  readonly required: boolean
  readonly thresholds: Thresholds
}

export type VerdictConfig = {
  readonly version: 1
  readonly name: string
  readonly configPath: string
  readonly configDir: string
  readonly suites: readonly SuiteConfig[]
}

export type ConfigLoadResult = Result<VerdictConfig, MissingConfigError | ConfigError>

export async function loadConfig(configPath: string): Promise<ConfigLoadResult> {
  const pathResult = await checkConfigPath(configPath)
  if (!pathResult.ok) {
    return pathResult
  }

  let rawConfig: unknown
  try {
    rawConfig = parse(await readFile(configPath, "utf8"))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return err(
      configError(configPath, {
        fieldPath: "config",
        expected: "valid YAML",
        message,
      }),
    )
  }

  const parsedConfig = ConfigSchema.safeParse(rawConfig)
  if (!parsedConfig.success) {
    const issues = parsedConfig.error.issues.map(configIssue)
    const primaryIssue = firstIssue(issues)
    return err(configError(configPath, primaryIssue, issues))
  }

  return ok(normalizeConfig(configPath, parsedConfig.data))
}

function normalizeConfig(configPath: string, config: RawConfig): VerdictConfig {
  const configDir = path.dirname(path.resolve(configPath))
  return {
    version: config.version,
    name: config.name,
    configPath: path.resolve(configPath),
    configDir,
    suites: config.suites.map((suite) => normalizeSuite(configDir, config.defaults, suite)),
  }
}

function normalizeSuite(
  configDir: string,
  defaults: RawConfig["defaults"],
  suite: RawSuite,
): SuiteConfig {
  const base = {
    id: suite.id,
    adapter: suite.adapter,
    cases: suite.cases,
    casesPath: path.resolve(configDir, suite.cases),
    required: suite.required ?? defaults?.required ?? true,
    thresholds: mergeThresholds(defaults?.threshold, suite.thresholds),
  } satisfies Omit<SuiteConfig, "description">

  if (suite.description === undefined) {
    return base
  }

  return { ...base, description: suite.description }
}

function mergeThresholds(
  defaults: RawThresholds | undefined,
  suiteThresholds: RawThresholds | undefined,
): Thresholds {
  return {
    ...normalizeThresholds(defaults),
    ...normalizeThresholds(suiteThresholds),
  }
}

function normalizeThresholds(thresholds: RawThresholds | undefined): Thresholds {
  return {
    ...(thresholds?.passRate !== undefined ? { passRate: thresholds.passRate } : {}),
    ...(thresholds?.maxFailures !== undefined ? { maxFailures: thresholds.maxFailures } : {}),
    ...(thresholds?.maxErrors !== undefined ? { maxErrors: thresholds.maxErrors } : {}),
  }
}

function configIssue(issue: z.ZodIssue): ConfigIssue {
  return {
    fieldPath: issue.path.length > 0 ? issue.path.join(".") : "config",
    expected: issue.message,
    message: issue.message,
  }
}

function firstIssue(issues: readonly ConfigIssue[]): ConfigIssue {
  const issue = issues[0]
  if (issue !== undefined) {
    return issue
  }

  return {
    fieldPath: "config",
    expected: "valid VerdictCI config",
    message: "Config does not match the VerdictCI schema.",
  }
}
