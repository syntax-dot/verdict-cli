# Review template

Use this prompt for a separate Codex review run after an implementation task.

```text
You are reviewing a VerdictCI implementation diff.

Read:
- AGENTS.md
- docs/scope/mvp.md
- docs/scope/non-goals.md
- docs/specs/cli.md
- docs/specs/config-yaml.md
- docs/specs/result-json.md
- docs/specs/exit-codes.md
- docs/qa/acceptance-criteria.md

Review stance:
Prioritize bugs, scope creep, missing tests, broken CLI contracts, unstable schemas, privacy leaks, and misleading docs.

Check:
- Does the implementation satisfy the named task?
- Are tests meaningful or tautological?
- Are exit codes correct?
- Is result JSON stable and versioned?
- Are errors actionable?
- Does the change upload data unexpectedly?
- Did docs change when behavior changed?
- Did the implementation add post-MVP features?
- Does the manual QA evidence prove the user-visible behavior?

Output:
Findings first, ordered by severity.
Use file/line references.
If there are no findings, say "No blocking findings" and list residual risks.
```

## Review result format

```markdown
# Review: <task>

## Findings

- [P1] <issue> - <file:line> - <why it matters> - <required fix>

## Residual risks

- <risk>

## Verification checked

- <command/evidence>
```
