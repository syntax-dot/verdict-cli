# Repository map

This is the recommended future repository structure.

```text
.
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── apps/
│   └── web/                  # post-MVP hosted dashboard; do not create in MVP unless needed
├── packages/
│   ├── cli/                  # CLI entrypoint
│   ├── core/                 # config, runner contracts, result aggregation
│   ├── action/               # GitHub Action wrapper
│   ├── adapters/
│   │   └── promptfoo/        # promptfoo backend adapter
│   └── schemas/              # shared JSON schemas
├── examples/
│   ├── support-bot/
│   ├── rag-citations/
│   ├── tool-agent/
│   └── classifier/
├── docs/
├── scripts/
└── .github/
    └── workflows/
```

## Package responsibilities

### `packages/core`

Owns:

- config types;
- schema validation;
- result types;
- threshold logic;
- runner interfaces;
- summary model.

Must not depend on GitHub Actions.

### `packages/cli`

Owns:

- command parsing;
- process IO;
- exit codes;
- terminal rendering;
- calling core.

### `packages/action`

Owns:

- GitHub Action metadata;
- invoking CLI in CI;
- writing job summary;
- artifact upload integration.

### `packages/adapters/promptfoo`

Owns:

- mapping VerdictCI config to promptfoo execution;
- parsing promptfoo results;
- normalizing results into VerdictCI schema.

### `packages/schemas`

Owns:

- JSON schema for result artifacts;
- config schema if useful;
- fixture validation helpers.

## Technology recommendation

Recommended stack for a solo TypeScript fullstack developer:

- TypeScript;
- pnpm workspaces;
- tsup or tsx for CLI development;
- zod for config validation;
- vitest for tests;
- GitHub Actions for CI;
- markdownlint or custom docs check later.

Reason:

- fast iteration;
- good Codex support;
- easy npm distribution;
- natural GitHub Action packaging;
- compatible with web dashboard later.

## What not to add early

Avoid early:

- database;
- Next.js app;
- auth;
- billing;
- queues;
- background workers;
- Kubernetes;
- multi-provider hosted execution.

Add these only when user demand is proven.
