# Non-goals

This document protects VerdictCI from scope creep.

## Not an observability platform

VerdictCI does not try to replace LangSmith, Langfuse, Helicone, Phoenix, or other observability platforms.

It can link to or export data for those tools later. The MVP only needs CI-time evaluation and result artifacts.

## Not a prompt CMS

VerdictCI does not manage prompt authoring, approvals, environments, or runtime prompt delivery in the MVP.

Prompt registry is a possible future product, but not part of the first release.

## Not a full red-team scanner

VerdictCI can run red-team-style evals when configured, especially through promptfoo. It should not claim broad security coverage in the MVP.

Security claims require high trust and careful validation.

## Not a model gateway

VerdictCI should not proxy production LLM traffic in the MVP.

Provider calls should happen inside the user's CI or local environment using their own keys.

## Not a dataset management platform

The MVP can read test cases from local files. It does not need hosted datasets, labeling workflows, versioned approvals, or annotation UIs.

## Not a no-code builder

The first user is a developer. Configuration can be YAML and files. A UI can come later if users ask for it.

## Not enterprise governance

Avoid:

- SSO;
- audit exports;
- compliance claims;
- role-based access control;
- procurement materials;
- custom on-prem deployments.

Those can become paid features only after the core workflow works.

## Not every CI platform

Start with GitHub Actions. Do not support GitLab, CircleCI, Buildkite, Azure Pipelines, and Jenkins at the same time.

The CLI should be portable enough for other CI systems, but official integration starts with GitHub.

## Not every programming language

The CLI can be language-agnostic at the process boundary, but examples should start with one or two popular AI stacks:

- TypeScript / Next.js AI SDK;
- Python / OpenAI or LangChain style scripts.

## Scope guard prompt

Before accepting a new feature, ask:

```text
Does this make the first PR eval gate more useful, clearer, or easier to install?
```

If no, defer.
