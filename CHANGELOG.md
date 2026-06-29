# Changelog

All notable user-facing changes to VerdictCI are tracked here.

## 0.1.1 - 2026-06-29

Package polish for the public npm launch.

Includes:

- npm discovery metadata and README trust badges;
- Node.js 20+ runtime engine after a smoke test with `node@20`;
- post-release launch checklist for the first public distribution loop.

## 0.1.0 - 2026-06-29

Initial public MVP release.

Includes:

- CLI-first `verdictci run` workflow;
- YAML config parsing and fixture-mode execution;
- stable `verdictci-result.json` artifact shape;
- terminal and Markdown summaries;
- GitHub Action wrapper with job-summary and artifact support;
- promptfoo backend compatibility for simple local eval suites;
- reproducible support bot demo and public release checklist;
- npm package readiness for `@syntaxname/verdictci` with bundled internal core and package smoke verification.

Known limitations:

- v0.1.0 package metadata requires Node.js 24 or newer; the next patch lowers the runtime engine to Node.js 20+;
- hosted dashboards, accounts, billing, GitHub App behavior, and team governance are outside the MVP.
