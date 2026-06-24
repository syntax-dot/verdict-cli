---
name: verdictci-eval-authoring
description: Design, review, or improve VerdictCI evaluation suites. Use when Codex works on eval cases, datasets, scorers, thresholds, baselines, RAG citation checks, support-bot checks, classifier checks, tool-agent checks, or examples that should catch AI behavior regressions in CI.
---

# VerdictCI Eval Authoring

Use this skill when the work is about the quality of eval suites rather than the runner implementation itself.

## Required Reading

Read the relevant files before changing eval content:

1. `docs/prompts/eval-authoring.md`
2. `docs/specs/config-yaml.md`
3. `docs/specs/result-json.md`
4. `docs/templates/support-bot.md`
5. `docs/templates/rag-citations.md`
6. `docs/templates/tool-agent.md`
7. `docs/templates/classifier.md`

For product constraints, read `docs/product/positioning.md` and `docs/scope/mvp.md`.

## Eval Design Rules

- Prefer small eval suites that catch one regression class clearly.
- Write cases from realistic user jobs, not synthetic prompt tricks.
- Separate required checks from advisory checks.
- Make thresholds explicit and explain why they block merge.
- Include at least one negative case for every behavior that can regress.
- Keep examples safe to commit: no private prompts, customer data, secrets, or proprietary documents.
- Avoid evals that only reward verbose answers.
- Avoid model-specific assumptions unless the config names the model dependency clearly.

## Baseline Policy

Only update a baseline when the behavior change is intentional and documented.

When changing a baseline, include:

- what changed;
- why the new behavior is better;
- which cases were reviewed manually;
- evidence path for the before/after result.

## Review Checklist

Before accepting eval changes, verify:

- the suite fails for the intended regression;
- passing behavior is observable in `verdictci-result.json`;
- the PR summary can explain the failure to a busy reviewer;
- cost is bounded enough for CI use;
- flaky checks are either stabilized or marked advisory.
