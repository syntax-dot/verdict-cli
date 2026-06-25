import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { z } from "zod"
import type { SuiteConfig } from "./config.js"
import type { ProviderError, Result, RunError } from "./errors.js"
import { err, ok, providerError } from "./errors.js"
import {
  applyThresholds,
  countCases,
  type ResultCase,
  type ResultSuite,
  suiteVerdict,
  type Thresholds,
} from "./result.js"

const PROMPTFOO_FAILED_TESTS_EXIT_CODE = 100
const UNKNOWN_RECORD_SCHEMA = z.record(z.string(), z.unknown())

const PromptfooStatsSchema = z
  .object({
    successes: z.number().int().min(0).optional(),
    failures: z.number().int().min(0).optional(),
    errors: z.number().int().min(0).optional(),
  })
  .passthrough()

const PromptfooRowSchema = z
  .object({
    testIdx: z.number().int().optional(),
    promptIdx: z.number().int().optional(),
    success: z.boolean().optional(),
    score: z.number().optional(),
    error: z.unknown().optional(),
    metadata: UNKNOWN_RECORD_SCHEMA.optional(),
    vars: UNKNOWN_RECORD_SCHEMA.optional(),
    testCase: z
      .object({
        vars: UNKNOWN_RECORD_SCHEMA.optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()

const PromptfooOutputSchema = z
  .object({
    version: z.union([z.number(), z.string()]).optional(),
    results: z
      .object({
        stats: PromptfooStatsSchema.optional(),
        results: z.array(PromptfooRowSchema).optional(),
        outputs: z.array(PromptfooRowSchema).optional(),
      })
      .passthrough(),
  })
  .passthrough()

type PromptfooOutput = z.infer<typeof PromptfooOutputSchema>
type PromptfooRow = z.infer<typeof PromptfooRowSchema>
type PromptfooStats = z.infer<typeof PromptfooStatsSchema>

export type PromptfooCommand = {
  readonly executable: string
  readonly args: readonly string[]
}

export type NormalizePromptfooOutputOptions = {
  readonly suiteId: string
  readonly thresholds: Thresholds
  readonly promptfooOutput: unknown
}

export type RunPromptfooSuiteOptions = {
  readonly suite: SuiteConfig
  readonly command?: PromptfooCommand | undefined
}

type PromptfooProcessResult = {
  readonly exitCode: number | null
}

export function normalizePromptfooOutput(
  options: NormalizePromptfooOutputOptions,
): Result<ResultSuite, RunError> {
  const parsed = PromptfooOutputSchema.safeParse(options.promptfooOutput)
  if (!parsed.success) {
    return err(promptfooProviderError(options.suiteId, "JSON output could not be parsed."))
  }

  const rows = promptfooRows(parsed.data)
  if (hasPromptfooRuntimeError(parsed.data.results.stats, rows)) {
    return err(promptfooProviderError(options.suiteId, "provider or runtime errors were reported."))
  }

  const cases = rows.map(promptfooRowToResultCase)
  const counts = countCases(cases)
  const thresholdFailures = applyThresholds(counts, options.thresholds)
  return ok({
    id: options.suiteId,
    verdict: suiteVerdict(counts, thresholdFailures),
    passed: counts.passed,
    failed: counts.failed,
    skipped: counts.skipped,
    errored: counts.errored,
    thresholdFailures,
    cases,
  })
}

export async function runPromptfooSuite(
  options: RunPromptfooSuiteOptions,
): Promise<Result<ResultSuite, RunError>> {
  if (options.suite.promptfoo === undefined) {
    return err(promptfooProviderError(options.suite.id, "promptfoo config was not resolved."))
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), "verdictci-promptfoo-"))
  const promptfooOutputPath = path.join(tempDir, "promptfoo-result.json")
  try {
    const command = options.command ?? defaultPromptfooCommand()
    const processResult = await runPromptfooCommand({
      command,
      configPath: options.suite.promptfoo.configPath,
      outputPath: promptfooOutputPath,
    })
    if (!isPromptfooParseableExit(processResult.exitCode)) {
      return err(
        promptfooProviderError(options.suite.id, "promptfoo did not complete successfully."),
      )
    }

    const outputResult = await readPromptfooOutput(options.suite.id, promptfooOutputPath)
    if (!outputResult.ok) {
      return outputResult
    }

    return normalizePromptfooOutput({
      suiteId: options.suite.id,
      thresholds: options.suite.thresholds,
      promptfooOutput: outputResult.value,
    })
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

function promptfooRows(output: PromptfooOutput): readonly PromptfooRow[] {
  return output.results.results ?? output.results.outputs ?? []
}

function hasPromptfooRuntimeError(
  stats: PromptfooStats | undefined,
  rows: readonly PromptfooRow[],
): boolean {
  return (stats?.errors ?? 0) > 0 || rows.some((row) => row.error !== undefined)
}

function promptfooRowToResultCase(row: PromptfooRow, index: number): ResultCase {
  return {
    id: promptfooCaseId(row, index),
    status: row.success === false ? "failed" : "passed",
    ...(row.score !== undefined ? { score: row.score } : {}),
    ...(row.success === false ? { reason: "Promptfoo assertions failed." } : {}),
  }
}

function promptfooCaseId(row: PromptfooRow, index: number): string {
  const configuredId =
    stringRecordValue(row.metadata, "caseId") ??
    stringRecordValue(row.metadata, "id") ??
    stringRecordValue(row.testCase?.vars, "id") ??
    stringRecordValue(row.vars, "id")
  if (configuredId !== undefined) {
    return configuredId
  }

  if (row.testIdx !== undefined && row.promptIdx !== undefined) {
    return `promptfoo-${row.testIdx}-${row.promptIdx}`
  }
  return `promptfoo-${index + 1}`
}

function stringRecordValue(
  record: Readonly<Record<string, unknown>> | undefined,
  key: string,
): string | undefined {
  const value = record?.[key]
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

async function readPromptfooOutput(
  suiteId: string,
  outputPath: string,
): Promise<Result<unknown, ProviderError>> {
  try {
    return ok(JSON.parse(await readFile(outputPath, "utf8")))
  } catch {
    return err(promptfooProviderError(suiteId, "JSON output file was not written."))
  }
}

function promptfooProviderError(suiteId: string, detail: string): ProviderError {
  return providerError({
    suiteId,
    message: `promptfoo backend failed for suite ${suiteId}: ${detail}`,
    remediation:
      "Install promptfoo, verify the suite promptfoo config, or set VERDICTCI_PROMPTFOO_BIN to a working promptfoo executable.",
  })
}

async function runPromptfooCommand(options: {
  readonly command: PromptfooCommand
  readonly configPath: string
  readonly outputPath: string
}): Promise<PromptfooProcessResult> {
  const args = [
    ...options.command.args,
    "eval",
    "--config",
    options.configPath,
    "--output",
    options.outputPath,
    "--no-table",
    "--no-progress-bar",
    "--no-share",
  ]

  return new Promise((resolve) => {
    const child = spawn(options.command.executable, args, {
      cwd: path.dirname(options.configPath),
      shell: shouldUseShell(options.command.executable),
      stdio: ["ignore", "ignore", "ignore"],
    })

    child.on("error", () => {
      resolve({ exitCode: null })
    })
    child.on("close", (exitCode) => {
      resolve({ exitCode })
    })
  })
}

function isPromptfooParseableExit(exitCode: number | null): boolean {
  return exitCode === 0 || exitCode === PROMPTFOO_FAILED_TESTS_EXIT_CODE
}

function defaultPromptfooCommand(): PromptfooCommand {
  const { VERDICTCI_PROMPTFOO_BIN } = process.env
  const configuredExecutable = VERDICTCI_PROMPTFOO_BIN?.trim()
  if (configuredExecutable !== undefined && configuredExecutable !== "") {
    return { executable: configuredExecutable, args: [] }
  }

  const localEntrypoint = path.resolve(
    process.cwd(),
    "node_modules/promptfoo/dist/src/entrypoint.js",
  )
  if (existsSync(localEntrypoint)) {
    return { executable: runtimeNodeExecutable(), args: [localEntrypoint] }
  }

  return { executable: "promptfoo", args: [] }
}

function runtimeNodeExecutable(): string {
  const { VERDICTCI_NODE } = process.env
  const configuredNode = VERDICTCI_NODE?.trim()
  return configuredNode === undefined || configuredNode === "" ? process.execPath : configuredNode
}

function shouldUseShell(executable: string): boolean {
  const normalized = executable.toLowerCase()
  return (
    process.platform === "win32" && (normalized.endsWith(".cmd") || normalized.endsWith(".bat"))
  )
}
