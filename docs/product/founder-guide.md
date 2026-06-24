# Founder guide

This document is for a founder coming from full-time employment into a first independent product.

## The mental shift

As an employee, your job is often to complete assigned work well. As a founder, your job is to reduce uncertainty:

- Is the problem painful?
- Do people know they have it?
- Can you reach those people?
- Will they try a small solution?
- Will they pay for it?
- Can you support it alone?

Writing code is only one part of the work. The product succeeds when distribution, trust, support, pricing, and reliability line up.

## Founder constraints

Assume:

- one developer;
- limited time;
- no sales team;
- no support team;
- Codex can accelerate implementation but cannot validate the market for you;
- the first version must be small enough to explain in one sentence.

VerdictCI fits those constraints only if it stays CLI-first and GitHub Action-first.

## What to build first

Build a working demo before building a company:

1. A sample AI app has a prompt and eval cases.
2. A pull request changes the prompt.
3. VerdictCI runs in CI.
4. The PR shows a clear failure or pass.
5. The result artifact explains why.

If that demo does not make developers ask "can I try it?", do not build the SaaS yet.

## What to do every week

Split time intentionally:

- 50% product building;
- 25% talking to users;
- 15% writing public content and demos;
- 10% operations, packaging, and support.

If you spend 100% of your time coding, you are probably hiding from market risk.

## First 20 conversations

Talk to:

- founders shipping AI features;
- engineers maintaining RAG systems;
- agencies building chatbots;
- maintainers of AI templates;
- people who recently posted about prompt regressions or evals.

Ask:

1. What AI behavior changed unexpectedly in the last month?
2. How did you notice?
3. What broke in the release process?
4. Do you run evals today?
5. Are evals in CI, a notebook, a dashboard, or someone's manual checklist?
6. What would make you trust a CI gate?
7. Would you install a GitHub Action for this?
8. What would you pay for: local CLI, PR comments, run history, hosted baselines, team dashboard, or support?

Do not pitch too early. Learn the language of the problem first.

## Pricing intuition

Start simple:

- Free: open-source CLI and public repo usage.
- Solo: $10-19/month for private repo history and hosted result links.
- Team: $49-99/month for multiple repos, retained history, shared baselines, and PR summaries.
- Pro: $199+/month for higher run limits, GitHub App, private result storage, and priority support.

Do not invent usage-based complexity too early. For MVP, pricing should be easy to understand.

## When to charge

Charge when:

- users ask for saved history;
- users need private hosted result links;
- teams want multiple repos;
- the tool becomes part of branch protection;
- the product saves real review or incident time.

Do not charge for the first local CLI if that blocks adoption. The CLI is distribution.

## Your first public assets

Create these before the paid product:

- a 2-minute demo video;
- a public sample repo;
- a "broken prompt PR" example;
- a blog post: "How to catch prompt regressions in GitHub Actions";
- a comparison page: VerdictCI vs promptfoo-only workflow;
- a guide: "Adding AI regression tests to a Next.js AI app".

## Avoid these founder traps

- Building dashboards before people use the CLI.
- Adding every provider before one workflow is reliable.
- Selling enterprise before self-service works.
- Over-optimizing brand before users exist.
- Treating GitHub stars as customers.
- Confusing "developers like this idea" with "teams will install and maintain it".

## Decision rule

For the first 60 days, every feature must pass this question:

```text
Will this help a real team run AI evals on pull requests this week?
```

If not, put it in post-MVP.
