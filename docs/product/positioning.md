# Positioning

## Category

VerdictCI is an Eval-as-CI tool.

Do not position it as:

- LLM observability;
- prompt management;
- agent framework;
- AI testing platform for everyone;
- AI governance suite.

The sharper category is:

```text
CI gates for AI behavior changes.
```

## Core message

```text
Fail pull requests when prompts, agents, or RAG behavior regress.
```

## Alternatives

### Manual prompt review

How users solve it today:

- manually run prompts;
- paste examples into chat;
- inspect screenshots;
- trust the developer who changed the prompt.

VerdictCI advantage:

- repeatable;
- CI-native;
- artifact-backed;
- works on every PR.

### promptfoo-only workflow

promptfoo is a strong eval framework and may be a backend or compatibility target.

VerdictCI should not pretend promptfoo does not exist. Instead:

- promptfoo runs evals;
- VerdictCI productizes the CI verdict workflow;
- VerdictCI standardizes result artifacts, thresholds, summaries, and later team history.

Positioning:

```text
Use promptfoo to define evals. Use VerdictCI to turn them into merge decisions and team workflows.
```

### LangSmith / Langfuse / Helicone / Phoenix

These tools are broader observability and evaluation platforms.

VerdictCI difference:

- starts in PRs, not dashboards;
- focuses on merge gates;
- requires less platform adoption;
- can export or link to observability tools later.

### Custom GitHub Actions script

Many teams can write a script themselves.

VerdictCI advantage:

- stable result schema;
- reusable templates;
- better summaries;
- baseline policy;
- fewer one-off scripts to maintain;
- path to hosted history when needed.

## Target wedge

Best first wedge:

```text
Small teams with AI features who already know they need evals but have not put them into CI.
```

Avoid:

- teams that do not believe in evals;
- teams that only want broad AI governance;
- companies that need procurement before trying a GitHub Action;
- users asking for a no-code prompt platform.

## Landing page copy

Headline:

```text
Fail pull requests when AI behavior regresses.
```

Subheadline:

```text
VerdictCI runs prompt, agent, and RAG evals in CI, writes a clear PR summary, and blocks merges when configured quality gates fail.
```

CTA:

```text
Run your first AI regression check
```

## Proof points to earn

Do not claim these until true:

- catches real regressions;
- trusted by teams;
- used in production;
- saves review time;
- works with many providers.

Earn proof through public demos and design partners.

## Positioning risks

Risk: "This is just promptfoo."

Response: support promptfoo as a backend, but own CI verdicts, result schema, baseline management, and PR/team workflow.

Risk: "This is too small."

Response: small is good at the start. CI gates are the wedge; history, baselines, and GitHub App are expansion.

Risk: "Evals are noisy."

Response: focus on stable fixtures, threshold policy, deterministic checks where possible, and clear false-positive triage.
