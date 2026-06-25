import { z } from "zod"

export const CASE_STATUSES = ["passed", "failed", "skipped", "errored"] as const
export const VERDICTS = ["passed", "failed", "errored"] as const
export const RUN_MODES = ["fixture", "promptfoo", "mixed"] as const
export const THRESHOLD_METRICS = ["passRate", "maxFailures", "maxErrors"] as const

export type CaseStatus = (typeof CASE_STATUSES)[number]
export type Verdict = (typeof VERDICTS)[number]
export type RunMode = (typeof RUN_MODES)[number]
export type ThresholdMetric = (typeof THRESHOLD_METRICS)[number]

const ThresholdFailureSchema = z.object({
  metric: z.enum(THRESHOLD_METRICS),
  expected: z.number(),
  actual: z.number(),
})

const ResultCaseSchema = z.object({
  id: z.string().min(1),
  status: z.enum(CASE_STATUSES),
  score: z.number().optional(),
  reason: z.string().optional(),
})

const ResultSuiteSchema = z.object({
  id: z.string().min(1),
  verdict: z.enum(VERDICTS),
  passed: z.number().int().min(0),
  failed: z.number().int().min(0),
  skipped: z.number().int().min(0),
  errored: z.number().int().min(0),
  thresholdFailures: z.array(ThresholdFailureSchema),
  cases: z.array(ResultCaseSchema),
})

export const ResultArtifactSchema = z.object({
  schemaVersion: z.literal(1),
  tool: z.object({
    name: z.literal("VerdictCI"),
    version: z.string().min(1),
  }),
  run: z.object({
    id: z.string().min(1),
    startedAt: z.string().datetime(),
    durationMs: z.number().int().min(0),
    configPath: z.string().min(1),
    mode: z.enum(RUN_MODES),
  }),
  summary: z.object({
    verdict: z.enum(VERDICTS),
    suites: z.number().int().min(0),
    cases: z.number().int().min(0),
    passed: z.number().int().min(0),
    failed: z.number().int().min(0),
    skipped: z.number().int().min(0),
    errored: z.number().int().min(0),
  }),
  suites: z.array(ResultSuiteSchema),
})

export type ThresholdFailure = {
  readonly metric: ThresholdMetric
  readonly expected: number
  readonly actual: number
}

export type ResultCase = {
  readonly id: string
  readonly status: CaseStatus
  readonly score?: number
  readonly reason?: string
}

export type ResultSuite = {
  readonly id: string
  readonly verdict: Verdict
  readonly passed: number
  readonly failed: number
  readonly skipped: number
  readonly errored: number
  readonly thresholdFailures: readonly ThresholdFailure[]
  readonly cases: readonly ResultCase[]
}

export type ResultArtifact = {
  readonly schemaVersion: 1
  readonly tool: {
    readonly name: "VerdictCI"
    readonly version: string
  }
  readonly run: {
    readonly id: string
    readonly startedAt: string
    readonly durationMs: number
    readonly configPath: string
    readonly mode: RunMode
  }
  readonly summary: {
    readonly verdict: Verdict
    readonly suites: number
    readonly cases: number
    readonly passed: number
    readonly failed: number
    readonly skipped: number
    readonly errored: number
  }
  readonly suites: readonly ResultSuite[]
}

export type Counts = {
  readonly passed: number
  readonly failed: number
  readonly skipped: number
  readonly errored: number
}

export type Thresholds = {
  readonly passRate?: number
  readonly maxFailures?: number
  readonly maxErrors?: number
}

export function countCases(cases: readonly ResultCase[]): Counts {
  return cases.reduce<Counts>((counts, resultCase) => incrementCount(counts, resultCase.status), {
    passed: 0,
    failed: 0,
    skipped: 0,
    errored: 0,
  })
}

export function applyThresholds(
  counts: Counts,
  thresholds: Thresholds,
): readonly ThresholdFailure[] {
  const failures: ThresholdFailure[] = []
  const evaluatedCases = counts.passed + counts.failed + counts.errored
  const passRate = evaluatedCases === 0 ? 1 : counts.passed / evaluatedCases

  if (thresholds.passRate !== undefined && passRate < thresholds.passRate) {
    failures.push({
      metric: "passRate",
      expected: thresholds.passRate,
      actual: passRate,
    })
  }
  if (thresholds.maxFailures !== undefined && counts.failed > thresholds.maxFailures) {
    failures.push({
      metric: "maxFailures",
      expected: thresholds.maxFailures,
      actual: counts.failed,
    })
  }
  if (thresholds.maxErrors !== undefined && counts.errored > thresholds.maxErrors) {
    failures.push({
      metric: "maxErrors",
      expected: thresholds.maxErrors,
      actual: counts.errored,
    })
  }

  return failures
}

export function suiteVerdict(
  counts: Counts,
  thresholdFailures: readonly ThresholdFailure[],
): Verdict {
  if (thresholdFailures.length > 0) {
    return "failed"
  }
  if (counts.errored > 0) {
    return "errored"
  }
  return "passed"
}

function incrementCount(counts: Counts, status: CaseStatus): Counts {
  switch (status) {
    case "passed":
      return { ...counts, passed: counts.passed + 1 }
    case "failed":
      return { ...counts, failed: counts.failed + 1 }
    case "skipped":
      return { ...counts, skipped: counts.skipped + 1 }
    case "errored":
      return { ...counts, errored: counts.errored + 1 }
    default:
      return assertNever(status)
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected case status: ${String(value)}`)
}
