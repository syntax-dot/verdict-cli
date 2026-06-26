import { chmod, mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const distDir = path.join(repoRoot, "dist")
const outputFile = path.join(distDir, "index.js")

await rm(distDir, { recursive: true, force: true })
await mkdir(distDir, { recursive: true })

await build({
  entryPoints: [path.join(repoRoot, "packages/cli/src/index.ts")],
  outfile: outputFile,
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  external: ["commander", "yaml", "zod"],
  banner: {
    js: "#!/usr/bin/env node",
  },
  legalComments: "none",
  sourcemap: false,
  logLevel: "silent",
})

await chmod(outputFile, 0o755)
