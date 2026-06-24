# AGENTS.md

This file is the project instruction layer for coding agents working on VerdictCI.

VerdictCI is an Eval-as-CI product for LLM, agent, and RAG applications. The first product is CLI-first and GitHub Action-first. The goal is to catch AI behavior regressions before merge.

## Prime directive

Keep the MVP narrow. Build the smallest reliable tool that can:

1. read a `verdictci.yaml` or `evals.yaml` config;
2. run configured eval cases;
3. write a stable result artifact;
4. produce a useful CI summary;
5. exit with a deterministic pass/fail code.

Do not drift into a full observability platform, prompt CMS, hosted dashboard, billing system, GitHub App, red-team suite, or no-code builder unless the current task explicitly targets a post-MVP milestone.

## Repository expectations

- Prefer small, cohesive modules with explicit interfaces.
- Keep CLI behavior deterministic and scriptable.
- Every public command must have a documented example.
- Every result artifact must be machine-readable and versioned.
- Every user-facing failure must include a remediation hint.
- Never hide model cost, provider calls, or data retention behavior.
- Treat eval outputs and prompts as potentially sensitive customer data.

## Work loop

For every implementation task:

1. Read the relevant spec under `docs/specs/`.
2. Write or update a failing test before production code when behavior changes.
3. Implement the smallest change that makes the test pass.
4. Run targeted tests, lint/typecheck, and the relevant manual QA command.
5. Save evidence under `.omo/evidence/` or the task-specific evidence path.
6. Update docs when behavior, commands, config, or result schemas change.

Documentation-only edits still need verification: run link/path checks and confirm required sections exist.

## Required commands

The initial repository may not have these scripts yet. When the implementation creates them, keep these names stable:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm docs:check
pnpm verdictci --help
```

If the project chooses another package manager, update this file and `docs/implementation/repo-map.md` in the same change.

## Testing policy

- Unit tests cover config parsing, threshold logic, result aggregation, exit codes, and summary rendering.
- Integration tests cover CLI runs against fixture eval suites.
- E2E tests cover a sample GitHub Action workflow locally where practical.
- Snapshot tests are allowed only for stable CLI output and must be easy to review.
- Avoid tests that only assert mocks were called.
- Avoid brittle tests that pin wording unrelated to behavior.

## Manual QA policy

Before claiming a milestone is complete, run a real scenario:

```bash
pnpm verdictci run --config examples/support-bot/verdictci.yaml --output .tmp/verdictci-result.json
```

Expected binary observable:

- exit code `0` when all required checks pass;
- exit code `1` when a configured threshold fails;
- `.tmp/verdictci-result.json` exists and validates against `docs/specs/result-json.md`;
- the terminal summary names passed, failed, skipped, and errored checks.

## Security and privacy

- Do not log raw secrets.
- Do not upload prompts, test cases, outputs, or traces to a hosted service without explicit user configuration.
- Default to local-only execution for the CLI.
- Any future hosted mode must document retention, deletion, access control, and encryption.
- Treat GitHub tokens and provider API keys as high-risk secrets.

## Dependency policy

- Prefer proven OSS for eval execution and GitHub integration.
- Do not add heavy dependencies without a written reason in `docs/implementation/decisions.md`.
- Keep provider integrations behind interfaces.
- Do not couple the core runner to one model vendor.

## Documentation policy

When changing product behavior, update the relevant docs:

- CLI behavior: `docs/specs/cli.md`
- config schema: `docs/specs/config-yaml.md`
- result schema: `docs/specs/result-json.md`
- GitHub Action behavior: `docs/specs/github-action.md`
- roadmap or scope changes: `docs/scope/mvp.md` and `docs/implementation/roadmap.md`

## Agent task template

Use this shape for Codex tasks:

```text
Read AGENTS.md and the relevant spec files first.
Task:
Scope:
Non-goals:
Expected tests:
Manual QA command:
Evidence path:
Do not broaden the milestone.
```

## Completion standard

Done means:

- tests pass;
- manual QA passes;
- docs match behavior;
- evidence is captured;
- no live dev server, temp process, or untracked generated artifact is left behind unless documented.
