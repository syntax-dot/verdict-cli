import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { loadConfig, type SuiteConfig } from "./config.js"
import type { Result, RunError } from "./errors.js"
import { configError, err, ok } from "./errors.js"
import { EXIT_CODES, type ExitCode } from "./exit-codes.js"
import type { FixtureCase } from "./fixtures.js"
import { loadFixtureCases } from "./fixtures.js"
import {
  applyThresholds,
  type Counts,
  countCases,
  type ResultArtifact,
  type ResultCase,
  type ResultSuite,
  suiteVerdict,
  type Verdict,
} from "./result.js"

export type RunVerdictCIOptions = {
  readonly configPath: string
  readonly outputPath: string
}

export type RunVerdictCIValue = {
  readonly exitCode: ExitCode
  readonly result: ResultArtifact
}

export type RunVerdictCIResult = Result<RunVerdictCIValue, RunError>

export async function runVerdictCI(options: RunVerdictCIOptions): Promise<RunVerdictCIResult> {
  const startedAt = new Date()
  const configResult = await loadConfig(options.configPath)
  if (!configResult.ok) {
    return configResult
  }

  const suiteResults: ResultSuite[] = []
  for (const suite of configResult.value.suites) {
    const suiteResult = await runFixtureSuite(configResult.value.configPath, suite)
    if (!suiteResult.ok) {
      return suiteResult
    }
    suiteResults.push(suiteResult.value)
  }

  const summaryCounts = suiteResults.reduce<Counts>(
    (counts, suite) => ({
      passed: counts.passed + suite.passed,
      failed: counts.failed + suite.failed,
      skipped: counts.skipped + suite.skipped,
      errored: counts.errored + suite.errored,
    }),
    { passed: 0, failed: 0, skipped: 0, errored: 0 },
  )
  const requiredSuites = suiteResults.filter((suite) => {
    const configSuite = configResult.value.suites.find((candidate) => candidate.id === suite.id)
    return configSuite?.required ?? true
  })
  const verdict = runVerdict(requiredSuites)
  const result: ResultArtifact = {
    schemaVersion: 1,
    tool: { name: "VerdictCI", version: "0.1.0" },
    run: {
      id: formatRunId(startedAt),
      startedAt: startedAt.toISOString(),
      durationMs: Date.now() - startedAt.getTime(),
      configPath: configResult.value.configPath,
      mode: "fixture",
    },
    summary: {
      verdict,
      suites: suiteResults.length,
      cases:
        summaryCounts.passed + summaryCounts.failed + summaryCounts.skipped + summaryCounts.errored,
      passed: summaryCounts.passed,
      failed: summaryCounts.failed,
      skipped: summaryCounts.skipped,
      errored: summaryCounts.errored,
    },
    suites: suiteResults,
  }

  await mkdir(path.dirname(path.resolve(options.outputPath)), { recursive: true })
  await writeFile(options.outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8")

  return ok({
    exitCode: verdict === "passed" ? EXIT_CODES.passed : EXIT_CODES.failed,
    result,
  })
}

async function runFixtureSuite(
  configPath: string,
  suite: SuiteConfig,
): Promise<Result<ResultSuite, RunError>> {
  if (suite.adapter !== "fixture") {
    return err(
      configError(configPath, {
        fieldPath: `suites.${suite.id}.adapter`,
        expected: "fixture",
        message: "Only the fixture adapter is executable in Milestone 2.",
      }),
    )
  }

  const casesResult = await loadFixtureCases(suite.casesPath)
  if (!casesResult.ok) {
    return casesResult
  }

  const resultCases = casesResult.value.map(fixtureToResultCase)
  const counts = countCases(resultCases)
  const thresholdFailures = applyThresholds(counts, suite.thresholds)
  return ok({
    id: suite.id,
    verdict: suiteVerdict(counts, thresholdFailures),
    passed: counts.passed,
    failed: counts.failed,
    skipped: counts.skipped,
    errored: counts.errored,
    thresholdFailures,
    cases: resultCases,
  })
}

function fixtureToResultCase(fixtureCase: FixtureCase): ResultCase {
  return {
    id: fixtureCase.id,
    status: fixtureCase.fixture.status,
    ...(fixtureCase.fixture.score !== undefined ? { score: fixtureCase.fixture.score } : {}),
    ...(fixtureCase.fixture.reason !== undefined ? { reason: fixtureCase.fixture.reason } : {}),
  }
}

function runVerdict(requiredSuites: readonly ResultSuite[]): Verdict {
  const hasErroredSuite = requiredSuites.some((suite) => suite.verdict === "errored")
  if (hasErroredSuite) {
    return "errored"
  }

  const hasFailedSuite = requiredSuites.some((suite) => suite.verdict === "failed")
  return hasFailedSuite ? "failed" : "passed"
}

function formatRunId(startedAt: Date): string {
  const timestamp = startedAt
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replaceAll(":", "-")
  return `local-${timestamp}`
}
