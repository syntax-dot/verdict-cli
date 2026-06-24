# MVP scope

## MVP definition

The MVP is a CLI and GitHub Action that can evaluate AI behavior changes in a pull request and produce a clear pass/fail verdict.

The first version succeeds if a developer can add VerdictCI to a repository in under 20 minutes and see a useful CI result on a prompt, agent, or RAG change.

## MVP user story

```text
As an engineer shipping an AI feature,
I want evals to run automatically when a pull request changes prompts, agent instructions, tools, retrieval logic, or eval datasets,
so that I can catch behavior regressions before merge.
```

## Must-have capabilities

1. CLI command

```bash
verdictci run --config verdictci.yaml --output verdictci-result.json
```

2. YAML config

The config defines:

- eval suites;
- test case files;
- provider command or adapter;
- pass thresholds;
- output path;
- CI behavior.

3. Result JSON

The result artifact includes:

- schema version;
- run metadata;
- suite summaries;
- case-level results;
- failed thresholds;
- cost and duration when available;
- final verdict.

4. Terminal summary

The CLI prints:

- total suites;
- total cases;
- pass/fail/skip/error counts;
- top regressions;
- result file path;
- final verdict.

5. Exit codes

- `0`: required checks passed;
- `1`: required checks failed;
- `2`: configuration or usage error;
- `3`: provider/runtime error;
- `4`: internal unexpected error.

6. GitHub Action wrapper

The action runs the CLI, uploads the result artifact, and writes a Markdown job summary.

## Should-have capabilities

- Promptfoo compatibility for simple suites.
- Example support bot eval suite.
- Example RAG citation eval suite.
- Fixture mode for deterministic demos without spending model tokens.
- Baseline comparison against a checked-in JSON file.

## Could-have capabilities

- PR comment output.
- HTML report.
- DeepEval compatibility.
- OpenAI Evals export.
- local web viewer.

## Explicit non-goals

Not in MVP:

- hosted SaaS dashboard;
- GitHub App;
- billing;
- user accounts;
- team management;
- SSO;
- all provider integrations;
- full tracing;
- no-code eval editor;
- complex red-team scanning;
- Slack/Jira/Linear integrations;
- model gateway;
- prompt registry.

## MVP boundary rule

If a feature does not improve the first pull-request verdict demo, it is post-MVP.

## First demo acceptance

The sample repo must show:

1. `verdictci.yaml` exists.
2. `examples/support-bot/cases.jsonl` exists.
3. `verdictci run --config examples/support-bot/verdictci.yaml` runs locally.
4. The run creates `verdictci-result.json`.
5. A failing fixture returns exit code `1`.
6. A passing fixture returns exit code `0`.
7. GitHub Actions workflow can run the same suite.

## Product quality bar

The MVP can be small, but it must not feel sloppy:

- clear errors;
- stable schemas;
- reproducible examples;
- no hidden network uploads;
- docs match commands;
- installation is simple;
- default behavior is safe.
