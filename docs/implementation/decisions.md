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

Status: proposed.

Decision:

Use promptfoo as the first eval backend or compatibility target.

Reason:

- mature OSS project;
- existing GitHub Action pattern;
- broad provider support;
- lets VerdictCI focus on verdict UX and artifacts.

Risk:

- if VerdictCI becomes a thin wrapper, differentiation is weak.

Mitigation:

- focus on PR decision workflow, result schema, baseline policy, and agent-friendly triage.

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
