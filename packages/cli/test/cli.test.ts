import { access, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"
import { describe, expect, test } from "vitest"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const cliPath = path.join(repoRoot, "packages/cli/src/index.ts")
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

type CliResult = {
  readonly exitCode: number | null
  readonly stdout: string
  readonly stderr: string
}

function runCli(args: readonly string[]): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(pnpmCommand, ["exec", "tsx", cliPath, ...args], {
      cwd: repoRoot,
      env: process.env,
      shell: process.platform === "win32"
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
  } catch (error) {
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

  test("accepts the output flag without rejecting it as an unknown option", async () => {
    // Given: an existing config file and an explicit output path.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-cli-"))
    const configPath = path.join(workingDir, "verdictci.yaml")
    const outputPath = path.join(workingDir, "result.json")

    try {
      await writeFile(configPath, "version: 1\nname: placeholder\nsuites: []\n", "utf8")

      // When: the command is executed with --output.
      const result = await runCli(["run", "--config", configPath, "--output", outputPath])

      // Then: Milestone 1 accepts the option while refusing to claim eval execution.
      expect(result.exitCode).toBe(2)
      expect(result.stderr).not.toContain("unknown option")
      expect(result.stderr).toContain("Milestone 2")
      expect(await pathExists(outputPath)).toBe(false)
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })
})
