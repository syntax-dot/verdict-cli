# Manual QA

## Documentation QA

Run:

```bash
pnpm docs:check
```

Expected:

- required docs exist;
- required keywords appear;
- no unresolved placeholder token remains in committed docs.

## CLI QA

Passing fixture:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
```

Expected:

- exit code `0`;
- `.tmp/pass-result.json` exists;
- terminal summary says `passed`.

Failing fixture:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --fixture-mode
```

Expected:

- exit code `1`;
- `.tmp/fail-result.json` exists;
- terminal summary says `failed`;
- failed case id is visible.

Invalid config:

```bash
pnpm verdictci run --config examples/broken/verdictci.yaml
```

Expected:

- exit code `2`;
- error names the invalid field or missing file;
- error includes a suggested fix.

## GitHub Action QA

In a sample repo:

1. create a PR that changes a prompt;
2. run the VerdictCI workflow;
3. confirm the workflow summary includes final verdict;
4. confirm result JSON is available as artifact;
5. confirm a failing eval blocks merge when branch protection requires the workflow.

## Cleanup

Remove `.tmp/` after QA unless the artifact is intentionally kept as evidence.
