# Distribution

## Core distribution idea

VerdictCI should spread through examples, pull requests, and GitHub workflows.

The product is visible when it comments on or summarizes a PR. That means the best marketing asset is a real PR where a prompt change fails an eval and VerdictCI explains why.

## Primary channels

1. GitHub Marketplace
2. npm package discovery
3. example repositories
4. blog posts with reproducible demos
5. Hacker News / Reddit / X / LinkedIn developer posts
6. direct outreach to AI SaaS founders and agencies
7. open-source templates for popular AI stacks

## First demo repository

Create a public repo:

```text
verdictci/examples-nextjs-support-bot
```

It should contain:

- a tiny support bot prompt;
- 10 eval cases;
- one intentionally bad PR;
- VerdictCI GitHub Action;
- before/after result artifact;
- README explaining what failed.

This repo is more important than a polished landing page.

## Content plan

Write practical articles:

- "How to catch prompt regressions in GitHub Actions"
- "Adding AI regression tests to a Next.js AI SDK app"
- "Why your RAG tests should fail CI"
- "Model upgrades need eval gates, not vibes"
- "A small eval suite that caught a support bot regression"

Each article should include a working repo and command.

## Direct outreach

Send short messages to founders and engineers:

```text
I am building VerdictCI, a GitHub Action that fails PRs when prompt/agent/RAG behavior regresses.

I noticed you are shipping AI features in <project/company>. Do you currently run evals on pull requests, or are they still manual/notebook-based?

I am looking for 5 design partners. I can help wire it into one repo and want blunt feedback.
```

Do not attach a deck. Ask for a short technical conversation.

## Communities

Useful places:

- GitHub discussions around AI templates;
- LangChain, LlamaIndex, promptfoo, OpenAI developer communities;
- indie hacker communities;
- AI engineering Discords and Slacks;
- agency owner groups;
- HN Show HN when the demo is real.

## GitHub Marketplace

Marketplace is a later distribution channel, not the first milestone. First prove:

- the action works manually;
- users install it from README;
- PR summaries are useful;
- users ask for easier installation.

Then package:

- GitHub Action listing;
- later GitHub App listing.

## Landing page

The first landing page can be one page:

- headline: "Fail pull requests when AI behavior regresses."
- demo GIF or screenshot;
- install command;
- example workflow;
- three use cases;
- waitlist or design partner form.

Avoid vague AI language. Show the CI verdict.

## Metrics

Track:

- GitHub stars;
- npm downloads;
- successful example repo runs;
- number of repos with installed workflow;
- design partner calls;
- users who create more than one eval suite;
- users who ask for hosted history.

Stars are not revenue, but they show distribution momentum.

## What not to do

- Do not buy ads early.
- Do not build a generic AI newsletter.
- Do not market to "all AI teams".
- Do not publish thought leadership without reproducible examples.
- Do not spend weeks on brand design before the first working demo.

## Best first launch

Launch when you can show:

1. a PR that changes a prompt;
2. VerdictCI runs automatically;
3. the summary explains a regression;
4. the check blocks merge;
5. anyone can clone and reproduce it.
