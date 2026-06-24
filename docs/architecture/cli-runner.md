# CLI runner architecture

## Command shape

Primary command:

```bash
verdictci run --config verdictci.yaml --output verdictci-result.json
```

Alias during early development:

```bash
ai-ci run -c evals.yaml
```

Use `verdictci` for public docs. Keep `ai-ci` only as an internal shorthand if needed.

## CLI responsibilities

The CLI owns:

- argument parsing;
- environment validation;
- config file discovery;
- output path resolution;
- lifecycle logging;
- exit-code mapping.

The CLI does not own:

- eval scoring logic;
- provider-specific behavior;
- result schema construction;
- GitHub-specific rendering.

## Suggested command set

MVP:

```bash
verdictci run
verdictci validate
verdictci explain
```

Post-MVP:

```bash
verdictci init
verdictci compare
verdictci upload
verdictci baseline approve
```

## `run`

Runs configured eval suites.

Required options:

- `--config <path>`

Common options:

- `--output <path>`
- `--format json|markdown|both`
- `--fixture-mode`
- `--fail-on warn|fail|error`
- `--github-summary`

## `validate`

Validates config and test case files without running provider calls.

This command is important because users need a fast way to debug setup in CI.

## `explain`

Reads a result JSON and prints a human explanation.

This helps agents and humans inspect artifacts after CI.

## Logging

Default logs should be concise:

```text
VerdictCI 0.1.0
Config: verdictci.yaml
Suites: 2
Cases: 24
Running support-bot...
Running rag-citations...
Result: failed
Output: verdictci-result.json
```

Verbose mode can include backend details.

## Exit code mapping

See [exit codes](../specs/exit-codes.md).

## Error design

Every error should include:

- short message;
- file path when relevant;
- line or case id when relevant;
- suggested fix;
- docs link when stable.

Example:

```text
Configuration error: suite "support-bot" references missing file examples/support-bot/cases.jsonl.
Fix: create the file or update suites[0].cases in verdictci.yaml.
```
