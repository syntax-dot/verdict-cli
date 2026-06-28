# Changelog

All notable user-facing changes to VerdictCI are tracked here.

## 0.1.0 - 2026-06-26

Initial MVP release candidate for public repository preparation.

Includes:

- CLI-first `verdictci run` workflow;
- YAML config parsing and fixture-mode execution;
- stable `verdictci-result.json` artifact shape;
- terminal and Markdown summaries;
- GitHub Action wrapper with job-summary and artifact support;
- promptfoo backend compatibility for simple local eval suites;
- reproducible support bot demo and public release checklist.
- npm package readiness for `@syntaxname/verdictci` with bundled internal core and package smoke verification.

Known limitations:

- npm publication still requires a maintainer-run `npm publish --access public` after public repository transfer approval;
- hosted dashboards, accounts, billing, GitHub App behavior, and team governance are outside the MVP.
