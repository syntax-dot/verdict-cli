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
