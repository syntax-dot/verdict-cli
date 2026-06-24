import path from "node:path"
import { fileURLToPath } from "node:url"
import type { ExitCode, MissingConfigError } from "@verdictci/core"
import { checkConfigPath, EXIT_CODES } from "@verdictci/core"
import { Command, CommanderError } from "commander"

const DEFAULT_OUTPUT_PATH = "verdictci-result.json"

type RunCommandOptions = {
  readonly config?: string
  readonly output: string
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

  const configResult = await checkConfigPath(options.config)
  if (!configResult.ok) {
    writeMissingConfig(configResult.error)
    return configResult.error.exitCode
  }

  writeError([
    "VerdictCI run skeleton found the config file, but eval execution is planned for Milestone 2.",
    `Output: ${options.output}`,
    "Next: implement config parsing, fixture execution, and result JSON writing in Milestone 2.",
  ])
  return EXIT_CODES.usage
}

function writeMissingConfig(error: MissingConfigError): void {
  writeError([error.message, `Next: ${error.remediation}`])
}

function writeError(lines: readonly string[]): void {
  process.stderr.write(`${lines.join("\n")}\n`)
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
