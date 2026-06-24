# Privacy and security

## Data classification

VerdictCI may process sensitive data:

- prompts;
- system instructions;
- user-like test cases;
- retrieval snippets;
- model outputs;
- scoring explanations;
- provider API keys;
- GitHub metadata.

Treat all of it as customer confidential by default.

## MVP privacy stance

The MVP is local/CI only:

- no hosted upload by default;
- no raw prompt telemetry;
- no automatic result sharing;
- no hidden analytics;
- no provider key storage by VerdictCI.

If telemetry is added later, it must be opt-in and must not include raw prompts or outputs unless explicitly configured.

## Secrets

Never log:

- `OPENAI_API_KEY`;
- provider API keys;
- GitHub tokens;
- installation tokens;
- webhook secrets.

Error messages should say a secret is missing or invalid without echoing it.

## Result artifacts

Result JSON may include model outputs. Users must be able to choose:

- include raw outputs;
- include redacted outputs;
- include summaries only;
- omit case-level outputs.

Default for MVP can include outputs locally, but docs must warn that CI artifacts may be visible to repo collaborators.

## Hosted mode requirements

Before hosted result storage:

- retention policy;
- deletion endpoint;
- workspace access control;
- encryption at rest;
- signed private result links;
- audit trail for result access;
- clear privacy policy.

## GitHub permissions

Principle:

```text
Request the fewest permissions required for the current feature.
```

MVP Action:

- `contents: read`;
- `pull-requests: write` only if posting comments;
- no organization admin permissions.

Future GitHub App:

- checks write;
- contents read;
- pull requests read/write only if summaries/comments need it.

## Prompt injection risk

VerdictCI evaluates AI outputs, but it also reads user-provided test cases. Treat test data as untrusted input:

- do not execute shell from test cases;
- do not interpolate test case text into commands;
- sanitize Markdown summaries;
- avoid rendering raw HTML in reports.

## Supply-chain risk

Because VerdictCI runs in CI:

- lock dependencies;
- publish provenance when possible;
- document release process;
- sign artifacts later if users ask;
- keep the GitHub Action minimal and auditable.

## Security reporting

Add `SECURITY.md` before public launch with:

- reporting email;
- supported versions;
- disclosure expectations;
- no bug bounty unless you can operate one.
