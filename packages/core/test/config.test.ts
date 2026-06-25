import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { EXIT_CODES, loadConfig } from "../src/index.js"

describe("loadConfig", () => {
  test("applies defaults and resolves case paths relative to the config file", async () => {
    // Given: a config in a nested directory with a relative cases path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-config-"))
    const configDir = path.join(workingDir, "evals")
    const casesPath = path.join(configDir, "cases.jsonl")
    const configPath = path.join(configDir, "verdictci.yaml")
    await mkdir(configDir, { recursive: true })
    await writeFile(casesPath, "", "utf8")
    await writeFile(
      configPath,
      [
        "version: 1",
        "name: support-bot-evals",
        "defaults:",
        "  required: false",
        "  threshold:",
        "    passRate: 0.75",
        "suites:",
        "  - id: support-bot",
        "    adapter: fixture",
        "    cases: cases.jsonl",
      ].join("\n"),
      "utf8",
    )

    // When: the config is loaded.
    const result = await loadConfig(configPath)

    // Then: suite defaults are applied and the cases path is normalized.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }
    expect(result.value.name).toBe("support-bot-evals")
    expect(result.value.suites).toHaveLength(1)
    expect(result.value.suites[0]?.required).toBe(false)
    expect(result.value.suites[0]?.thresholds.passRate).toBe(0.75)
    expect(result.value.suites[0]?.casesPath).toBe(casesPath)
  })

  test("returns exit 2 with field path and remediation when suites is empty", async () => {
    // Given: a config that violates the non-empty suite requirement.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-config-"))
    const configPath = path.join(workingDir, "verdictci.yaml")
    await writeFile(configPath, "version: 1\nname: broken\nsuites: []\n", "utf8")

    // When: the config is loaded.
    const result = await loadConfig(configPath)

    // Then: callers receive a deterministic usage/config error.
    expect(result.ok).toBe(false)
    if (result.ok) {
      expect.fail("expected a config validation error")
    }
    expect(result.error.exitCode).toBe(EXIT_CODES.usage)
    expect(result.error.configPath).toBe(configPath)
    expect(result.error.message).toContain("suites")
    expect(result.error.remediation).toContain("Fix")
  })

  test("resolves promptfoo config paths relative to the VerdictCI config file", async () => {
    // Given: a promptfoo suite with a suite-local promptfoo config path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-config-"))
    const configDir = path.join(workingDir, "evals")
    const promptfooConfigPath = path.join(configDir, "promptfooconfig.yaml")
    const configPath = path.join(configDir, "verdictci.yaml")
    await mkdir(configDir, { recursive: true })
    await writeFile(promptfooConfigPath, "prompts: []\nproviders: []\ntests: []\n", "utf8")
    await writeFile(
      configPath,
      [
        "version: 1",
        "name: promptfoo-evals",
        "suites:",
        "  - id: support-bot-promptfoo",
        "    adapter: promptfoo",
        "    cases: promptfooconfig.yaml",
        "    promptfoo:",
        "      config: promptfooconfig.yaml",
      ].join("\n"),
      "utf8",
    )

    // When: the config is loaded.
    const result = await loadConfig(configPath)

    // Then: the promptfoo config is normalized without changing fixture behavior.
    expect(result.ok).toBe(true)
    if (!result.ok) {
      expect.fail(result.error.message)
    }
    expect(result.value.suites[0]?.adapter).toBe("promptfoo")
    expect(result.value.suites[0]?.promptfoo?.configPath).toBe(promptfooConfigPath)
  })
})
