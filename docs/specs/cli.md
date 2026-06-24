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

```bash
verdictci run --config verdictci.yaml --output verdictci-result.json
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

Options:

| Option | Required | Description |
| --- | --- | --- |
| `--config <path>` | yes | Path to VerdictCI config. |
| `--output <path>` | no | Result JSON path. Defaults to `verdictci-result.json`. |
| `--format <kind>` | no | `json`, `markdown`, or `both`. |
| `--fixture-mode` | no | Use deterministic fixture outputs for examples/tests. |
| `--github-summary` | no | Write Markdown summary to `$GITHUB_STEP_SUMMARY` when present. |
| `--fail-on <level>` | no | `fail` by default. |

## `validate`

Validates config and test case references without provider calls.

Must return:

- exit `0` for valid config;
- exit `2` for invalid config.

## `explain`

Reads result JSON and prints a human explanation.

Must return:

- exit `0` for readable result;
- exit `2` for invalid or missing result file.

## Terminal summary

Minimum output:

```text
VerdictCI result: failed
Suites: 2 total, 1 passed, 1 failed
Cases: 24 total, 21 passed, 3 failed
Output: verdictci-result.json
Next: inspect failed cases in suite "support-bot".
```

## Stability

CLI flags and exit codes are public contracts. Changing them requires:

- changelog entry;
- migration note;
- version bump.
