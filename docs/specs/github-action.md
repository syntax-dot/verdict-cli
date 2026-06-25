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
5. fails the workflow with the same semantic exit code captured from VerdictCI.

The Milestone 4 implementation is a composite action in root `action.yml`.
It runs the local CLI from `GITHUB_ACTION_PATH`, appends the generated Markdown
summary to `$GITHUB_STEP_SUMMARY`, uploads the result JSON only when configured,
and delays the final failure step until after summary and artifact publication.

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `config` | yes | | Path to config file. |
| `output` | no | `verdictci-result.json` | Result JSON path. |
| `summary` | no | `verdictci-summary.md` | Markdown summary path. |
| `fixture-mode` | no | `false` | Run fixtures instead of provider calls. |
| `fail-on` | no | `fail` | Failure policy. Only `fail` is supported in the MVP. |
| `upload-artifact` | no | `true` | Upload result JSON. |
| `artifact-name` | no | `verdictci-result` | Uploaded artifact name. |

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
    summary: verdictci-summary.md
    upload-artifact: "true"
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

Repository-local workflow examples can use the action from the same checkout:

```yaml
- uses: ./
  with:
    config: examples/support-bot/verdictci.yaml
    output: .tmp/verdictci-result.json
    summary: .tmp/verdictci-summary.md
    fixture-mode: "true"
```

## Job summary

The summary must include:

- final verdict;
- suite status table;
- failed cases;
- result artifact path;
- next action.

The action appends the CLI-generated Markdown file to `$GITHUB_STEP_SUMMARY`.
If action input validation fails before the CLI runs, the action writes a short
error summary and exposes `verdict=errored`.

## Security

The action must not upload data to VerdictCI servers by default.

Provider secrets stay in GitHub Actions secrets.

The action must not print raw secrets, prompts, expected answers, raw model
outputs, or traces in logs by default.
