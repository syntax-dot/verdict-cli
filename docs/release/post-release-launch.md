# Post-release launch checklist

## Purpose

This checklist keeps the first public distribution loop concrete after the `v0.1.0` npm and GitHub releases. It is scoped to the CLI-first and GitHub Action-first MVP.

## Current public assets

- Public repo: `syntax-dot/verdict-cli`.
- npm package: `@syntaxname/verdictci`.
- First GitHub release: `v0.1.0`.
- Install command: `npm install -D @syntaxname/verdictci`.
- Public demo guide: `docs/demo/public-demo.md`.

## Seven-day launch loop

1. Verify npm install from a clean project.
2. Verify `npx verdictci --help`.
3. Verify one passing fixture through the installed binary.
4. Capture a GitHub Actions summary screenshot from the public repo.
5. Publish one short launch post with the install command and demo link.
6. Track npm downloads, GitHub stars, issues, and failed setup reports.
7. Turn repeated setup friction into a patch release before adding new features.

## Launch post skeleton

```text
I released VerdictCI v0.1.0.

It is a small CLI and GitHub Action that fails pull requests when prompt, agent, or RAG behavior regresses.

Install:
npm install -D @syntaxname/verdictci

Run:
npx verdictci run --config verdictci.yaml --output verdictci-result.json

Repo:
https://github.com/syntax-dot/verdict-cli
```

## Validation signals

- 100 npm downloads after package publication.
- 20 GitHub stars from relevant developers.
- 5 independent demo reproductions.
- 3 useful issues or feature requests.
- 1 external repository runs the GitHub Action without maintainer help.

## Scope boundaries

Do not use this launch loop to start hosted dashboards, billing, accounts, a GitHub App, SSO, enterprise governance, or a broad observability platform. Those remain post-MVP until users repeatedly ask for retained history, team workflows, or richer PR checks.
