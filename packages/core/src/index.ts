import { stat } from "node:fs/promises"

export const EXIT_CODES = {
  passed: 0,
  failed: 1,
  usage: 2,
  provider: 3,
  internal: 4,
} as const

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES]

export type MissingConfigError = {
  readonly kind: "missing_config"
  readonly configPath: string
  readonly exitCode: typeof EXIT_CODES.usage
  readonly message: string
  readonly remediation: string
}

export type ConfigPathCheckResult =
  | {
      readonly ok: true
      readonly configPath: string
    }
  | {
      readonly ok: false
      readonly error: MissingConfigError
    }

export async function checkConfigPath(configPath: string): Promise<ConfigPathCheckResult> {
  try {
    const configStats = await stat(configPath)
    if (configStats.isFile()) {
      return { ok: true, configPath }
    }
  } catch {
    return missingConfig(configPath)
  }

  return missingConfig(configPath)
}

function missingConfig(configPath: string): ConfigPathCheckResult {
  return {
    ok: false,
    error: {
      kind: "missing_config",
      configPath,
      exitCode: EXIT_CODES.usage,
      message: `Config file not found: ${configPath}`,
      remediation: "Create a verdictci.yaml file or pass --config with an existing config path.",
    },
  }
}
