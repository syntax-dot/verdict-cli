---
name: verdictci-modernize
description: Modernize VerdictCI architecture, dependencies, module boundaries, provider integrations, storage strategy, or post-MVP product surface without breaking the CLI-first contract. Use for refactors, upgrades, SaaS-readiness planning, GitHub App preparation, or migration work after MVP behavior exists.
---

# VerdictCI Modernize

Use this skill for modernization and refactoring work after the behavior being protected is understood.

## Required Reading

Read these files before changing architecture:

1. `AGENTS.md`
2. `docs/architecture/overview.md`
3. `docs/architecture/cli-runner.md`
4. `docs/architecture/privacy-security.md`
5. `docs/implementation/decisions.md`
6. `docs/scope/non-goals.md`
7. The spec for the public surface being changed.

If the modernization adds product surface area, also read `docs/product/monetization.md` and `docs/product/distribution.md`.

## Refactor Rules

- Preserve existing CLI behavior unless the task explicitly changes it.
- Add characterization tests before moving logic.
- Keep config and result JSON backward-compatible or document a migration.
- Prefer incremental module boundaries over framework rewrites.
- Record architectural decisions in `docs/implementation/decisions.md`.
- Keep private data local by default.
- Do not add cloud dependencies to core runner code.

## Dependency Upgrade Rules

- Explain why the dependency is needed.
- Check package health, license, maintenance, and transitive risk.
- Keep optional integrations optional.
- Verify install, build, tests, and one real CLI scenario.
- Update release notes or migration notes when user behavior changes.

## Post-MVP Expansion Rules

Before adding SaaS, GitHub App, hosted baselines, dashboards, or team features, require:

- proven CLI or Action usage;
- clear paid user need;
- written data retention and deletion model;
- explicit security boundary;
- migration path that keeps local-only CLI usage viable.

## Completion Gate

A modernization task is not complete until:

- old behavior is protected by tests;
- new behavior has targeted tests;
- manual QA drives the same public surface users rely on;
- docs and decisions explain the change;
- evidence shows before/after commands or artifacts.
