# Source notes

This document records the external product and platform facts that shape VerdictCI.

Access date: 2026-06-22.

## GitHub Checks API

GitHub's Checks API lets GitHub Apps create rich check runs for code changes. The docs describe check runs, check suites, detailed statuses, annotations, reruns, and branch-protection use cases.

How VerdictCI uses this:

- MVP: GitHub Action with exit code and workflow summary.
- Post-MVP: GitHub App that creates richer check runs and annotations.

Source:

- https://docs.github.com/en/rest/guides/using-the-rest-api-to-interact-with-checks
- https://docs.github.com/en/rest/checks

## GitHub Actions

GitHub Actions is the first distribution path because it lets users add VerdictCI to a repo with a workflow file.

How VerdictCI uses this:

- package the CLI as a GitHub Action;
- support direct `pnpm dlx @verdictci/cli run` usage;
- later add a GitHub App when users need better PR UX.

Source:

- https://docs.github.com/actions
- https://docs.github.com/actions/creating-actions/about-custom-actions
- https://docs.github.com/actions/how-tos/creating-and-publishing-actions

## promptfoo

promptfoo already supports LLM evals, red teaming, provider comparison, CI/CD usage, and a GitHub Action for before/after prompt evaluation.

How VerdictCI uses this:

- treat promptfoo as an execution backend or compatibility target;
- learn from its GitHub Action integration;
- differentiate by being a productized CI verdict layer, not only an eval framework.

Source:

- https://github.com/promptfoo/promptfoo
- https://www.promptfoo.dev/docs/getting-started/
- https://www.promptfoo.dev/docs/integrations/github-action/

## OpenAI evals and agent evals

OpenAI documentation frames evals as a way to test model outputs against expected style and content criteria, and agent evaluation as a way to improve agent quality with traces, graders, datasets, and eval runs.

How VerdictCI uses this:

- explain the product in terms users already understand: evals as reliability gates;
- support OpenAI models without becoming OpenAI-only;
- add agent workflow templates later.

Source:

- https://developers.openai.com/api/docs/guides/evals
- https://developers.openai.com/api/docs/guides/agent-evals
- https://developers.openai.com/api/docs/guides/evaluation-best-practices

## DeepEval

DeepEval positions itself as a pytest-like open-source LLM evaluation framework. It is useful as a reference for Python users and for future runner compatibility.

Source:

- https://github.com/confident-ai/deepeval
- https://deepeval.com/docs/getting-started

## Codex and AGENTS.md

OpenAI docs state that Codex reads `AGENTS.md` files before work and layers global, project, and nested guidance.

How VerdictCI uses this:

- keep a strong root `AGENTS.md`;
- create implementation tasks that reference specific docs;
- make the repository agent-friendly from day one.

Source:

- https://developers.openai.com/codex/guides/agents-md

## Naming checks

On 2026-06-22:

- `npm view verdictci` returned 404 from this environment.
- `npm publish verdictci` was later rejected by npm because the name is too similar to `verdict-ci`.
- `@syntaxname/verdictci` was published as `0.1.0` on 2026-06-28.
- npm downloads API returned 68 downloads for `@syntaxname/verdictci` for 2026-06-28.
- `npm view @verdictci/cli` returned 404 from this environment.
- `npm view evalgate` returned an existing package, so `EvalGate` was rejected.

These checks are not trademark clearance.
