# GitHub Action spec

## Action name

```text
VerdictCI
```

## Repository

```text
verdictci/action
```

## MVP behavior

The action:

1. installs or runs the VerdictCI CLI;
2. passes configured inputs to `verdictci run`;
3. writes a GitHub job summary;
4. uploads `verdictci-result.json` as an artifact when configured;
5. fails the workflow when VerdictCI exits with a failing verdict.

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `config` | yes | | Path to config file. |
| `output` | no | `verdictci-result.json` | Result JSON path. |
| `fixture-mode` | no | `false` | Run fixtures instead of provider calls. |
| `fail-on` | no | `fail` | Failure threshold level. |
| `upload-artifact` | no | `true` | Upload result JSON. |

## Outputs

| Output | Description |
| --- | --- |
| `verdict` | `passed`, `failed`, or `errored`. |
| `result-path` | Path to result JSON. |
| `passed` | Passed case count. |
| `failed` | Failed case count. |
| `errored` | Errored case count. |

## Example

```yaml
- uses: verdictci/action@v1
  with:
    config: verdictci.yaml
    output: verdictci-result.json
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Job summary

The summary must include:

- final verdict;
- suite status table;
- failed cases;
- result artifact path;
- next action.

## Security

The action must not upload data to VerdictCI servers by default.

Provider secrets stay in GitHub Actions secrets.
