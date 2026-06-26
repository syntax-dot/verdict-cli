# Decisions

Record important product and architecture decisions here.

## ADR-001: CLI-first, GitHub Action-first

Status: accepted.

Decision:

VerdictCI starts as a CLI and GitHub Action, not as a SaaS dashboard or GitHub App.

Reason:

- fastest path to a useful demo;
- lowest infrastructure burden;
- easiest self-service install;
- aligns with developer workflow;
- allows public OSS adoption before hosted monetization.

Consequences:

- less polished PR UX at first;
- no hosted history initially;
- branch protection works through workflow status rather than rich Checks API until GitHub App exists.

## ADR-002: Local-only by default

Status: accepted.

Decision:

The CLI does not upload prompts, outputs, or results to VerdictCI servers by default.

Reason:

- prompts and eval outputs may contain sensitive data;
- trust is critical for devtools;
- local execution simplifies the MVP.

Consequences:

- SaaS monetization comes later;
- hosted features must be opt-in.

## ADR-003: Stable result JSON before dashboard

Status: accepted.

Decision:

VerdictCI defines a versioned `verdictci-result.json` before building any hosted UI.

Reason:

- CI and agents need machine-readable artifacts;
- a stable schema makes integrations easier;
- dashboards can be built from the same artifact later.

## ADR-004: promptfoo compatibility first

Status: accepted.

Decision:

Use promptfoo as the first eval backend and compatibility target. Add `promptfoo` as a development dependency so the repository can run deterministic local QA without requiring a global promptfoo install.

Reason:

- mature OSS project;
- existing GitHub Action pattern;
- broad provider support;
- lets VerdictCI focus on verdict UX and artifacts.

Risk:

- if VerdictCI becomes a thin wrapper, differentiation is weak.

Mitigation:

- focus on PR decision workflow, result schema, baseline policy, and agent-friendly triage.
- keep promptfoo behind an adapter boundary;
- normalize only summary fields into the VerdictCI artifact;
- deny optional native/browser build scripts in `pnpm-workspace.yaml` unless a future milestone proves they are required.

## ADR-005: TypeScript pnpm workspace for the CLI skeleton

Status: accepted.

Decision:

Use a Node.js 24 LTS, pnpm workspace, and TypeScript stack for the MVP CLI packages.

Reason:

- aligns with the repository map recommendation;
- keeps npm CLI distribution straightforward;
- fits the GitHub Action wrapper path;
- supports fast tests and strict typechecking for a small solo-founder codebase.

Consequences:

- local development should use Node.js 24 or the bundled Codex runtime when the host Node version is older;
- pnpm 11 build approvals live in `pnpm-workspace.yaml`;
- package scripts must avoid shelling out to an older globally installed pnpm.

## ADR-006: Zod and yaml for Milestone 2 input/output contracts

Status: accepted.

Decision:

Use `zod` for config, fixture, and result artifact boundary schemas, and use `yaml` for parsing VerdictCI config files.

Reason:

- config and case files are untrusted inputs and need typed boundary parsing;
- Zod keeps runtime validation close to TypeScript result types;
- `yaml` is a focused parser for the project’s documented config format;
- both dependencies are small enough for the CLI-first MVP.

Consequences:

- `@verdictci/core` owns schema validation and result artifact validation;
- future adapters should normalize into the same typed result model instead of bypassing it;
- dependency additions beyond this must still be justified here.

## ADR-007: Single npm package with bundled internal core

Status: accepted.

Decision:

Publish VerdictCI as the unscoped npm package `verdictci`.

The root package owns the public `verdictci` binary and builds `dist/index.js` with the internal `packages/core` code bundled into the CLI artifact. The internal workspace package names remain useful for source organization, but they are not separate npm publication units in the MVP.

Third-party runtime packages remain normal npm dependencies:

- `commander`
- `yaml`
- `zod`

Reason:

- users install one package and get one binary;
- npm publication does not depend on a `@verdictci` organization or personal npm scope;
- the public repo can stay under `syntax-dot/verdict-cli` while the npm package keeps the product name;
- a single package avoids exposing `workspace:*` dependencies to users.

Consequences:

- package smoke must verify the packed tarball, not only local source execution;
- `packages/core` remains internal until there is a concrete reason to publish a public API package;
- promptfoo remains an external backend command rather than a bundled dependency.
