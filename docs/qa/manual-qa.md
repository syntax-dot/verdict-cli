# Manual QA

## Documentation QA

Run:

```bash
pnpm docs:check
```

Expected:

- required docs exist;
- public release files exist;
- required keywords appear;
- no unresolved placeholder token remains in committed docs.

## Public release QA

Run:

```bash
pnpm docs:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm package:smoke
pnpm verdictci --help
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Expected:

- README links to `docs/release/public-oss-release.md`;
- public release checklist names `syntax-dot/verdict-cli`;
- package publication uses npm package `@syntaxname/verdictci`;
- package smoke installs and runs the packed artifact;
- passing fixture exits `0`;
- failing fixture exits `1`;
- failing Markdown summary begins with `# VerdictCI: failed`;
- no release step requires a hosted service, account system, billing, dashboard, GitHub App, SSO, or enterprise governance.

## Public demo QA

Run:

```bash
pnpm docs:check
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Expected:

- README links to `docs/demo/public-demo.md`;
- public demo guide documents Passing PR, Failing PR, GitHub Actions, and `verdictci-result.json`;
- passing demo exits `0`;
- failing demo exits `1`;
- failing Markdown summary begins with `# VerdictCI: failed`.

## CLI QA

Milestone 1 CLI skeleton:

```bash
pnpm verdictci --help
pnpm verdictci run --config .tmp/missing-verdictci.yaml --output .tmp/verdictci-result.json
```

Expected:

- help exits `0` and names `run`, `--config`, and `--output`;
- missing config exits `2`;
- error output names `.tmp/missing-verdictci.yaml`;
- error output includes a suggested fix;
- `.tmp/verdictci-result.json` is not created.

Passing fixture:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
```

Expected:

- exit code `0`;
- `.tmp/pass-result.json` exists;
- terminal summary says `passed`;
- result JSON includes `schemaVersion: 1`.

Failing fixture:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --fixture-mode
```

Expected:

- exit code `1`;
- `.tmp/fail-result.json` exists;
- terminal summary says `failed`;
- failed case id `support-bot/refund-window` is visible.

Markdown summary:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

Expected:

- exit code `1`;
- `.tmp/fail-summary.md` exists;
- Markdown begins with `# VerdictCI: failed`;
- suite table includes the `support-bot` threshold failure;
- failed case table names `refund-window`;
- result artifact path is included.

Invalid config:

```bash
pnpm verdictci run --config examples/broken/verdictci.yaml
```

Expected:

- exit code `2`;
- error names the invalid field or missing file;
- error includes a suggested fix;
- no result artifact is written.

Promptfoo backend:

```bash
pnpm verdictci run --config examples/promptfoo/verdictci.yaml --output .tmp/promptfoo-result.json
```

Expected:

- exit code `0`;
- `.tmp/promptfoo-result.json` exists;
- terminal summary says `passed`;
- result JSON has `run.mode: "promptfoo"`;
- result JSON includes three passed cases and no raw promptfoo outputs.

If the host `pnpm` uses a Node version older than the project engine requirement, set `VERDICTCI_NODE` to a supported Node executable before running the promptfoo QA command.

## GitHub Action QA

Local simulation:

```bash
rm -f .tmp/action-result.json .tmp/action-summary.md .tmp/github-output.txt .tmp/github-step-summary.md
GITHUB_ACTION_PATH="$PWD" \
GITHUB_WORKSPACE="$PWD" \
GITHUB_OUTPUT=".tmp/github-output.txt" \
GITHUB_STEP_SUMMARY=".tmp/github-step-summary.md" \
INPUT_CONFIG="examples/support-bot/verdictci-fail.yaml" \
INPUT_OUTPUT=".tmp/action-result.json" \
INPUT_SUMMARY=".tmp/action-summary.md" \
INPUT_FIXTURE_MODE="true" \
INPUT_FAIL_ON="fail" \
bash scripts/github-action/run-verdictci.sh
```

Expected:

- runner script exits `0`;
- `.tmp/action-result.json` exists;
- `.tmp/action-summary.md` exists and begins with `# VerdictCI: failed`;
- `.tmp/github-step-summary.md` includes the VerdictCI Markdown summary;
- `.tmp/github-output.txt` includes `exit-code=1`, `verdict=failed`, and
  `result-exists=true`.

Invalid action input:

```bash
rm -f .tmp/action-result.json .tmp/action-summary.md .tmp/github-output.txt .tmp/github-step-summary.md
GITHUB_ACTION_PATH="$PWD" \
GITHUB_WORKSPACE="$PWD" \
GITHUB_OUTPUT=".tmp/github-output.txt" \
GITHUB_STEP_SUMMARY=".tmp/github-step-summary.md" \
INPUT_CONFIG="examples/support-bot/verdictci-fail.yaml" \
INPUT_OUTPUT=".tmp/action-result.json" \
INPUT_SUMMARY=".tmp/action-summary.md" \
INPUT_FIXTURE_MODE="true" \
INPUT_FAIL_ON="warn" \
bash scripts/github-action/run-verdictci.sh
```

Expected:

- runner script exits `0`;
- `.tmp/action-result.json` is not created;
- `.tmp/github-output.txt` includes `exit-code=2`, `verdict=errored`, and
  `result-exists=false`;
- `.tmp/github-step-summary.md` includes the unsupported `fail-on` error.

In a sample repo:

1. create a PR that changes a prompt;
2. run the VerdictCI workflow;
3. confirm the workflow summary includes final verdict;
4. confirm result JSON is available as artifact;
5. confirm a failing eval blocks merge when branch protection requires the workflow.

## Cleanup

Remove `.tmp/` after QA unless the artifact is intentionally kept as evidence.
