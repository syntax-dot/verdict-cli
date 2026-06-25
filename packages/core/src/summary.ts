import type {
  ResultArtifact,
  ResultCase,
  ResultSuite,
  ThresholdFailure,
  Verdict,
} from "./result.js"

export type SummaryRenderOptions = {
  readonly result: ResultArtifact
  readonly outputPath: string
}

type SuiteCounts = {
  readonly passed: number
  readonly failed: number
  readonly errored: number
}

type FailedCase = {
  readonly suiteId: string
  readonly caseId: string
  readonly reason: string
}

export function renderTerminalSummary(options: SummaryRenderOptions): string {
  const suiteCounts = countSuites(options.result.suites)
  const thresholdLines = thresholdFailureLines(options.result.suites)
  const failedCases = failedCaseRows(options.result.suites)
  const lines = [
    `VerdictCI result: ${options.result.summary.verdict}`,
    `Suites: ${options.result.summary.suites} total, ${suiteCounts.passed} passed, ${suiteCounts.failed} failed, ${suiteCounts.errored} errored`,
    `Cases: ${options.result.summary.cases} total, ${options.result.summary.passed} passed, ${options.result.summary.failed} failed, ${options.result.summary.skipped} skipped, ${options.result.summary.errored} errored`,
  ]

  if (thresholdLines.length > 0) {
    lines.push("Threshold failures:", ...thresholdLines.map((line) => `- ${line}`))
  }
  if (failedCases.length > 0) {
    lines.push(
      "Failed cases:",
      ...failedCases.map(
        (resultCase) => `- ${resultCase.suiteId}/${resultCase.caseId}: ${resultCase.reason}`,
      ),
    )
  }

  lines.push(`Output: ${options.outputPath}`, nextLine(options.result.summary.verdict, failedCases))
  return `${lines.join("\n")}\n`
}

export function renderMarkdownSummary(options: SummaryRenderOptions): string {
  const failedCases = failedCaseRows(options.result.suites)
  const lines = [
    `# VerdictCI: ${options.result.summary.verdict}`,
    "",
    `${options.result.summary.suites} suites, ${options.result.summary.cases} cases: ${options.result.summary.passed} passed, ${options.result.summary.failed} failed, ${options.result.summary.skipped} skipped, ${options.result.summary.errored} errored.`,
    "",
    "| Suite | Verdict | Passed | Failed | Errored | Notes |",
    "| --- | --- | ---: | ---: | ---: | --- |",
    ...options.result.suites.map(suiteMarkdownRow),
    "",
    "## Failed cases",
    "",
    "| Case | Suite | Reason |",
    "| --- | --- | --- |",
    ...failedCaseMarkdownRows(failedCases),
    "",
    `Result artifact: \`${options.outputPath}\``,
    "",
  ]

  return `${lines.join("\n")}`
}

function countSuites(suites: readonly ResultSuite[]): SuiteCounts {
  return suites.reduce<SuiteCounts>((counts, suite) => incrementSuiteCount(counts, suite.verdict), {
    passed: 0,
    failed: 0,
    errored: 0,
  })
}

function incrementSuiteCount(counts: SuiteCounts, verdict: Verdict): SuiteCounts {
  switch (verdict) {
    case "passed":
      return { ...counts, passed: counts.passed + 1 }
    case "failed":
      return { ...counts, failed: counts.failed + 1 }
    case "errored":
      return { ...counts, errored: counts.errored + 1 }
    default:
      return assertNever(verdict)
  }
}

function thresholdFailureLines(suites: readonly ResultSuite[]): readonly string[] {
  return suites.flatMap((suite) =>
    suite.thresholdFailures.map((failure) => `${suite.id}: ${formatThresholdFailure(failure)}`),
  )
}

function failedCaseRows(suites: readonly ResultSuite[]): readonly FailedCase[] {
  return suites.flatMap((suite) =>
    suite.cases
      .filter((resultCase) => resultCase.status === "failed" || resultCase.status === "errored")
      .map((resultCase) => ({
        suiteId: suite.id,
        caseId: resultCase.id,
        reason: caseReason(resultCase),
      })),
  )
}

function failedCaseMarkdownRows(failedCases: readonly FailedCase[]): readonly string[] {
  if (failedCases.length === 0) {
    return ["| None | None | No failed cases. |"]
  }

  return failedCases.map(
    (resultCase) =>
      `| ${escapeTableCell(resultCase.caseId)} | ${escapeTableCell(resultCase.suiteId)} | ${escapeTableCell(resultCase.reason)} |`,
  )
}

function suiteMarkdownRow(suite: ResultSuite): string {
  const notes = suite.thresholdFailures.map(formatThresholdFailure).join(", ")
  return `| ${escapeTableCell(suite.id)} | ${suite.verdict} | ${suite.passed} | ${suite.failed} | ${suite.errored} | ${escapeTableCell(notes)} |`
}

function formatThresholdFailure(failure: ThresholdFailure): string {
  switch (failure.metric) {
    case "passRate":
      return `passRate ${formatMetric(failure.actual)} < ${formatMetric(failure.expected)}`
    case "maxFailures":
      return `maxFailures ${formatMetric(failure.actual)} > ${formatMetric(failure.expected)}`
    case "maxErrors":
      return `maxErrors ${formatMetric(failure.actual)} > ${formatMetric(failure.expected)}`
    default:
      return assertNever(failure.metric)
  }
}

function formatMetric(value: number): string {
  return value.toFixed(2)
}

function caseReason(resultCase: ResultCase): string {
  return resultCase.reason ?? "No reason provided."
}

function nextLine(verdict: Verdict, failedCases: readonly FailedCase[]): string {
  if (verdict === "passed") {
    return "Next: no required threshold failures."
  }

  const cases =
    failedCases.length > 0
      ? failedCases.map((resultCase) => `${resultCase.suiteId}/${resultCase.caseId}`).join(", ")
      : "none"
  return `Next: inspect failed cases: ${cases}.`
}

function escapeTableCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ")
}

function assertNever(value: never): never {
  throw new Error(`Unexpected summary variant: ${String(value)}`)
}
