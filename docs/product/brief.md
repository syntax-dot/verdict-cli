# Product brief

## Product name

VerdictCI.

## One-liner

VerdictCI gives AI product teams a CI verdict for prompt, agent, and RAG behavior changes before they merge.

## Problem

AI features break in ways normal tests do not catch:

- prompt wording changes model behavior without changing code paths;
- model upgrades improve one scenario and regress another;
- RAG pipeline changes remove citations or retrieve stale context;
- tool-calling agents choose the wrong tool while the build still passes;
- teams rely on manual review because evals are hard to wire into CI.

The result is a release process based on hope, screenshots, and manual prompting.

## Customer

Start with small teams that already have AI features in production or active development:

- 1-20 person AI SaaS teams;
- software agencies building AI workflows for clients;
- open-source projects with AI examples or agents;
- internal tools teams maintaining support bots or RAG assistants.

The first buyer is usually a technical founder, staff engineer, or AI product engineer. They want fewer regressions without adopting a heavy platform.

## Promise

VerdictCI turns expected AI behavior into a pull-request gate:

```text
If this prompt, model, tool, or retrieval change makes behavior worse, CI fails with a readable explanation.
```

## MVP wedge

The wedge is not "AI observability". The wedge is "before/after evals in pull requests".

The first product should do one job:

- run a local or CI eval suite;
- compare actual outputs against thresholds;
- write a result JSON;
- render a human-readable summary;
- return the correct exit code.

## Differentiation

VerdictCI should be:

- simpler than full observability platforms;
- more CI-native than notebooks and dashboards;
- more PR-actionable than raw eval frameworks;
- more portable than vendor-specific eval products;
- more agent-development-aware than generic prompt testing.

## Sources that shape the product

- GitHub Checks API supports rich CI-style check runs, annotations, reruns, and branch protection gates.
- Promptfoo already demonstrates prompt evals in GitHub Actions and can serve as an early execution backend.
- OpenAI eval guidance frames evals as a core reliability practice for model outputs and agent workflows.
- Codex supports repository-level `AGENTS.md` instructions, which makes this repo suitable for agentic development workflows.

## Success metric

The first success metric is not revenue. It is:

```text
10 real repositories run VerdictCI on pull requests and at least 3 teams say it caught or clarified a real AI regression.
```

Only after that should the product invest in hosted history, billing, GitHub App UX, or team dashboards.
