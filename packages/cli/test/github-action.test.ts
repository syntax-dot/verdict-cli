import { spawn } from "node:child_process"
import { access, mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const actionMetadataPath = path.join(repoRoot, "action.yml")
const workflowPath = path.join(repoRoot, ".github/workflows/verdictci.yml")
const runnerPath = path.join(repoRoot, "scripts/github-action/run-verdictci.sh")
const gitBashPath = "C:\\Program Files\\Git\\bin\\bash.exe"

type ProcessResult = {
  readonly exitCode: number | null
  readonly stdout: string
  readonly stderr: string
}

type ActionScriptEnv = Readonly<Record<string, string>>

function runActionScript(env: ActionScriptEnv): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(gitBashPath, [toGitBashPath(runnerPath)], {
      cwd: repoRoot,
      env: { ...process.env, ...env },
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

function toGitBashPath(filePath: string): string {
  const normalizedPath = filePath.replaceAll("\\", "/")
  const driveMatch = /^([A-Za-z]):\/(.*)$/.exec(normalizedPath)
  if (driveMatch === null) {
    return normalizedPath
  }

  const driveLetter = driveMatch.at(1)
  const drivePath = driveMatch.at(2)
  if (driveLetter === undefined || drivePath === undefined) {
    return normalizedPath
  }

  return `/${driveLetter.toLowerCase()}/${drivePath}`
}

function nodeExecutable(): string {
  const { VERDICTCI_NODE } = process.env
  return VERDICTCI_NODE ?? process.execPath
}

function baseActionEnv(workingDir: string): ActionScriptEnv {
  return {
    GITHUB_ACTION_PATH: toGitBashPath(repoRoot),
    GITHUB_WORKSPACE: toGitBashPath(repoRoot),
    GITHUB_OUTPUT: toGitBashPath(path.join(workingDir, "github-output.txt")),
    GITHUB_STEP_SUMMARY: toGitBashPath(path.join(workingDir, "github-step-summary.md")),
    INPUT_ARTIFACT_NAME: "verdictci-result",
    INPUT_CONFIG: "examples/support-bot/verdictci-fail.yaml",
    INPUT_FAIL_ON: "fail",
    INPUT_FIXTURE_MODE: "true",
    INPUT_OUTPUT: toGitBashPath(path.join(workingDir, "action-result.json")),
    INPUT_SUMMARY: toGitBashPath(path.join(workingDir, "action-summary.md")),
    INPUT_UPLOAD_ARTIFACT: "true",
    VERDICTCI_NODE: nodeExecutable(),
  }
}

describe("VerdictCI GitHub Action", () => {
  test("declares the Milestone 4 composite action contract", async () => {
    // Given: the public action metadata at the repository root.
    expect(
      await pathExists(actionMetadataPath),
      "action.yml must exist at the repository root",
    ).toBe(true)

    // When: the action metadata is inspected.
    const metadata = await readFile(actionMetadataPath, "utf8")

    // Then: it exposes the narrow composite action wrapper around the CLI.
    expect(metadata).toContain("using: composite")
    expect(metadata).toContain("config:")
    expect(metadata).toContain("output:")
    expect(metadata).toContain("summary:")
    expect(metadata).toContain("fixture-mode:")
    expect(metadata).toContain("fail-on:")
    expect(metadata).toContain("upload-artifact:")
    expect(metadata).toContain("artifact-name:")
    expect(metadata).toContain("verdict:")
    expect(metadata).toContain("result-path:")
    expect(metadata).toContain("passed:")
    expect(metadata).toContain("failed:")
    expect(metadata).toContain("errored:")
    expect(metadata).toContain("uses: actions/setup-node@v6")
    expect(metadata).toContain('node-version: "24"')
    expect(metadata).toContain("pnpm@11.7.0")
    expect(metadata).toContain("scripts/github-action/run-verdictci.sh")
    expect(metadata).toContain("uses: actions/upload-artifact@v6")
    expect(metadata).toContain("steps.run.outputs.exit-code")
  })

  test("provides a minimal repository workflow example", async () => {
    // Given: the repository workflow example path.
    expect(await pathExists(workflowPath), "the VerdictCI workflow example must exist").toBe(true)

    // When: the workflow is inspected.
    const workflow = await readFile(workflowPath, "utf8")

    // Then: it shows the local composite action against the canonical support-bot config.
    expect(workflow).toContain("actions/checkout@v6")
    expect(workflow).toContain("uses: ./")
    expect(workflow).toContain("config: examples/support-bot/verdictci.yaml")
    expect(workflow).toContain("output: .tmp/verdictci-result.json")
    expect(workflow).toContain('fixture-mode: "true"')
  })

  test("simulates a failing fixture run while preserving action continuation outputs", async () => {
    // Given: GitHub Actions environment files and a failing support-bot fixture config.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-action-"))
    const githubOutputPath = path.join(workingDir, "github-output.txt")
    const stepSummaryPath = path.join(workingDir, "github-step-summary.md")
    const resultPath = path.join(workingDir, "action-result.json")
    const summaryPath = path.join(workingDir, "action-summary.md")

    try {
      // When: the runner script executes the CLI wrapper locally.
      const result = await runActionScript(baseActionEnv(workingDir))

      // Then: the script lets later composite steps run while exposing the CLI failure.
      expect(result.exitCode).toBe(0)
      expect(result.stderr).not.toContain("Unexpected internal error")
      expect(await pathExists(resultPath)).toBe(true)
      expect(await pathExists(summaryPath)).toBe(true)
      expect(await readFile(resultPath, "utf8")).toContain('"verdict": "failed"')
      expect(await readFile(summaryPath, "utf8")).toContain("# VerdictCI: failed")
      expect(await readFile(stepSummaryPath, "utf8")).toContain("# VerdictCI: failed")

      const actionOutput = await readFile(githubOutputPath, "utf8")
      expect(actionOutput).toContain("exit-code=1")
      expect(actionOutput).toContain("verdict=failed")
      expect(actionOutput).toContain(`result-path=${toGitBashPath(resultPath)}`)
      expect(actionOutput).toContain("failed=1")
      expect(actionOutput).toContain("result-exists=true")
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })

  test("maps unsupported fail-on mode to a captured usage error", async () => {
    // Given: an unsupported fail-on mode and GitHub Actions environment files.
    const workingDir = await mkdtemp(path.join(tmpdir(), "verdictci-action-"))
    const githubOutputPath = path.join(workingDir, "github-output.txt")
    const resultPath = path.join(workingDir, "action-result.json")

    try {
      // When: the runner script validates action-specific inputs.
      const result = await runActionScript({ ...baseActionEnv(workingDir), INPUT_FAIL_ON: "warn" })

      // Then: the composite action can publish the usage error before the final fail step.
      expect(result.exitCode).toBe(0)
      expect(await pathExists(resultPath)).toBe(false)

      const actionOutput = await readFile(githubOutputPath, "utf8")
      expect(actionOutput).toContain("exit-code=2")
      expect(actionOutput).toContain("verdict=errored")
      expect(actionOutput).toContain("result-exists=false")
    } finally {
      await rm(workingDir, { force: true, recursive: true })
    }
  })
})
