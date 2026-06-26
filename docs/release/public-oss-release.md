# Public OSS release checklist

## Purpose

Milestones 7 and 8 prepare VerdictCI for a public open-source repository and npm publication without widening the MVP beyond the CLI and GitHub Action.

Target public repository:

```text
https://github.com/syntax-dot/verdict-cli.git
```

This repository is the planned public launch target under the maintainer's personal GitHub account. The brand remains VerdictCI.

## Scope

Milestone 7 includes:

- license, changelog, contributing guide, security policy, and issue templates;
- README links that make the demo and release path easy to find;
- a public transfer checklist for `syntax-dot/verdict-cli`;
- npm package `verdictci`;
- bundled internal core packaging;
- a package smoke gate before any publish attempt;
- docs checks that keep the public-release surface present.

Milestone 7 does not include:

- hosted service behavior;
- accounts;
- billing;
- dashboards;
- GitHub App behavior;
- SSO;
- enterprise governance;
- transfer to the public repository before verification is green.

## Current npm name findings

Registry checks on 2026-06-26 found:

| Package | Result |
| --- | --- |
| `verdict-cli` | already published as `0.1.1` |
| `verdictci` | not found |
| `@verdictci/cli` | not found |
| `@syntax-dot/verdict-cli` | not found |
| `@syntax-dot/verdictci` | not found |

The selected npm package name is:

```text
verdictci
```

Do not publish under `verdict-cli`.

## Bundled package strategy

The current workspace has separate packages:

- `@verdictci/core`
- `@verdictci/cli`

These remain internal development packages. The published npm artifact is the root package:

```text
verdictci
```

The root package builds `dist/index.js` with `packages/core` bundled into the CLI. Third-party runtime packages stay as normal npm dependencies:

- `commander`
- `yaml`
- `zod`

Promptfoo remains an external backend command. Users can install promptfoo in their project or set `VERDICTCI_PROMPTFOO_BIN`.

Do not publish a CLI tarball with unresolved `workspace:*` dependencies.

## Required verification

Before transferring the repository or publishing a package, run:

```bash
pnpm install
pnpm docs:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm package:smoke
pnpm verdictci --help
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Expected:

- help exits `0`;
- package smoke installs the packed `verdictci` artifact in a clean temporary project;
- installed `verdictci --help` exits `0`;
- passing fixture exits `0`;
- failing fixture exits `1`;
- `.tmp/pass-result.json`, `.tmp/fail-result.json`, and `.tmp/fail-summary.md` are created;
- the failing Markdown summary begins with `# VerdictCI: failed`;
- no `.tmp/`, `.omo/`, env files, raw secrets, private prompts, raw outputs, or local IDE files are staged.

## Package smoke gate

Before npm publication, verify:

```bash
pnpm package:smoke
```

Expected:

- `npm pack` creates `verdictci-0.1.0.tgz`;
- package contents include `dist/index.js`, `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, and `SECURITY.md`;
- package contents do not include `.tmp/`, `.omo/`, source-control metadata, local evidence, env files, raw secrets, generated result artifacts, workspace source packages, scripts, docs, examples, source maps, or TypeScript build info;
- the tarball installs in a clean temporary project;
- installed `verdictci --help` exits `0`;
- installed `verdictci run` writes a passing fixture result artifact.

This gate must pass before `npm publish`.

## Public transfer gate

After verification passes and the maintainer approves the transfer, add a temporary public remote:

```bash
git remote add public https://github.com/syntax-dot/verdict-cli.git
git push public main
```

Keep the existing private remote until the public repository has been verified.

After the push:

1. confirm README renders correctly on GitHub;
2. confirm issue templates appear in the new-issue flow;
3. confirm the license is detected;
4. confirm GitHub Actions start on the public repository;
5. create a `v0.1.0` release only after the Action and manual CLI smoke checks pass.
