# Public demo

This demo shows VerdictCI as a CLI-first and GitHub Action-first eval gate for a support bot. It uses fixture cases, so it is deterministic and does not call model providers.

## Prerequisites

- Node.js 20 or newer.
- pnpm 11 or newer.
- A clone of this repository.

Install dependencies:

```bash
pnpm install
```

## Local CLI demo

Passing PR:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
```

Expected:

- exit code `0`;
- terminal summary says `VerdictCI result: passed`;
- `.tmp/pass-result.json` exists;
- the result artifact is valid VerdictCI JSON.

Failing PR:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Expected:

- exit code `1`;
- terminal summary says `VerdictCI result: failed`;
- `support-bot/refund-window` appears in the failed case output;
- `.tmp/fail-result.json` exists;
- `.tmp/fail-summary.md` begins with `# VerdictCI: failed`.

The default passing demo config is:

```bash
pnpm verdictci run --config examples/support-bot/verdictci.yaml --output .tmp/verdictci-result.json --fixture-mode
```

## GitHub Actions demo

The repository workflow at `.github/workflows/verdictci.yml` runs the same support bot suite:

```yaml
- name: Run VerdictCI
  uses: ./
  with:
    config: examples/support-bot/verdictci.yaml
    output: .tmp/verdictci-result.json
    summary: .tmp/verdictci-summary.md
    fixture-mode: "true"
    artifact-name: verdictci-result
```

Expected GitHub Actions behavior:

- the VerdictCI job summary contains the Markdown verdict;
- `verdictci-result.json` is uploaded as the `verdictci-result` artifact;
- passing evals keep the workflow green;
- failing evals publish the summary and artifact before failing the job.

## Demo recording script

Use this sequence for a short demo video or GIF:

1. Show the support bot fixture files in `examples/support-bot/`.
2. Run the passing PR command and show exit `0`.
3. Run the failing PR command and show exit `1`.
4. Open `.tmp/fail-summary.md` and point at the failed case table.
5. Open the GitHub Actions run and show the job summary plus uploaded `verdictci-result` artifact.

Keep the recording under two minutes. Do not include provider API keys, raw prompts from private repositories, or private customer data.

## Design partner outreach

Milestone 6 needs five design partner conversations before hosted features are justified. Use the message in `docs/product/distribution.md` and the blank template in `docs/demo/design-partner-feedback.md`, then record:

- repo or company;
- AI feature type;
- current eval workflow;
- whether they use GitHub pull requests;
- the first blocker they hit while reproducing this demo.

Do not promise dashboards, SSO, billing, GitHub App checks, or hosted history during this demo.
