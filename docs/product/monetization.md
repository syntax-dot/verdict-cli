# Monetization

## Business thesis

The CLI is the adoption channel. The hosted product is the business.

Developers should be able to run VerdictCI locally and in GitHub Actions without asking sales. Teams should pay when they need collaboration, retention, trust, and convenience.

## Free value

Keep these free:

- local CLI execution;
- public config schema;
- sample eval templates;
- GitHub Action wrapper;
- local result JSON;
- Markdown/terminal summaries;
- public repo examples.

Free users create distribution and credibility.

## Paid value

Charge for:

- hosted run history;
- private result pages;
- GitHub App check runs;
- baseline management;
- team workspaces;
- retained artifacts;
- policy templates;
- Slack/Linear/Jira notifications;
- support and onboarding.

## Pricing model

Start with simple tiers:

| Tier | Price | Best for | Limits |
| --- | ---: | --- | --- |
| Free | $0 | OSS and local trials | local CLI, public examples, no hosted history |
| Solo | $10-19/month | indie builders | 1-3 private repos, limited hosted runs |
| Team | $49-99/month | small AI teams | 10-25 repos, run history, team access |
| Pro | $199+/month | agencies and serious teams | higher limits, priority support, GitHub App |

Avoid complex token pricing at the start. Users already pay model providers; do not make VerdictCI pricing feel like another unpredictable meter.

## What users pay for emotionally

They are not buying "eval execution". They are buying:

- confidence before merge;
- fewer embarrassing AI regressions;
- a review artifact for teammates;
- a repeatable release process;
- less manual prompt checking;
- faster model upgrades.

Marketing and pricing should reflect that.

## When not to monetize yet

Do not add billing before:

- at least 10 real repositories have run the CLI;
- at least 3 users ask for hosted history or team sharing;
- the result artifact is stable;
- the GitHub Action is reliable.

Billing too early can slow learning.

## First paid experiment

Offer a private beta:

```text
$49/month for hosted PR result history, private result links, and help wiring VerdictCI into up to 3 repos.
```

This tests whether teams value setup help and retained history.

## Agency angle

Agencies can be early buyers because they build many AI workflows and need proof for clients. Offer:

- per-client workspace;
- branded monthly regression report;
- support for setting up eval suites;
- templates for support bot, RAG, classifier, and tool agent.

Do not become a consulting shop unless it directly improves the product.

## Expansion revenue

Later expansion:

- GitHub Marketplace paid plan;
- hosted baselines;
- organization policy packs;
- compliance-friendly audit exports;
- eval template marketplace;
- managed eval authoring assistance;
- enterprise self-hosted license.

## Cost control

VerdictCI should avoid paying for users' model calls by default. The first version should run with the user's provider keys in their CI environment.

Hosted mode can store metadata and summaries first, not raw outputs. If hosted eval execution is added later, price it separately.

## Financial target

A realistic first target:

- 10 paying solo/team users at $19-99/month;
- then 5 agencies or teams at $99-199/month;
- then decide whether to deepen SaaS or stay as a profitable micro-SaaS.

The goal is not to imitate a venture-backed platform on day one. The goal is to create a paid workflow developers trust.
