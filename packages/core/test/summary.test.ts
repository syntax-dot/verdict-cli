import { describe, expect, test } from "vitest"
import type { ResultArtifact } from "../src/index.js"
import { renderMarkdownSummary, renderTerminalSummary } from "../src/index.js"

const failingResult: ResultArtifact = {
  schemaVersion: 1,
  tool: { name: "VerdictCI", version: "0.1.0" },
  run: {
    id: "local-2026-06-25T00-00-00Z",
    startedAt: "2026-06-25T00:00:00.000Z",
    durationMs: 123,
    configPath: "examples/support-bot/verdictci-fail.yaml",
    mode: "fixture",
  },
  summary: {
    verdict: "failed",
    suites: 2,
    cases: 4,
    passed: 2,
    failed: 1,
    skipped: 1,
    errored: 0,
  },
  suites: [
    {
      id: "support-bot",
      verdict: "failed",
      passed: 2,
      failed: 1,
      skipped: 0,
      errored: 0,
      thresholdFailures: [{ metric: "passRate", expected: 1, actual: 0.6666666667 }],
      cases: [
        {
          id: "refund-window",
          status: "failed",
          score: 0.2,
          reason: "Answer omitted required refund window.",
        },
      ],
    },
    {
      id: "tone-check",
      verdict: "passed",
      passed: 0,
      failed: 0,
      skipped: 1,
      errored: 0,
      thresholdFailures: [],
      cases: [{ id: "tone-advisory", status: "skipped", reason: "Advisory only." }],
    },
  ],
}

describe("summary renderers", () => {
  test("renders terminal summary with failed cases and threshold explanations", () => {
    // Given: a failed result artifact with one threshold failure.

    // When: the terminal summary is rendered.
    const summary = renderTerminalSummary({ result: failingResult, outputPath: "result.json" })

    // Then: the summary is concise but names the failed suite, case, and threshold.
    expect(summary).toContain("VerdictCI result: failed")
    expect(summary).toContain("Suites: 2 total, 1 passed, 1 failed, 0 errored")
    expect(summary).toContain("Cases: 4 total, 2 passed, 1 failed, 1 skipped, 0 errored")
    expect(summary).toContain("Threshold failures:")
    expect(summary).toContain("support-bot: passRate 0.67 < 1.00")
    expect(summary).toContain("Failed cases:")
    expect(summary).toContain("support-bot/refund-window")
    expect(summary).toContain("Answer omitted required refund window.")
    expect(summary).toContain("Output: result.json")
  })

  test("renders Markdown summary with suite and failed case tables", () => {
    // Given: a failed result artifact with one failed case.

    // When: the Markdown summary is rendered.
    const summary = renderMarkdownSummary({ result: failingResult, outputPath: "result.json" })

    // Then: the summary is readable as a CI Markdown artifact.
    expect(summary).toContain("# VerdictCI: failed")
    expect(summary).toContain("2 suites, 4 cases: 2 passed, 1 failed, 1 skipped, 0 errored.")
    expect(summary).toContain("| Suite | Verdict | Passed | Failed | Errored | Notes |")
    expect(summary).toContain("| support-bot | failed | 2 | 1 | 0 | passRate 0.67 < 1.00 |")
    expect(summary).toContain("## Failed cases")
    expect(summary).toContain(
      "| refund-window | support-bot | Answer omitted required refund window. |",
    )
    expect(summary).toContain("Result artifact: `result.json`")
  })
})
