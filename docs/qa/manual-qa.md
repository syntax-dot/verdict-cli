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

Invalid config:

```bash
pnpm verdictci run --config examples/broken/verdictci.yaml
```

Expected:

- exit code `2`;
- error names the invalid field or missing file;
- error includes a suggested fix;
- no result artifact is written.

## GitHub Action QA

In a sample repo:

1. create a PR that changes a prompt;
2. run the VerdictCI workflow;
3. confirm the workflow summary includes final verdict;
4. confirm result JSON is available as artifact;
5. confirm a failing eval blocks merge when branch protection requires the workflow.

## Cleanup

Remove `.tmp/` after QA unless the artifact is intentionally kept as evidence.
