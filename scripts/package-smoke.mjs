import { spawn } from "node:child_process"
import { access, cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const smokeRoot = await mkdtemp(path.join(tmpdir(), "verdictci-package-smoke-"))
const packDir = path.join(smokeRoot, "pack")
const installDir = path.join(smokeRoot, "install")

try {
  await mkdir(packDir, { recursive: true })
  await mkdir(installDir, { recursive: true })

  await runPnpm(["build"], repoRoot)

  const packOutput = await runCommand({
    command: "npm",
    args: ["pack", "--json", "--pack-destination", packDir],
    cwd: repoRoot,
    shell: process.platform === "win32",
  })
  const packedArtifact = parsePackOutput(packOutput.stdout)
  verifyPackageFiles(packedArtifact.files)

  const tarballPath = path.join(packDir, packedArtifact.filename)
  await writeFile(
    path.join(installDir, "package.json"),
    `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
    "utf8",
  )
  await runPnpm(["add", tarballPath, "--ignore-scripts"], installDir)
  await cp(
    path.join(repoRoot, "examples", "support-bot"),
    path.join(installDir, "examples", "support-bot"),
    { recursive: true },
  )

  const verdictci = verdictciBinaryPath(installDir)
  const help = await runCommand({
    command: verdictci,
    args: ["--help"],
    cwd: installDir,
    shell: process.platform === "win32",
  })
  assertIncludes(help.stdout, "Usage:")
  assertIncludes(help.stdout, "run")
  assertIncludes(help.stdout, "--config")
  assertIncludes(help.stdout, "--output")

  const resultPath = path.join(installDir, "result.json")
  await runCommand({
    command: verdictci,
    args: [
      "run",
      "--config",
      "examples/support-bot/verdictci-pass.yaml",
      "--output",
      resultPath,
      "--fixture-mode",
    ],
    cwd: installDir,
    shell: process.platform === "win32",
  })
  await access(resultPath)
  const result = JSON.parse(await readFile(resultPath, "utf8"))
  if (result.schemaVersion !== 1 || result.summary?.verdict !== "passed") {
    throw new Error("Installed package fixture run did not write a passing VerdictCI artifact.")
  }

  console.log(`Package smoke passed: ${packedArtifact.filename}`)
} finally {
  await rm(smokeRoot, { recursive: true, force: true })
}

function runPnpm(args, cwd) {
  const pnpmEntrypoint = process.env.npm_execpath
  if (pnpmEntrypoint !== undefined && pnpmEntrypoint.trim() !== "") {
    return runCommand({
      command: process.execPath,
      args: [pnpmEntrypoint, ...args],
      cwd,
    })
  }
  return runCommand({ command: "pnpm", args, cwd, shell: process.platform === "win32" })
}

function runCommand(options) {
  return new Promise((resolve, reject) => {
    const command =
      options.shell === true ? shellCommand(options.command, options.args) : options.command
    const args = options.shell === true ? [] : options.args
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: options.shell ?? false,
      env: process.env,
    })

    let stdout = ""
    let stderr = ""
    child.stdout.setEncoding("utf8")
    child.stderr.setEncoding("utf8")
    child.stdout.on("data", (chunk) => {
      stdout += chunk
    })
    child.stderr.on("data", (chunk) => {
      stderr += chunk
    })
    child.on("error", reject)
    child.on("close", (exitCode) => {
      if (exitCode === 0) {
        resolve({ stdout, stderr })
        return
      }
      reject(
        new Error(commandFailureMessage(options.command, options.args, exitCode, stdout, stderr)),
      )
    })
  })
}

function shellCommand(command, args) {
  return [command, ...args].map(windowsShellQuote).join(" ")
}

function windowsShellQuote(value) {
  if (!/[&()^|<>"\s]/.test(value)) {
    return value
  }
  return `"${value.replaceAll('"', '\\"')}"`
}

function commandFailureMessage(command, args, exitCode, stdout, stderr) {
  return [
    `Command failed (${exitCode}): ${[command, ...args].join(" ")}`,
    stdout.trim(),
    stderr.trim(),
  ]
    .filter((line) => line !== "")
    .join("\n")
}

function parsePackOutput(stdout) {
  const parsed = JSON.parse(stdout)
  if (!Array.isArray(parsed) || parsed.length !== 1) {
    throw new Error("npm pack did not return exactly one package record.")
  }

  const [record] = parsed
  if (typeof record !== "object" || record === null) {
    throw new Error("npm pack returned an invalid package record.")
  }

  const filename = record.filename
  const files = record.files
  if (typeof filename !== "string" || !Array.isArray(files)) {
    throw new Error("npm pack record is missing filename or files.")
  }

  return {
    filename,
    files: files.map(packFilePath),
  }
}

function packFilePath(file) {
  if (typeof file !== "object" || file === null || typeof file.path !== "string") {
    throw new Error("npm pack returned an invalid file record.")
  }
  return file.path.replaceAll("\\", "/")
}

function verifyPackageFiles(files) {
  const requiredFiles = [
    "package.json",
    "dist/index.js",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
  ]
  for (const requiredFile of requiredFiles) {
    if (!files.includes(requiredFile)) {
      throw new Error(`Packed artifact is missing ${requiredFile}.`)
    }
  }

  for (const file of files) {
    if (isForbiddenPackageFile(file)) {
      throw new Error(`Packed artifact includes forbidden file: ${file}`)
    }
  }
}

function isForbiddenPackageFile(file) {
  const forbiddenPrefixes = [
    ".github/",
    ".omo/",
    ".tmp/",
    "docs/",
    "examples/",
    "node_modules/",
    "packages/",
    "scripts/",
  ]
  return (
    forbiddenPrefixes.some((prefix) => file.startsWith(prefix)) ||
    file.endsWith(".map") ||
    file.endsWith(".tsbuildinfo") ||
    file === ".env" ||
    file.startsWith(".env.") ||
    file.endsWith(".local")
  )
}

function verdictciBinaryPath(installPath) {
  const binaryName = process.platform === "win32" ? "verdictci.cmd" : "verdictci"
  return path.join(installPath, "node_modules", ".bin", binaryName)
}

function assertIncludes(value, expected) {
  if (!value.includes(expected)) {
    throw new Error(`Expected output to include: ${expected}`)
  }
}
