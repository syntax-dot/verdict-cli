# Contributing

VerdictCI is an MVP-stage Eval-as-CI tool. Contributions should keep the product CLI-first, GitHub Action-first, deterministic, and narrow.

## Local setup

```bash
pnpm install
pnpm docs:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

Run the manual demo before proposing behavior changes:

```bash
pnpm verdictci run --config examples/support-bot/verdictci-pass.yaml --output .tmp/pass-result.json --fixture-mode
pnpm verdictci run --config examples/support-bot/verdictci-fail.yaml --output .tmp/fail-result.json --summary .tmp/fail-summary.md --fixture-mode
```

## Scope

Good first contributions:

- CLI error clarity;
- config validation improvements;
- result JSON compatibility checks;
- GitHub Action summary improvements;
- eval examples and templates;
- documentation fixes that keep commands copy-pasteable.

Out of scope for the MVP:

- hosted dashboards;
- billing;
- accounts;
- SSO;
- GitHub App behavior;
- enterprise governance features.

## Pull requests

Before opening a pull request:

1. Keep the diff focused on one behavior or documentation change.
2. Add or update tests for behavior changes.
3. Update the relevant docs when commands, config, result artifacts, or Action behavior change.
4. Do not commit `.tmp/`, `.omo/`, local env files, generated result artifacts, or raw secrets.
5. Include the verification commands you ran.

Treat prompts, eval outputs, provider keys, and customer traces as sensitive data.
