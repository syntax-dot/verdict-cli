import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { EXIT_CODES, ResultArtifactSchema, runVerdictCI } from "../src/index.js"

describe("runVerdictCI", () => {
  test("writes a passing fixture result artifact with the documented shape", async () => {
    // Given: a passing fixture config and output path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-run-"))
    const configPath = path.join(workingDir, "verdictci.yaml")
    const outputPath = path.join(workingDir, "result.json")
    await writeFixtureRunFiles(workingDir, "passed")

    // When: the fixture run is executed.
    const result = await runVerdictCI({ configPath, outputPath })

    // Then: the result passes and the JSON artifact validates against the schema.
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
    expect(artifact.data.schemaVersion).toBe(1)
    expect(artifact.data.run.mode).toBe("fixture")
    expect(artifact.data.summary.verdict).toBe("passed")
    expect(artifact.data.summary.passed).toBe(1)
    expect(artifact.data.suites[0]?.cases[0]?.id).toBe("refund-window")
  })

  test("writes a failing fixture artifact when required thresholds fail", async () => {
    // Given: a fixture config with one failed case and strict thresholds.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-run-"))
    const configPath = path.join(workingDir, "verdictci.yaml")
    const outputPath = path.join(workingDir, "result.json")
    await writeFixtureRunFiles(workingDir, "failed")

    // When: the fixture run is executed.
    const result = await runVerdictCI({ configPath, outputPath })

    // Then: the run exits as a required eval failure and records threshold failures.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }
    expect(result.value.exitCode).toBe(EXIT_CODES.failed)
    expect(result.value.result.summary.verdict).toBe("failed")
    expect(result.value.result.suites[0]?.thresholdFailures[0]?.metric).toBe("passRate")
  })
})

async function writeFixtureRunFiles(
  workingDir: string,
  fixtureStatus: "passed" | "failed",
): Promise<void> {
  const configPath = path.join(workingDir, "verdictci.yaml")
  const casesPath = path.join(workingDir, "cases.jsonl")
  await writeFile(
    configPath,
    [
      "version: 1",
      "name: support-bot-evals",
      "defaults:",
      "  threshold:",
      "    passRate: 1",
      "    maxFailures: 0",
      "    maxErrors: 0",
      "suites:",
      "  - id: support-bot",
      "    adapter: fixture",
      "    cases: cases.jsonl",
    ].join("\n"),
    "utf8",
  )
  await writeFile(
    casesPath,
    `{"id":"refund-window","input":"Can I get a refund after 45 days?","expected":"Must state refund window.","fixture":{"status":"${fixtureStatus}","score":1,"reason":"Fixture outcome."}}\n`,
    "utf8",
  )
}
