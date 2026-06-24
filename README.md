# VerdictCI

Eval-as-CI for LLM, agent, and RAG applications.

VerdictCI is a developer tool that runs AI behavior evaluations in CI and gives every pull request a clear merge verdict: pass, fail, or needs review. The first product is CLI-first and GitHub Action-first. The later product can grow into a GitHub App and SaaS dashboard, but the MVP must prove one thing first: teams can catch prompt, agent, and retrieval regressions before merge.

## Why this exists

Traditional tests catch deterministic software regressions. AI products fail differently: a prompt edit changes tone, a model upgrade breaks tool use, a retrieval tweak removes citations, or an agent takes the wrong path while the TypeScript build stays green.

VerdictCI turns those behavioral expectations into release gates:

- run evals on pull requests;
- compare current behavior against approved baselines;
- post a clear PR summary;
- fail CI when the behavior regression is above threshold;
- store result artifacts that a human or agent can inspect.

## Product stance

VerdictCI is not a full observability platform, prompt editor, red-team scanner, or no-code agent builder. The MVP is intentionally narrow:

```text
config + datasets + runner + result JSON + GitHub Action summary + pass/fail exit code
```

That narrowness is the business advantage. A solo founder can ship it, support it, and explain it.

## Who it is for

Start with teams that already ship AI features and already use GitHub pull requests:

- indie AI SaaS founders;
- agencies building LLM features for clients;
- small B2B SaaS teams with support bots, internal copilots, or RAG search;
- developer tool teams adding AI workflows;
- open-source maintainers who need repeatable AI quality checks.

Avoid enterprise AI governance as the first market. It has bigger contracts, but it also has slower sales, security review, SSO, procurement, and compliance expectations.

## Repository start path

Read these documents in order:

1. [Product brief](docs/product/brief.md)
2. [Founder guide](docs/product/founder-guide.md)
3. [MVP scope](docs/scope/mvp.md)
4. [Architecture overview](docs/architecture/overview.md)
5. [Repository strategy](docs/product/repository-strategy.md)
6. [Positioning](docs/product/positioning.md)
7. [Implementation roadmap](docs/implementation/roadmap.md)
8. [Codex workflow](docs/agentic/codex-workflow.md)
9. [Acceptance criteria](docs/qa/acceptance-criteria.md)

For implementation work, start Codex from the repository root and ask it to read `AGENTS.md` first.

## Recommended first milestone

The first public milestone is a working GitHub Action demo:

1. a sample repo has an `evals.yaml`;
2. a pull request changes a prompt;
3. VerdictCI runs the eval suite;
4. the job writes `verdictci-result.json`;
5. the workflow summary says which checks regressed;
6. the action exits non-zero when the configured threshold fails.

Do not build accounts, billing, dashboards, or a GitHub App before this demo is boringly reliable.

## Name

Working brand: **VerdictCI**.

Why this name:

- it communicates a CI verdict;
- it works for prompts, agents, and RAG, not only prompt testing;
- it is developer-tool shaped;
- npm checks from 2026-06-22 showed `verdictci` and `@verdictci/cli` were not found, while `evalgate` was already taken.

This is not legal clearance. Before public launch, check GitHub organization availability, domains, and trademarks.

## Source foundation

VerdictCI can use existing OSS rather than inventing eval engines from scratch:

- promptfoo for config-driven LLM evals and CI patterns;
- OpenAI Evals and OpenAI platform evals as evaluation references;
- DeepEval for Python/pytest-like LLM evaluation workflows;
- GitHub Actions for first distribution;
- GitHub Checks API for the later GitHub App.

## Business model

Start with an open-core or source-available business shape:

- public repo for the CLI, examples, docs, and GitHub Action;
- hosted service later for run history, team dashboards, baseline storage, private result links, billing, and GitHub App checks;
- paid tiers by private repos, monthly eval runs, retained history, team seats, and hosted baselines.

The CLI should be useful without the SaaS. The SaaS should make team collaboration, history, and PR UX better enough to pay for.

## Non-goals

The first version must not become:

- a LangSmith clone;
- a full prompt management platform;
- a general agent framework;
- a universal LLM gateway;
- a red-team scanner for every attack class;
- a no-code editor;
- a consulting-heavy enterprise governance suite.

## Documentation map

```text
AGENTS.md
README.md
docs/
  product/
  scope/
  architecture/
  implementation/
  agentic/
  specs/
  prompts/
  templates/
  qa/
.github/workflows/docs-checks.yml
```

## Immediate next action

Create a new repository named `verdictci` or `verdictci-labs`, copy this starter pack into it, initialize the package manager, and ask Codex:

```text
Read AGENTS.md, docs/product/brief.md, docs/scope/mvp.md, docs/specs/cli.md, and docs/implementation/roadmap.md. Then create a detailed implementation plan for Milestone 1 only. Do not write production code until the plan includes tests and manual QA evidence.
```
