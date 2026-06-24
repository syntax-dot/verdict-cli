# CLI spec

## Binary

Public command:

```bash
verdictci
```

Package:

```bash
@verdictci/cli
```

## MVP commands

Implemented through Milestone 2:

```bash
verdictci run --config verdictci.yaml --output verdictci-result.json
```

Planned for later MVP milestones:

```bash
verdictci validate --config verdictci.yaml
verdictci explain --result verdictci-result.json
```

## `run`

Required:

- load config;
- validate config;
- run suites;
- write result JSON;
- print summary;
- exit with documented code.

Milestone 2 implementation boundary:

- `verdictci --help` must work;
- `verdictci run --config <path> --output <path>` must parse the command;
- missing `--config` or a missing config file must exit `2` with a remediation hint;
- `--output` is accepted and defaults to `verdictci-result.json`;
- YAML parsing, fixture suite execution, result JSON writing, and a minimal terminal result summary are implemented;
- `validate`, `explain`, markdown output, GitHub summaries, provider adapters, and promptfoo execution are not implemented yet.

Implemented options:

| Option | Required | Description |
| --- | --- | --- |
| `--config <path>` | yes | Path to VerdictCI config. |
| `--output <path>` | no | Result JSON path. Defaults to `verdictci-result.json`. |
| `--fixture-mode` | no | Use deterministic fixture outputs for examples/tests. |

Planned options:

| Option | Description |
| --- | --- |
| `--format <kind>` | `json`, `markdown`, or `both`. |
| `--github-summary` | Write Markdown summary to `$GITHUB_STEP_SUMMARY` when present. |
| `--fail-on <level>` | Choose the failure level. Defaults to `fail`. |

## `validate`

Planned, not implemented in Milestone 2.

Validates config and test case references without provider calls.

Must return:

- exit `0` for valid config;
- exit `2` for invalid config.

## `explain`

Planned, not implemented in Milestone 2.

Reads result JSON and prints a human explanation.

Must return:

- exit `0` for readable result;
- exit `2` for invalid or missing result file.

## Terminal summary

Minimum output:

```text
VerdictCI result: failed
Suites: 2 total, 1 passed, 1 failed
Cases: 24 total, 21 passed, 3 failed, 0 skipped, 0 errored
Output: verdictci-result.json
Next: inspect failed cases: support-bot/refund-window.
```

## Stability

CLI flags and exit codes are public contracts. Changing them requires:

- changelog entry;
- migration note;
- version bump.
