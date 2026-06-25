# Design partner feedback template

Use this template for each design partner conversation during Milestone 6. Keep real customer names, private repository URLs, secrets, prompt text, eval outputs, and commercially sensitive notes outside the public repo.

## Conversation metadata

Date:

Interviewer:

Contact:

Company or project:

Public URL, if safe to record:

Role:

Permission to quote publicly:

## Fit check

AI feature type:

- support bot
- RAG search
- classifier
- tool-calling agent
- internal copilot
- other:

Repository workflow:

- GitHub pull requests:
- GitHub Actions:
- Branch protection:
- Current release gate:

Current eval workflow:

- no evals
- manual prompt checks
- notebooks/scripts
- promptfoo
- hosted eval platform
- custom CI script
- other:

## Problem evidence

Recent AI behavior regression:

How they noticed:

Release or review pain:

Who owns prompt, agent, model, or RAG changes:

What would make them trust an automated CI gate:

## Demo reproduction

Demo command attempted:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Could reproduce without help:

First blocker:

Confusing README or demo step:

GitHub Actions summary reaction:

Result artifact reaction:

## Repo installation notes

Target repo type:

Desired eval suite:

Provider or backend:

Sensitive-data constraints:

Setup blockers:

Would install VerdictCI in one real repo:

Would run it on more than one PR:

## Product signals

Requested next capability:

- baseline comparison
- better GitHub Action packaging
- promptfoo compatibility
- more examples/templates
- GitHub App checks
- hosted run history
- private result links
- team dashboard
- other:

Willingness to pay signal:

Would pay for:

- local CLI only
- setup help
- hosted history
- private result links
- team workflow
- agency/client reporting

Strongest quote, if approved:

## Decision

Signal:

- strong positive
- weak positive
- neutral
- weak negative
- strong negative

Follow-up action:

Owner:

Due date:

Private notes location:
