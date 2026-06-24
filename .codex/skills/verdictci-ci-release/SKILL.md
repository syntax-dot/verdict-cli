---
name: verdictci-ci-release
description: Work on VerdictCI CI, GitHub Action, PR summaries, release packaging, npm publication, docs checks, or release readiness. Use when Codex needs to verify action behavior, generated summaries, exit codes, artifacts, versioning, changelog, or distribution workflows.
---

# VerdictCI CI Release

Use this skill for distribution-facing work: GitHub Action behavior, CI status, package release, and release verification.

## Required Reading

Read these files before editing CI or release behavior:

1. `AGENTS.md`
2. `docs/architecture/github-action.md`
3. `docs/specs/github-action.md`
4. `docs/specs/pr-summary.md`
5. `docs/specs/exit-codes.md`
6. `docs/qa/manual-qa.md`
7. `docs/qa/docs-checks.md`

For packaging strategy, read `docs/product/repository-strategy.md` and `docs/product/distribution.md`.

## CI Rules

- Keep CI checks reproducible and explainable.
- Do not require hosted VerdictCI services for the MVP Action.
- Always upload or preserve the result artifact when practical.
- Make failing summaries actionable: name the suite, case, expected behavior, actual behavior, and remediation hint.
- Keep exit code behavior aligned with `docs/specs/exit-codes.md`.
- Keep workflow examples copy-pasteable.

## Release Rules

- Track lockfiles.
- Do not publish secrets, local evidence, fixture outputs, or private env files.
- Verify package contents before release.
- Verify CLI help after packaging.
- Keep release notes focused on user-visible behavior, migration notes, and known limitations.

## Manual QA Gate

For GitHub Action changes, verify at least:

- successful run with passing evals;
- failing run with threshold breach;
- result artifact exists;
- workflow summary names failures clearly;
- docs show the same inputs and outputs as the implementation.

For package release changes, verify at least:

- install from the packed artifact;
- `verdictci --help`;
- one fixture run through the installed binary;
- no unwanted files in the package.
