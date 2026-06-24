# Architecture overview

## Architecture principle

VerdictCI should be a thin, reliable orchestration layer around eval execution.

The core product is not a model, agent framework, or prompt engine. It is the layer that turns eval results into CI decisions.

## MVP components

```text
verdictci CLI
  |
  | reads
  v
config loader ------ test case loader
  |
  v
runner adapter ------ provider/eval backend
  |
  v
result aggregator
  |
  +--> result JSON
  +--> terminal summary
  +--> GitHub Action summary
  +--> process exit code
```

## Component responsibilities

### CLI

Responsibilities:

- parse command arguments;
- locate config;
- call the runner;
- write outputs;
- map failures to exit codes.

The CLI must remain thin. Business logic belongs in core modules.

### Config loader

Responsibilities:

- parse YAML;
- validate schema;
- normalize paths;
- apply defaults;
- report clear configuration errors.

### Test case loader

Responsibilities:

- read JSONL/YAML/CSV test cases;
- validate required fields;
- preserve source file and line numbers for error messages.

### Runner adapter

Responsibilities:

- execute a suite through a backend;
- support fixture mode for deterministic examples;
- support promptfoo-compatible execution first;
- later support DeepEval or custom command adapters.

### Result aggregator

Responsibilities:

- compute suite and run summaries;
- apply thresholds;
- assign final verdict;
- produce stable JSON.

### Summary renderer

Responsibilities:

- create terminal output;
- create Markdown for GitHub Actions summary;
- optionally create PR comment body later.

## Data flow

1. User runs `verdictci run --config verdictci.yaml`.
2. CLI loads and validates config.
3. CLI loads test cases.
4. Runner executes suites.
5. Aggregator computes pass/fail.
6. Result JSON is written.
7. Summary is rendered.
8. Process exits with deterministic code.

## Post-MVP architecture

Later:

```text
GitHub App
  |
  v
VerdictCI API
  |
  +--> run metadata
  +--> hosted result pages
  +--> baseline approvals
  +--> team dashboard
```

Do not build this until the CLI and GitHub Action have real users.

## Reliability principles

- Local execution must work without network calls to VerdictCI servers.
- Provider/model calls must be explicit and user-controlled.
- Result schema must be versioned.
- CI failures must be explainable.
- The same config should behave the same locally and in CI.

## Privacy principles

- Default mode stores outputs locally only.
- No automatic telemetry with raw prompts or model outputs.
- Any future telemetry must be opt-in and documented.
- Hosted result links must support deletion and retention limits.
