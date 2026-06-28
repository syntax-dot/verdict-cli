#!/usr/bin/env node
import { main } from "../dist/index.js"

try {
  process.exitCode = await main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`Unexpected internal error: ${message}\n`)
  process.exitCode = 4
}
