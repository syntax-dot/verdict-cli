# GitHub Action architecture

## MVP role

The GitHub Action is the first distribution wrapper around the CLI.

It should:

- install or invoke the CLI;
- run `verdictci run`;
- upload the result JSON as an artifact;
- write a Markdown job summary;
- fail the workflow when the CLI exits with a failing verdict.

## Why Action before App

GitHub Action first:

- faster to build;
- easier to install from README;
- no app permissions review;
- no hosted backend required;
- fits self-service adoption.

GitHub App later:

- richer check runs;
- better PR UX;
- branch protection integration;
- hosted result pages;
- team settings.

## Example workflow

```yaml
name: VerdictCI

on:
  pull_request:
    paths:
      - "prompts/**"
      - "agents/**"
      - "evals/**"
      - "verdictci.yaml"

jobs:
  verdictci:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v6
      - uses: verdictci/action@v1
        with:
          config: verdictci.yaml
          output: verdictci-result.json
          summary: verdictci-summary.md
          upload-artifact: "true"
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Inputs

MVP inputs:

- `config`
- `output`
- `summary`
- `fixture-mode`
- `fail-on`
- `upload-artifact`
- `artifact-name`

Post-MVP inputs:

- `workspace`
- `token`
- `baseline`

## Outputs

MVP outputs:

- `verdict`
- `result-path`
- `passed`
- `failed`
- `errored`

## Summary contract

The job summary should include:

- final verdict;
- suite table;
- failed cases;
- threshold failures;
- result artifact path;
- next action for the developer.

## Permissions

MVP avoids PR comments and only needs repository read access for checkout.
Artifact upload and job-summary writes use the default GitHub Actions runtime
surface; no GitHub App or PR write permission is required.

If posting PR comments:

- request `pull-requests: write`;
- never request broad permissions without need;
- document why each permission is required.

## Security

- Provider API keys remain in GitHub Secrets.
- The action must not send prompts or outputs to VerdictCI servers by default.
- Do not print raw secrets.
- Mask known token patterns in logs where possible.
