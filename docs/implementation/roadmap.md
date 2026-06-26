# Implementation roadmap

## Milestone 0: repo setup

Goal: create a clean repo that Codex can work in safely.

Deliverables:

- package manager selected;
- README and AGENTS.md in root;
- lint/typecheck/test scripts;
- docs check script;
- example folder structure;
- CI for tests and docs.

Exit criteria:

- `pnpm install` works;
- `pnpm test` runs at least one placeholder/contract test;
- `pnpm docs:check` validates required docs paths.

## Milestone 1: CLI skeleton

Goal: a real command exists.

Deliverables:

- `verdictci --help`;
- `verdictci run --config <path>`;
- config file exists check;
- output path option;
- deterministic exit codes for usage/config errors.

Exit criteria:

- tests cover missing config;
- manual QA captures help output and missing config failure.

## Milestone 2: config and result schema

Goal: stable input and output contracts.

Deliverables:

- YAML config parser;
- schema validation;
- result JSON writer;
- fixture suite support;
- sample passing and failing fixtures.

Exit criteria:

- valid fixture config returns exit `0`;
- failing fixture config returns exit `1`;
- invalid config returns exit `2`;
- result JSON validates against documented schema.

## Milestone 3: summary renderer

Goal: humans can understand CI output.

Deliverables:

- terminal summary;
- Markdown summary;
- failed case table;
- threshold failure explanation.

Exit criteria:

- failing fixture output names failed suite/case;
- Markdown summary is saved and readable.

## Milestone 4: GitHub Action wrapper

Goal: VerdictCI runs in GitHub Actions.

Deliverables:

- action metadata;
- workflow example;
- artifact upload;
- job summary output;
- secrets documentation.

Exit criteria:

- sample workflow runs in a test repo or local simulation;
- result artifact is attached or written;
- job fails when VerdictCI exits `1`.

## Milestone 5: promptfoo backend

Goal: VerdictCI can run a real eval backend.

Status: implemented in the MVP branch.

Deliverables:

- promptfoo adapter;
- config mapping;
- result normalization;
- example promptfoo suite.

Implemented boundary:

- executes `promptfoo eval` locally through the CLI;
- normalizes promptfoo JSON output into summary-only VerdictCI result cases;
- treats promptfoo assertion failures as eval failures;
- treats promptfoo command/provider/runtime/output failures as provider errors;
- keeps raw promptfoo outputs out of the VerdictCI artifact.

Exit criteria:

- a promptfoo-backed example runs locally;
- result JSON maps backend outputs into VerdictCI schema;
- provider errors map to exit `3`.

## Milestone 6: public demo

Goal: publish a reproducible demo.

Status: started.

Deliverables:

- support bot example;
- passing PR;
- failing PR;
- README walkthrough;
- short demo video or GIF.

Implemented boundary:

- README links directly to the public demo path;
- `docs/demo/public-demo.md` documents passing and failing local PR scenarios;
- the demo guide documents the GitHub Actions workflow and `verdictci-result.json` artifact;
- docs checks require the public demo guide and README link.

Exit criteria:

- a new developer can reproduce the demo from README;
- the public feedback path is documented and does not require hosted product features.

## Milestone 7: public OSS and npm release readiness

Goal: prepare the working MVP for a public open-source repository and later npm publication.

Status: started.

Deliverables:

- public repository target documented as `syntax-dot/verdict-cli`;
- license, changelog, contributing guide, security policy, issue templates, and pull request template;
- README links to the public release checklist;
- npm name availability findings documented;
- package strategy gate documented for the CLI/core workspace split;
- docs checks require the public-release surface.

Exit criteria:

- `pnpm docs:check` passes;
- lint, typecheck, tests, build, and manual fixture QA pass;
- no `.tmp/`, `.omo/`, raw secrets, private prompts, raw outputs, or local IDE files are staged;
- public transfer is approved separately after verification;
- npm publish is blocked until package name and package strategy are finalized.

## Post-MVP

Only after real users:

- GitHub App;
- hosted run history;
- private result links;
- baseline approval UI;
- team dashboard;
- billing.
