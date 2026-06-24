import { stat } from "node:fs/promises"
import type { MissingConfigError, Result } from "./errors.js"
import { err, ok } from "./errors.js"
import { EXIT_CODES } from "./exit-codes.js"

export type ConfigPathCheckResult = Result<
  {
    readonly configPath: string
  },
  MissingConfigError
>

export async function checkConfigPath(configPath: string): Promise<ConfigPathCheckResult> {
  try {
    const configStats = await stat(configPath)
    if (configStats.isFile()) {
      return ok({ configPath })
    }
  } catch {
    return missingConfig(configPath)
  }

  return missingConfig(configPath)
}

function missingConfig(configPath: string): ConfigPathCheckResult {
  return err({
    kind: "missing_config",
    configPath,
    exitCode: EXIT_CODES.usage,
    message: `Config file not found: ${configPath}`,
    remediation: "Create a verdictci.yaml file or pass --config with an existing config path.",
  })
}
