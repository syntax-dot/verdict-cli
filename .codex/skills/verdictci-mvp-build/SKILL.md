---
name: verdictci-mvp-build
description: Build or modify VerdictCI MVP implementation work. Use when Codex needs to implement CLI runner behavior, config parsing, eval execution, result aggregation, exit codes, sample fixtures, package scripts, or roadmap milestones while preserving the CLI-first and GitHub Action-first MVP scope.
---

# VerdictCI MVP Build

Use this skill for production implementation tasks in VerdictCI. The goal is to ship the smallest reliable Eval-as-CI tool before adding hosted product surface area.

## Required Reading

Read these files before editing code:

1. `AGENTS.md`
2. `docs/scope/mvp.md`
3. `docs/implementation/roadmap.md`
4. The relevant spec under `docs/specs/`
5. `docs/qa/acceptance-criteria.md`

If the task touches architecture, also read `docs/architecture/overview.md` and `docs/implementation/decisions.md`.

## Workflow

1. Identify the milestone and public behavior being changed.
2. Name the non-goals before implementation.
3. Add or update the smallest behavior test first.
4. Implement the smallest module boundary that satisfies the spec.
5. Run targeted tests, typecheck, and the matching manual QA command.
6. Update affected specs and docs in the same change.
7. Capture evidence under `.omo/evidence/` or the task-specific evidence path.

## MVP Boundaries

Do not add these unless the current task explicitly targets a post-MVP milestone:

- hosted dashboard;
- billing;
- accounts;
- SSO;
- GitHub App;
- long-term cloud storage;
- prompt CMS;
- general agent framework;
- broad observability platform.

## Implementation Standards

- Keep CLI output deterministic and scriptable.
- Keep result JSON versioned and machine-readable.
- Keep provider logic behind interfaces.
- Prefer simple modules over shared abstractions until duplication is real.
- Never log raw API keys, prompts, traces, or eval outputs unless explicitly configured.
- Public failures must include remediation hints.

## Completion Gate

Do not call the task complete until:

- behavior tests pass;
- lint and typecheck pass when scripts exist;
- the real CLI or fixture path has been run;
- docs match the implemented behavior;
- evidence includes commands, outputs, and the produced artifact path.
