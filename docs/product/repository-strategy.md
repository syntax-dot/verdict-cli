# Repository strategy

## Recommendation

Start with a public repository after the first working demo exists.

Do not publish an empty repo with only aspirations. Build the smallest working CLI demo privately, then publish when the repo contains:

- a clear README;
- a working example;
- a reproducible `verdictci run` command;
- a GitHub Action workflow example;
- license;
- contribution guidance;
- issue templates;
- roadmap.

## Current launch path

Milestone 7 uses the maintainer's prepared public repository:

```text
syntax-dot/verdict-cli
```

This is acceptable for the first public launch because it keeps maintenance under one account and avoids blocking on organization setup. The product brand remains VerdictCI, and the repository can move to a dedicated organization later if adoption justifies it.

Do not transfer the private working repository until release-readiness checks pass and the public package strategy is explicit.

## Why public

VerdictCI is a developer tool. Public development helps because:

- users can inspect how evals run;
- examples are easier to share;
- GitHub Action adoption is easier;
- OSS credibility matters in devtools;
- Codex and other agents can use public docs and examples as context;
- public issues become market research.

## What should be open

Open-source or source-available from day one:

- CLI runner;
- config schema;
- result JSON schema;
- examples and templates;
- GitHub Action wrapper;
- local report renderer;
- docs.

This makes the tool useful without asking for trust in a hosted service.

## What can be paid later

Keep these as hosted/commercial features later:

- hosted run history;
- private result links;
- GitHub App checks with richer PR UI;
- team dashboards;
- baseline approval workflows;
- organization policies;
- managed datasets;
- Slack/Linear/Jira integrations;
- support and onboarding.

## License options

Recommended default:

- Apache-2.0 or MIT for CLI, schemas, examples, and action.

Why permissive:

- easier adoption by companies;
- less friction for GitHub Action usage;
- better for a solo founder seeking trust;
- allows commercial users without long legal review.

Alternative:

- open-core with permissive CLI and proprietary hosted service.

Avoid:

- AGPL for the first CLI if the goal is broad developer adoption;
- custom restrictive licenses before you have users;
- unclear licensing copied from another product.

## Repo naming

Preferred:

- GitHub org: `verdictci`
- repo: `verdictci`
- npm package: `@verdictci/cli`
- GitHub Action: `verdictci/action`
- website: `verdictci.dev`

Fallback names if unavailable:

- `verdict-ci`
- `verdictci-labs`
- `aiverdict`
- `evalverdict`

## Public/private timing

Phase 0: private scratch repo.

- Goal: prove the CLI can run one eval suite.
- No marketing.
- No architecture astronautics.

Phase 1: public repo.

- Goal: get first external installs.
- Publish examples and docs.
- Use issues for feedback.

Phase 2: public repo + private SaaS repo if needed.

- Keep CLI/action public.
- Put hosted dashboard, billing, and private infrastructure in a separate private repo if it contains operational secrets or commercial code.

## Distribution artifacts

Plan for:

- npm package: `@syntaxname/verdictci`;
- GitHub Action: `syntax-dot/verdict-cli@v1` for the personal-account launch, with `verdictci/action@v1` as the later organization path;
- Docker image later for isolated runner use;
- Homebrew later only if developer demand appears.

## Repo hygiene

The public repo should look trustworthy:

- short README;
- real examples;
- screenshots or PR summary images;
- clear install instructions;
- changelog;
- security policy;
- issue templates;
- roadmap;
- no fake enterprise logos;
- no vaporware pricing claims.

## Solo-founder rule

Do not maintain more than two repos until there are paying users:

1. public CLI/action repo;
2. private hosted service repo, only when SaaS begins.
