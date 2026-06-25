import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import {
  EXIT_CODES,
  normalizePromptfooOutput,
  ResultArtifactSchema,
  runVerdictCI,
} from "../src/index.js"

describe("normalizePromptfooOutput", () => {
  test("maps successful promptfoo rows to VerdictCI passed cases", () => {
    // Given: a promptfoo JSON export with two successful rows.
    const result = normalizePromptfooOutput({
      suiteId: "support-bot-promptfoo",
      thresholds: { passRate: 1, maxFailures: 0, maxErrors: 0 },
      promptfooOutput: {
        version: 3,
        results: {
          stats: { successes: 2, failures: 0, errors: 0 },
          results: [
            { testIdx: 0, promptIdx: 0, success: true, score: 1, metadata: { caseId: "refund" } },
            {
              testIdx: 1,
              promptIdx: 0,
              success: true,
              score: 1,
              testCase: { vars: { id: "billing" } },
            },
          ],
        },
      },
    })

    // When: the output is normalized.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }

    // Then: VerdictCI receives summary-only passed case records.
    expect(result.value.verdict).toBe("passed")
    expect(result.value.passed).toBe(2)
    expect(result.value.failed).toBe(0)
    expect(result.value.cases.map((resultCase) => resultCase.id)).toEqual(["refund", "billing"])
  })

  test("maps promptfoo assertion failures to VerdictCI failed cases", () => {
    // Given: a promptfoo JSON export with one failed assertion row.
    const result = normalizePromptfooOutput({
      suiteId: "support-bot-promptfoo",
      thresholds: { passRate: 1, maxFailures: 0, maxErrors: 0 },
      promptfooOutput: {
        version: 3,
        results: {
          stats: { successes: 1, failures: 1, errors: 0 },
          results: [
            { testIdx: 0, promptIdx: 0, success: true, score: 1, metadata: { caseId: "refund" } },
            {
              testIdx: 1,
              promptIdx: 0,
              success: false,
              score: 0,
              response: { output: "raw output must not be copied" },
              gradingResult: { pass: false, score: 0, reason: "raw grader reason" },
              metadata: { caseId: "billing" },
            },
          ],
        },
      },
    })

    // When: the output is normalized.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }

    // Then: failures are counted without copying raw promptfoo response text.
    expect(result.value.verdict).toBe("failed")
    expect(result.value.failed).toBe(1)
    expect(result.value.thresholdFailures[0]?.metric).toBe("passRate")
    expect(JSON.stringify(result.value)).not.toContain("raw output must not be copied")
    expect(result.value.cases[1]?.reason).toBe("Promptfoo assertions failed.")
  })

  test("maps promptfoo error rows to provider runtime errors", () => {
    // Given: a promptfoo JSON export with a provider/runtime error.
    const result = normalizePromptfooOutput({
      suiteId: "support-bot-promptfoo",
      thresholds: { passRate: 1 },
      promptfooOutput: {
        version: 3,
        results: {
          stats: { successes: 0, failures: 0, errors: 1 },
          results: [{ testIdx: 0, promptIdx: 0, success: false, error: "provider timed out" }],
        },
      },
    })

    // When: the output is normalized.
    expect(result.ok).toBe(false)
    if (result.ok) {
      expect.fail("expected promptfoo provider error")
    }

    // Then: provider/runtime failures use exit code 3.
    expect(result.error.exitCode).toBe(EXIT_CODES.provider)
    expect(result.error.message).toContain("support-bot-promptfoo")
  })
})

describe("runVerdictCI with promptfoo", () => {
  test("writes a promptfoo-backed result artifact", async () => {
    // Given: a promptfoo config and a fake promptfoo command that writes JSON output.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-promptfoo-"))
    const configPath = path.join(workingDir, "verdictci.yaml")
    const promptfooConfigPath = path.join(workingDir, "promptfooconfig.yaml")
    const fakePromptfooPath = path.join(workingDir, "fake-promptfoo.mjs")
    const outputPath = path.join(workingDir, "result.json")
    await writePromptfooConfig(configPath)
    await writeFile(promptfooConfigPath, "prompts: []\nproviders: []\ntests: []\n", "utf8")
    await writeFakePromptfooCommand(fakePromptfooPath, {
      stats: { successes: 1, failures: 0, errors: 0 },
      rows: [{ testIdx: 0, promptIdx: 0, success: true, score: 1, metadata: { caseId: "refund" } }],
    })

    // When: the run executes the injected promptfoo command.
    const result = await runVerdictCI({
      configPath,
      outputPath,
      promptfooCommand: { executable: process.execPath, args: [fakePromptfooPath] },
    })

    // Then: the promptfoo output is normalized into VerdictCI result JSON.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }
    expect(result.value.exitCode).toBe(EXIT_CODES.passed)
    const artifact = ResultArtifactSchema.safeParse(JSON.parse(await readFile(outputPath, "utf8")))
    expect(artifact.success).toBe(true)
    if (!artifact.success) {
      expect.fail(artifact.error.message)
    }
    expect(artifact.data.run.mode).toBe("promptfoo")
    expect(artifact.data.summary.passed).toBe(1)
  })

  test("returns exit 3 and writes no artifact when promptfoo cannot run", async () => {
    // Given: a promptfoo suite and a command path that cannot execute.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-promptfoo-"))
    const configPath = path.join(workingDir, "verdictci.yaml")
    const promptfooConfigPath = path.join(workingDir, "promptfooconfig.yaml")
    const outputPath = path.join(workingDir, "result.json")
    await writePromptfooConfig(configPath)
    await writeFile(promptfooConfigPath, "prompts: []\nproviders: []\ntests: []\n", "utf8")

    // When: the promptfoo command fails before producing JSON output.
    const result = await runVerdictCI({
      configPath,
      outputPath,
      promptfooCommand: { executable: path.join(workingDir, "missing-promptfoo"), args: [] },
    })

    // Then: VerdictCI maps it to a provider/runtime error and leaves no result artifact.
    expect(result.ok).toBe(false)
    if (result.ok) {
      expect.fail("expected promptfoo runtime error")
    }
    expect(result.error.exitCode).toBe(EXIT_CODES.provider)
    expect(result.error.kind).toBe("provider_error")
  })
})

async function writePromptfooConfig(configPath: string): Promise<void> {
  await writeFile(
    configPath,
    [
      "version: 1",
      "name: promptfoo-evals",
      "defaults:",
      "  threshold:",
      "    passRate: 1",
      "    maxFailures: 0",
      "    maxErrors: 0",
      "suites:",
      "  - id: support-bot-promptfoo",
      "    adapter: promptfoo",
      "    cases: promptfooconfig.yaml",
      "    promptfoo:",
      "      config: promptfooconfig.yaml",
    ].join("\n"),
    "utf8",
  )
}

type FakePromptfooData = {
  readonly stats: {
    readonly successes: number
    readonly failures: number
    readonly errors: number
  }
  readonly rows: readonly Record<string, unknown>[]
}

async function writeFakePromptfooCommand(
  commandPath: string,
  data: FakePromptfooData,
): Promise<void> {
  await writeFile(
    commandPath,
    [
      "import { writeFileSync } from 'node:fs'",
      "const outputIndex = process.argv.indexOf('--output')",
      "if (outputIndex < 0) process.exit(1)",
      "const outputPath = process.argv.at(outputIndex + 1)",
      "if (outputPath === undefined) process.exit(1)",
      `writeFileSync(outputPath, ${JSON.stringify(
        JSON.stringify({
          version: 3,
          results: { stats: data.stats, results: data.rows },
        }),
      )})`,
    ].join("\n"),
    "utf8",
  )
}
