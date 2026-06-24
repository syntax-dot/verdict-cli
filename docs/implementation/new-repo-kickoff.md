# New repository kickoff

Use this document when creating the actual VerdictCI implementation repo.

## Step 1: create repository

Recommended:

- GitHub organization: `verdictci`
- repository: `verdictci`
- visibility: private until first working CLI demo, then public

If the organization is unavailable, use `verdictci-labs` for the org and keep the repo name `verdictci`.

## Step 2: copy starter pack

Copy the contents of `verdictci-starter/` into the new repo root.

Do not copy the previous `solo-product-ideas/` research folder unless you want it as private background material.

## Step 3: initialize project

Recommended commands:

```bash
corepack enable
pnpm init
pnpm add -D typescript vitest tsx tsup zod eslint prettier
```

Adjust after deciding the exact stack.

## Step 4: ask Codex for Milestone 0 only

Prompt:

```text
Read AGENTS.md, README.md, docs/product/brief.md, docs/scope/mvp.md, docs/implementation/roadmap.md, and docs/implementation/repo-map.md.

Create the Milestone 0 repo setup only. Do not implement the CLI yet.

Requirements:
- pnpm workspace structure;
- packages/core and packages/cli placeholders;
- lint/typecheck/test scripts;
- one contract test proving the test runner is wired;
- docs:check script that verifies required docs exist;
- GitHub Actions CI for tests/docs.

Before editing, provide a short implementation plan. After editing, run tests and docs checks and report evidence.
```

## Step 5: first issue list

Create issues:

1. Milestone 0 repo setup
2. CLI command skeleton
3. config schema validation
4. result JSON schema
5. fixture runner
6. terminal summary renderer
7. GitHub Action wrapper
8. support bot example
9. failing prompt PR demo
10. promptfoo adapter spike

## Step 6: protect scope

Add labels:

- `mvp`
- `post-mvp`
- `scope-risk`
- `docs`
- `good-first-agent-task`
- `needs-manual-qa`

Every issue should state:

- user outcome;
- non-goals;
- expected tests;
- manual QA command;
- evidence path.

## Step 7: first public release

Release `v0.1.0` only when:

- CLI runs fixture examples;
- result JSON schema is documented;
- GitHub Action example works;
- README has a 5-minute quickstart;
- at least one public demo PR shows a failure.
