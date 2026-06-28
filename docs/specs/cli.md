# CLI spec

## Binary

Public command:

```bash
verdictci
```

Package:

```bash
@syntaxname/verdictci
```

The published `@syntaxname/verdictci` npm package exposes the `verdictci` binary and bundles VerdictCI's internal core package into the CLI artifact.

## MVP commands

Implemented through Milestone 5:

```bash
verdictci run --config verdictci.yaml --output verdictci-result.json
verdictci run --config verdictci.yaml --output verdictci-result.json --summary verdictci-summary.md
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

Milestone 5 implementation boundary:

- `verdictci --help` must work;
- `verdictci run --config <path> --output <path>` must parse the command;
- missing `--config` or a missing config file must exit `2` with a remediation hint;
- `--output` is accepted and defaults to `verdictci-result.json`;
- YAML parsing, fixture suite execution, promptfoo suite execution, result JSON writing, terminal summary rendering, and Markdown summary writing are implemented;
- promptfoo assertion failures are eval failures and can exit `1`;
- promptfoo provider, adapter, command, or JSON-output errors exit `3` and do not write a VerdictCI result artifact;
- `validate` and `explain` are not implemented yet.

Implemented options:

| Option | Required | Description |
| --- | --- | --- |
| `--config <path>` | yes | Path to VerdictCI config. |
| `--output <path>` | no | Result JSON path. Defaults to `verdictci-result.json`. |
| `--summary <path>` | no | Write a Markdown summary to this path. |
| `--fixture-mode` | no | Use deterministic fixture outputs for examples/tests. |

Planned options:

| Option | Description |
| --- | --- |
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
Threshold failures:
- support-bot: passRate 0.80 < 0.90
Failed cases:
- support-bot/refund-window: Answer omitted required refund window.
Output: verdictci-result.json
Next: inspect failed cases: support-bot/refund-window.
```

## Markdown summary

When `--summary <path>` is provided, `run` writes a Markdown summary beside the result JSON. It includes:

- final verdict;
- suite and case counts;
- suite table with threshold notes;
- failed case table with case id, suite id, and reason;
- result artifact path.

## Stability

CLI flags and exit codes are public contracts. Changing them requires:

- changelog entry;
- migration note;
- version bump.
