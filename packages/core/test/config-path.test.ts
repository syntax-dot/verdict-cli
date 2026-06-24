import { mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { checkConfigPath, EXIT_CODES } from "../src/index.js"

describe("checkConfigPath", () => {
  test("returns a usage error with a remediation hint when the config file is missing", async () => {
    // Given: a config path that does not exist.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-core-"))
    const configPath = path.join(workingDir, "missing-verdictci.yaml")

    // When: the config path is checked.
    const result = await checkConfigPath(configPath)

    // Then: callers receive the deterministic usage/config error contract.
    expect(result.ok).toBe(false)
    if (result.ok) {
      expect.fail("expected a missing config result")
    }
    expect(result.error.kind).toBe("missing_config")
    expect(result.error.exitCode).toBe(EXIT_CODES.usage)
    expect(result.error.configPath).toBe(configPath)
    expect(result.error.message).toContain(configPath)
    expect(result.error.remediation).toContain("verdictci.yaml")
  })
})
