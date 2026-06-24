# Codex task template

Copy this into a Codex prompt when starting an implementation task.

```text
Read AGENTS.md first.

Task title:
<short task title>

Context:
<why this task matters>

Files to read:
- <spec file>
- <architecture file>
- <related docs>

Scope:
- <allowed directories/files>

Non-goals:
- <explicitly out of scope>

Behavior required:
- <observable behavior 1>
- <observable behavior 2>

Tests required:
- <test 1>
- <test 2>

Manual QA:
Command:
<exact command>

Expected observable:
<exit code, generated file, output text, or other binary pass/fail>

Evidence path:
<path under .omo/evidence/>

Constraints:
- Keep changes small.
- Do not add unrelated dependencies.
- Update docs if behavior changes.
- Do not broaden the milestone.

Before editing:
Return a short plan and list the tests you will write first.

After editing:
Run verification and summarize evidence.
```
