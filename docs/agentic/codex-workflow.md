# Codex workflow

VerdictCI is designed for agentic development. The repository should make it easy for Codex to understand the product, choose the right scope, implement small changes, and prove them with evidence.

## How to start Codex in the future repo

Start from the repository root.

First prompt:

```text
Read AGENTS.md and summarize the current product scope, MVP non-goals, required verification commands, and evidence policy. Do not edit files yet.
```

Then ask for one milestone or one issue.

## Good task shape

```text
Read AGENTS.md and these files:
- docs/scope/mvp.md
- docs/specs/cli.md
- docs/specs/result-json.md

Task:
Implement Milestone 2 fixture-mode result JSON.

Scope:
- packages/core
- packages/cli
- examples/support-bot

Non-goals:
- no promptfoo backend
- no GitHub Action
- no hosted upload

Expected tests:
- valid fixture config exits 0
- failing fixture exits 1
- invalid config exits 2
- result JSON validates against the documented schema

Manual QA:
Run `pnpm verdictci run --config examples/support-bot/verdictci.yaml --output .tmp/result.json`
and capture the output plus generated JSON.
```

## Bad task shape

```text
Build VerdictCI.
```

Too broad. It invites scope creep.

## Agent roles

Use separate Codex runs for:

- implementation;
- review;
- QA;
- documentation;
- security review.

Do not ask one run to make a large feature and review itself as the only quality gate.

## Evidence policy

Every meaningful change needs:

- tests or a documented reason tests are not applicable;
- command output;
- manual QA artifact;
- changed docs if behavior changed.

Use `.omo/evidence/<date>-<task>.md` or `.omo/evidence/<date>-<task>.txt`.

## Review prompt

```text
Review the current diff against:
- AGENTS.md
- docs/scope/mvp.md
- docs/specs/cli.md
- docs/specs/result-json.md

Prioritize:
- behavior bugs
- scope creep
- missing tests
- result schema instability
- unclear CLI errors
- privacy leaks

Return findings first with file/line references. If there are no findings, say so and list residual risks.
```

## QA prompt

```text
Run the manual QA scenario for the current milestone exactly as written in docs/qa/manual-qa.md.

Capture:
- command
- exit code
- stdout/stderr summary
- generated artifact paths
- cleanup receipt

Do not fix code. Report failures with reproduction steps.
```

## Scope guard

Before accepting Codex's proposed plan, check:

- Does it implement only the named milestone?
- Did it add a dashboard, database, auth, billing, or provider matrix?
- Did it update docs?
- Did it include a manual QA command?
- Did it avoid hidden network uploads?

If scope drift appears, stop and ask Codex to revise the plan before edits.
