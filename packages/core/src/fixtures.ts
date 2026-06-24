import { readFile } from "node:fs/promises"
import { z } from "zod"
import type { CaseFileError, Result } from "./errors.js"
import { caseFileError, err, ok } from "./errors.js"
import { CASE_STATUSES, type CaseStatus } from "./result.js"

const FixtureOutcomeSchema = z
  .object({
    status: z.enum(CASE_STATUSES),
    score: z.number().min(0).max(1).optional(),
    reason: z.string().min(1).optional(),
  })
  .strict()

const FixtureCaseSchema = z
  .object({
    id: z.string().min(1),
    input: z.string(),
    expected: z.string(),
    fixture: FixtureOutcomeSchema,
  })
  .strict()

type RawFixtureCase = z.infer<typeof FixtureCaseSchema>

export type FixtureOutcome = {
  readonly status: CaseStatus
  readonly score?: number
  readonly reason?: string
}

export type FixtureCase = {
  readonly id: string
  readonly input: string
  readonly expected: string
  readonly fixture: FixtureOutcome
  readonly source: {
    readonly casesPath: string
    readonly line: number
  }
}

export type FixtureCaseLoadResult = Result<readonly FixtureCase[], CaseFileError>

export async function loadFixtureCases(casesPath: string): Promise<FixtureCaseLoadResult> {
  let fileText: string
  try {
    fileText = await readFile(casesPath, "utf8")
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return err(
      caseFileError({
        casesPath,
        message: `Could not read fixture cases at ${casesPath}: ${message}`,
        remediation: `Create the cases file or update the suite cases path in the VerdictCI config.`,
      }),
    )
  }

  const cases: FixtureCase[] = []
  const lines = fileText.split(/\r?\n/)
  for (const [index, line] of lines.entries()) {
    if (line.trim() === "") {
      continue
    }

    const parsedLine = parseJsonLine(casesPath, index + 1, line)
    if (!parsedLine.ok) {
      return parsedLine
    }

    cases.push(normalizeFixtureCase(casesPath, index + 1, parsedLine.value))
  }

  return ok(cases)
}

function parseJsonLine(
  casesPath: string,
  line: number,
  text: string,
): Result<RawFixtureCase, CaseFileError> {
  let decoded: unknown
  try {
    decoded = JSON.parse(text)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return err(
      caseFileError({
        casesPath,
        line,
        message: `Invalid JSONL in ${casesPath} at line ${line}: ${message}`,
        remediation: "Fix the malformed JSON object in the fixture case file.",
      }),
    )
  }

  const parsedCase = FixtureCaseSchema.safeParse(decoded)
  if (!parsedCase.success) {
    const firstIssue = parsedCase.error.issues[0]
    const issuePath = firstIssue?.path.join(".") ?? "case"
    const issueMessage = firstIssue?.message ?? "Case does not match the fixture schema."
    return err(
      caseFileError({
        casesPath,
        line,
        message: `Invalid fixture case in ${casesPath} at line ${line}, field ${issuePath}: ${issueMessage}`,
        remediation: "Fix the case to include id, input, expected, and fixture.status.",
      }),
    )
  }

  return ok(parsedCase.data)
}

function normalizeFixtureCase(
  casesPath: string,
  line: number,
  fixtureCase: RawFixtureCase,
): FixtureCase {
  return {
    id: fixtureCase.id,
    input: fixtureCase.input,
    expected: fixtureCase.expected,
    fixture: normalizeFixtureOutcome(fixtureCase.fixture),
    source: { casesPath, line },
  }
}

function normalizeFixtureOutcome(outcome: RawFixtureCase["fixture"]): FixtureOutcome {
  const base = {
    status: outcome.status,
  } satisfies Pick<FixtureOutcome, "status">

  return {
    ...base,
    ...(outcome.score !== undefined ? { score: outcome.score } : {}),
    ...(outcome.reason !== undefined ? { reason: outcome.reason } : {}),
  }
}
