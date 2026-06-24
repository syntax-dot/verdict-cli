# Project Skills

VerdictCI keeps project-specific Codex skills under `.codex/skills/`.

These skills are versioned with the repository so the development workflow can evolve with the product. If a Codex client does not load repository-local skills automatically, copy or symlink the needed skill folder into the active Codex skills directory before starting the task.

## Available Skills

| Skill | Use for |
| --- | --- |
| `$verdictci-mvp-build` | CLI runner, config parsing, result aggregation, exit codes, fixtures, package scripts, and MVP milestone implementation. |
| `$verdictci-eval-authoring` | Eval cases, datasets, scorers, thresholds, baselines, RAG citation checks, support-bot checks, classifier checks, and tool-agent checks. |
| `$verdictci-ci-release` | GitHub Action behavior, workflow summaries, release packaging, npm publication, docs checks, and distribution readiness. |
| `$verdictci-product-growth` | Founder decisions, positioning, pricing, monetization, distribution, repository strategy, launch planning, and user validation. |
| `$verdictci-modernize` | Refactors, dependency upgrades, provider integrations, architecture modernization, SaaS-readiness, and post-MVP expansion. |

## Usage Pattern

Invoke one skill per task when the task has a clear center of gravity:

```text
Use $verdictci-mvp-build to implement Milestone 1 config parsing and result JSON writing. Read AGENTS.md and the relevant specs first.
```

For mixed work, start with the skill that owns the highest-risk surface. For example, a GitHub Action change that also touches CLI exit codes should start with `$verdictci-ci-release`, then read the CLI and exit-code specs.

## Maintenance Rules

- Update the relevant skill when repository practice changes.
- Keep each skill short and procedural.
- Do not duplicate long product docs inside skills; link to the canonical docs instead.
- Regenerate or update `agents/openai.yaml` when a skill name, display name, short description, or default prompt changes.
- Run a structure check after editing skills.
