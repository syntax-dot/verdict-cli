import path from "node:path"
import { fileURLToPath } from "node:url"
import type { ExitCode, ResultArtifact, ResultSuite, RunError, Verdict } from "@verdictci/core"
import { EXIT_CODES, runVerdictCI } from "@verdictci/core"
import { Command, CommanderError } from "commander"

const DEFAULT_OUTPUT_PATH = "verdictci-result.json"

type RunCommandOptions = {
  readonly config?: string
  readonly output: string
  readonly fixtureMode?: boolean
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

  writeSummary(runResult.value.result, options.output)
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

function writeSummary(result: ResultArtifact, outputPath: string): void {
  const suiteCounts = countSuites(result.suites)
  const failedCases = result.suites.flatMap((suite) =>
    suite.cases
      .filter((resultCase) => resultCase.status === "failed" || resultCase.status === "errored")
      .map((resultCase) => `${suite.id}/${resultCase.id}`),
  )
  const lines = [
    `VerdictCI result: ${result.summary.verdict}`,
    `Suites: ${result.summary.suites} total, ${suiteCounts.passed} passed, ${suiteCounts.failed} failed, ${suiteCounts.errored} errored`,
    `Cases: ${result.summary.cases} total, ${result.summary.passed} passed, ${result.summary.failed} failed, ${result.summary.skipped} skipped, ${result.summary.errored} errored`,
    `Output: ${outputPath}`,
    nextLine(result.summary.verdict, failedCases),
  ]

  process.stdout.write(`${lines.join("\n")}\n`)
}

function countSuites(suites: readonly ResultSuite[]): SuiteCounts {
  return suites.reduce<SuiteCounts>((counts, suite) => incrementSuiteCount(counts, suite.verdict), {
    passed: 0,
    failed: 0,
    errored: 0,
  })
}

function incrementSuiteCount(counts: SuiteCounts, verdict: Verdict): SuiteCounts {
  switch (verdict) {
    case "passed":
      return { ...counts, passed: counts.passed + 1 }
    case "failed":
      return { ...counts, failed: counts.failed + 1 }
    case "errored":
      return { ...counts, errored: counts.errored + 1 }
    default:
      return assertNever(verdict)
  }
}

function nextLine(verdict: Verdict, failedCases: readonly string[]): string {
  if (verdict === "passed") {
    return "Next: no required threshold failures."
  }

  const cases = failedCases.length > 0 ? failedCases.join(", ") : "none"
  return `Next: inspect failed cases: ${cases}.`
}

function writeError(lines: readonly string[]): void {
  process.stderr.write(`${lines.join("\n")}\n`)
}

type SuiteCounts = {
  readonly passed: number
  readonly failed: number
  readonly errored: number
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
