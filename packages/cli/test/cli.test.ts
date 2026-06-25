import { spawn } from "node:child_process"
import { access, mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const cliPath = path.join(repoRoot, "packages/cli/src/index.ts")
const tsxCliPath = path.join(repoRoot, "node_modules/tsx/dist/cli.mjs")

type CliResult = {
  readonly exitCode: number | null
  readonly stdout: string
  readonly stderr: string
}

function runCli(args: readonly string[]): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsxCliPath, cliPath, ...args], {
      cwd: repoRoot,
      env: process.env,
      shell: false,
    })

    let stdout = ""
    let stderr = ""

    child.stdout.setEncoding("utf8")
    child.stderr.setEncoding("utf8")

    child.stdout.on("data", (chunk: string) => {
      stdout += chunk
    })
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk
    })
    child.on("error", reject)
    child.on("close", (exitCode) => {
      resolve({ exitCode, stdout, stderr })
    })
  })
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

describe("verdictci CLI", () => {
  test("prints help that names the run command and config flags", async () => {
    // Given: the VerdictCI CLI entrypoint.

    // When: help is requested.
    const result = await runCli(["--help"])

    // Then: the CLI exposes the Milestone 1 command surface.
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Usage:")
    expect(result.stdout).toContain("run")
    expect(result.stdout).toContain("--config")
    expect(result.stdout).toContain("--output")
  })

  test("exits 2 with a remediation hint when run is missing the config flag", async () => {
    // Given: the run command without the required config flag.

    // When: the command is executed.
    const result = await runCli(["run"])

    // Then: it fails as a usage error with a clear next step.
    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain("--config")
    expect(result.stderr).toContain("Next:")
  })

  test("exits 2 with the missing config path and does not write an output artifact", async () => {
    // Given: a missing config path and an explicit output path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cli-"))
    const configPath = path.join(workingDir, "missing-verdictci.yaml")
    const outputPath = path.join(workingDir, "verdictci-result.json")

    try {
      // When: the run command checks the missing config.
      const result = await runCli(["run", "--config", configPath, "--output", outputPath])

      // Then: it reports the missing path and leaves result artifacts for later milestones.
      expect(result.exitCode).toBe(2)
      expect(result.stderr).toContain(configPath)
      expect(result.stderr).toContain("verdictci.yaml")
      expect(await pathExists(outputPath)).toBe(false)
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })

  test("runs a passing fixture config and writes the result artifact", async () => {
    // Given: a passing fixture config and an explicit output path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cli-"))
    const outputPath = path.join(workingDir, "result.json")

    try {
      // When: the command runs the fixture suite.
      const result = await runCli([
        "run",
        "--config",
        "examples/support-bot/verdictci-pass.yaml",
        "--output",
        outputPath,
        "--fixture-mode",
      ])

      // Then: the CLI reports a passing verdict and writes stable JSON.
      expect(result.exitCode).toBe(0)
      expect(result.stderr).not.toContain("unknown option")
      expect(result.stdout).toContain("VerdictCI result: passed")
      expect(await pathExists(outputPath)).toBe(true)
      expect(await readFile(outputPath, "utf8")).toContain('"schemaVersion": 1')
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })

  test("runs a failing fixture config and exits 1 with a result artifact", async () => {
    // Given: a failing fixture config and an explicit output path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cli-"))
    const outputPath = path.join(workingDir, "result.json")

    try {
      // When: the command runs the fixture suite.
      const result = await runCli([
        "run",
        "--config",
        "examples/support-bot/verdictci-fail.yaml",
        "--output",
        outputPath,
        "--fixture-mode",
      ])

      // Then: the CLI exits with a required eval failure and names the failed case.
      expect(result.exitCode).toBe(1)
      expect(result.stdout).toContain("VerdictCI result: failed")
      expect(result.stdout).toContain("refund-window")
      expect(await pathExists(outputPath)).toBe(true)
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })

  test("writes a readable Markdown summary when summary output is requested", async () => {
    // Given: a failing fixture config with JSON and Markdown output paths.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cli-"))
    const outputPath = path.join(workingDir, "result.json")
    const summaryPath = path.join(workingDir, "summary.md")

    try {
      // When: the command runs with an explicit summary path.
      const result = await runCli([
        "run",
        "--config",
        "examples/support-bot/verdictci-fail.yaml",
        "--output",
        outputPath,
        "--summary",
        summaryPath,
        "--fixture-mode",
      ])

      // Then: the CLI preserves exit 1 and writes a Markdown failed-case table.
      expect(result.exitCode).toBe(1)
      expect(await pathExists(outputPath)).toBe(true)
      expect(await pathExists(summaryPath)).toBe(true)
      const summary = await readFile(summaryPath, "utf8")
      expect(summary).toContain("# VerdictCI: failed")
      expect(summary).toContain(
        "| refund-window | support-bot | Answer omitted required refund window. |",
      )
      expect(summary).toContain("Result artifact:")
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })

  test("exits 2 and writes no artifact when config validation fails", async () => {
    // Given: an invalid config and an explicit output path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cli-"))
    const outputPath = path.join(workingDir, "result.json")

    try {
      // When: the command validates config before running suites.
      const result = await runCli([
        "run",
        "--config",
        "examples/broken/verdictci.yaml",
        "--output",
        outputPath,
      ])

      // Then: the CLI reports a usage/config error and leaves no artifact behind.
      expect(result.exitCode).toBe(2)
      expect(result.stderr).toContain("suites")
      expect(result.stderr).toContain("Next:")
      expect(await pathExists(outputPath)).toBe(false)
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })
})
