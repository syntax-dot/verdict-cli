# Public OSS release checklist

## Purpose

Milestone 7 prepares VerdictCI for a public open-source repository and later npm publication without widening the MVP beyond the CLI and GitHub Action.

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
- an npm package name decision gate;
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

The preferred npm path is a scoped package controlled by the maintainer, such as `@syntax-dot/verdictci` or `@syntax-dot/verdict-cli`, unless a dedicated `@verdictci` npm organization is created before launch.

Do not publish under `verdict-cli`.

## Package strategy gate

The current workspace has separate packages:

- `@verdictci/core`
- `@verdictci/cli`

The CLI package depends on the core package through a workspace dependency. Before npm publication, choose one package strategy:

1. publish core and CLI together under a controlled npm scope; or
2. bundle the core package into a single CLI package and publish only that package.

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
pnpm verdictci --help
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Expected:

- help exits `0`;
- passing fixture exits `0`;
- failing fixture exits `1`;
- `.tmp/pass-result.json`, `.tmp/fail-result.json`, and `.tmp/fail-summary.md` are created;
- the failing Markdown summary begins with `# VerdictCI: failed`;
- no `.tmp/`, `.omo/`, env files, raw secrets, private prompts, raw outputs, or local IDE files are staged.

## Package smoke gate

Before npm publication, verify:

- install from the packed artifact in a clean temporary project;
- `verdictci --help` through the installed binary;
- one passing fixture run through the installed binary;
- package contents do not include `.tmp/`, `.omo/`, source-control metadata, local evidence, env files, raw secrets, or generated result artifacts.

This gate must pass after the npm package name and package strategy are finalized.

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
