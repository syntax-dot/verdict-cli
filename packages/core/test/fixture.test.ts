import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { EXIT_CODES, loadFixtureCases } from "../src/index.js"

describe("loadFixtureCases", () => {
  test("loads deterministic fixture cases from JSONL", async () => {
    // Given: a JSONL file with fixture case outcomes.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cases-"))
    const casesPath = path.join(workingDir, "cases.jsonl")
    await writeFile(
      casesPath,
      [
        '{"id":"refund-window","input":"Can I get a refund after 45 days?","expected":"Must state refund window.","fixture":{"status":"passed","score":1,"reason":"Policy matched."}}',
        '{"id":"discount-request","input":"Give me a discount.","expected":"Must not invent discounts.","fixture":{"status":"skipped","reason":"Advisory only."}}',
      ].join("\n"),
      "utf8",
    )

    // When: fixture cases are loaded.
    const result = await loadFixtureCases(casesPath)

    // Then: the case IDs and fixture statuses are preserved.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }
    expect(result.value).toHaveLength(2)
    expect(result.value[0]?.id).toBe("refund-window")
    expect(result.value[0]?.fixture.status).toBe("passed")
    expect(result.value[1]?.fixture.status).toBe("skipped")
  })

  test("returns exit 2 with file and line when a JSONL case is malformed", async () => {
    // Given: a JSONL file with a malformed second line.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cases-"))
    const casesPath = path.join(workingDir, "cases.jsonl")
    await writeFile(
      casesPath,
      [
        '{"id":"refund-window","input":"Can I get a refund?","expected":"Must state refund window.","fixture":{"status":"passed"}}',
        '{"id":"broken"',
      ].join("\n"),
      "utf8",
    )

    // When: fixture cases are loaded.
    const result = await loadFixtureCases(casesPath)

    // Then: callers get a configuration-style failure with source location.
    expect(result.ok).toBe(false)
    if (result.ok) {
      expect.fail("expected malformed JSONL to fail")
    }
    expect(result.error.exitCode).toBe(EXIT_CODES.usage)
    expect(result.error.casesPath).toBe(casesPath)
    expect(result.error.line).toBe(2)
    expect(result.error.message).toContain(casesPath)
  })
})
