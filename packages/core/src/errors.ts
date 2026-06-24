import { EXIT_CODES } from "./exit-codes.js"

export type Result<TValue, TError> =
  | {
      readonly ok: true
      readonly value: TValue
    }
  | {
      readonly ok: false
      readonly error: TError
    }

export type MissingConfigError = {
  readonly kind: "missing_config"
  readonly configPath: string
  readonly exitCode: typeof EXIT_CODES.usage
  readonly message: string
  readonly remediation: string
}

export type ConfigIssue = {
  readonly fieldPath: string
  readonly expected: string
  readonly message: string
}

export type ConfigError = {
  readonly kind: "config_error"
  readonly configPath: string
  readonly exitCode: typeof EXIT_CODES.usage
  readonly message: string
  readonly remediation: string
  readonly issues: readonly ConfigIssue[]
}

export type CaseFileError = {
  readonly kind: "case_file_error"
  readonly casesPath: string
  readonly exitCode: typeof EXIT_CODES.usage
  readonly message: string
  readonly remediation: string
  readonly line?: number
}

export type RunError = MissingConfigError | ConfigError | CaseFileError

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value }
}

export function err<TError>(error: TError): Result<never, TError> {
  return { ok: false, error }
}

export function configError(
  configPath: string,
  issue: ConfigIssue,
  issues: readonly ConfigIssue[] = [issue],
): ConfigError {
  return {
    kind: "config_error",
    configPath,
    exitCode: EXIT_CODES.usage,
    message: `Invalid config in ${configPath} at ${issue.fieldPath}: ${issue.message}`,
    remediation: `Fix ${issue.fieldPath} in ${configPath} to match docs/specs/config-yaml.md.`,
    issues,
  }
}

export function caseFileError(input: CaseFileErrorInput): CaseFileError {
  const base = {
    kind: "case_file_error",
    casesPath: input.casesPath,
    exitCode: EXIT_CODES.usage,
    message: input.message,
    remediation: input.remediation,
  } satisfies Omit<CaseFileError, "line">

  if (input.line === undefined) {
    return base
  }

  return { ...base, line: input.line }
}

type CaseFileErrorInput = {
  readonly casesPath: string
  readonly message: string
  readonly remediation: string
  readonly line?: number
}
