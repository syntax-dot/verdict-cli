import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { ExitCode, RunError } from "@verdictci/core"
import {
  EXIT_CODES,
  renderMarkdownSummary,
  renderTerminalSummary,
  runVerdictCI,
} from "@verdictci/core"
import { Command, CommanderError } from "commander"

const DEFAULT_OUTPUT_PATH = "verdictci-result.json"

type RunCommandOptions = {
  readonly config?: string
  readonly output: string
  readonly fixtureMode?: boolean
  readonly summary?: string
}

export async function main(argv: readonly string[] = process.argv): Promise<ExitCode> {
  let exitCode: ExitCode = EXIT_CODES.passed
  const program = createProgram(async (options) => {
    exitCode = await runCommand(options)
  })

  try {
    await program.parseAsync([...argv], { from: "node" })
    return exitCode
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.code === "commander.helpDisplayed") {
        return EXIT_CODES.passed
      }
      return EXIT_CODES.usage
    }
    throw error
  }
}

function createProgram(runAction: (options: RunCommandOptions) => Promise<void>): Command {
  const program = new Command()

  program
    .name("verdictci")
    .description("Eval-as-CI for LLM, agent, and RAG applications.")
    .version("0.1.0")
    .exitOverride()
    .showHelpAfterError("(add --help for usage)")
    .addHelpText(
      "after",
      `\nExamples:\n  $ verdictci run --config verdictci.yaml --output ${DEFAULT_OUTPUT_PATH}`,
    )

  program
    .command("run")
    .description("Run the configured VerdictCI eval suite.")
    .option("--config <path>", "Path to VerdictCI config.")
    .option("--output <path>", "Result JSON path.", DEFAULT_OUTPUT_PATH)
    .option("--summary <path>", "Write Markdown summary to path.")
    .option("--fixture-mode", "Use deterministic fixture outputs for examples and tests.")
    .action(runAction)

  return program
}

async function runCommand(options: RunCommandOptions): Promise<ExitCode> {
  if (options.config === undefined || options.config.trim() === "") {
    writeError([
      "Usage error: missing required --config <path>.",
      "Next: pass --config verdictci.yaml or --config evals.yaml.",
    ])
    return EXIT_CODES.usage
  }

  const runResult = await runVerdictCI({
    configPath: options.config,
    outputPath: options.output,
  })
  if (!runResult.ok) {
    writeRunError(runResult.error)
    return runResult.error.exitCode
  }

  process.stdout.write(
    renderTerminalSummary({ result: runResult.value.result, outputPath: options.output }),
  )
  if (options.summary !== undefined && options.summary.trim() !== "") {
    await writeMarkdownSummary(
      options.summary,
      renderMarkdownSummary({
        result: runResult.value.result,
        outputPath: options.output,
      }),
    )
  }
  return runResult.value.exitCode
}

function writeRunError(error: RunError): void {
  switch (error.kind) {
    case "missing_config":
    case "config_error":
      writeError([error.message, `Next: ${error.remediation}`])
      return
    case "case_file_error":
      writeError([error.message, `Next: ${error.remediation}`])
      return
    default:
      assertNever(error)
  }
}

function writeError(lines: readonly string[]): void {
  process.stderr.write(`${lines.join("\n")}\n`)
}

async function writeMarkdownSummary(summaryPath: string, summary: string): Promise<void> {
  await mkdir(path.dirname(path.resolve(summaryPath)), { recursive: true })
  await writeFile(summaryPath, summary, "utf8")
}

function assertNever(value: never): never {
  throw new Error(`Unexpected CLI variant: ${String(value)}`)
}

function isDirectInvocation(argv: readonly string[]): boolean {
  const invokedPath = argv[1]
  if (invokedPath === undefined) {
    return false
  }
  return path.resolve(invokedPath) === fileURLToPath(import.meta.url)
}

if (isDirectInvocation(process.argv)) {
  main()
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error)
      process.stderr.write(`Unexpected internal error: ${message}\n`)
      process.exitCode = EXIT_CODES.internal
    })
}
