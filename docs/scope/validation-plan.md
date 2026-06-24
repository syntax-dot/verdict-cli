# Validation plan

## Goal

Validate that developers want an Eval-as-CI workflow enough to install it in real repositories.

## Validation stages

### Stage 1: Problem interviews

Target: 20 conversations.

Ask:

- What AI feature do you ship?
- What broke recently?
- How did you detect the issue?
- Do you have evals?
- Are evals in CI?
- Who reviews prompt/model changes?
- What would make you trust an automated gate?

Success:

- at least 10 people report a real regression or manual eval pain;
- at least 5 agree to try a GitHub Action demo.

### Stage 2: Reproducible demo

Build a public demo repo with:

- one passing PR;
- one failing PR;
- clear GitHub Action summary;
- local reproduction command.

Success:

- 5 developers can run it without help;
- 3 ask for support for their repo or stack.

### Stage 3: Design partners

Install VerdictCI in 5 real repositories.

Success:

- at least 3 run it on more than one PR;
- at least 1 catches or clarifies a real regression;
- at least 2 ask for hosted history, baseline approval, or better PR UX.

### Stage 4: Paid beta

Offer a small paid plan:

```text
$49/month for hosted run history, private result links, and setup help for up to 3 repos.
```

Success:

- 3 paying teams or agencies;
- churn reasons are product gaps, not "we do not need this".

## What invalidates the idea

Strong negative signals:

- developers say evals are important but never install them;
- teams prefer existing promptfoo-only workflows and do not need a product layer;
- results are too noisy to trust in branch protection;
- setup requires too much custom work per repo;
- users want a consulting service, not a self-service product.

## Validation artifacts

Keep:

- interview notes;
- repository install notes;
- failed setup logs;
- feature requests;
- screenshots of useful PR summaries;
- examples of false positives and false negatives.

Store private notes outside the public repo if they contain customer data.
