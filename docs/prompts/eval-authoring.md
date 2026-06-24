# Eval authoring prompt

Use this prompt with Codex when creating a new eval suite.

```text
Read AGENTS.md, docs/specs/config-yaml.md, docs/specs/result-json.md, and the target app code.

Goal:
Create a VerdictCI eval suite for <feature>.

The suite should test:
- <behavior 1>
- <behavior 2>
- <edge case>
- <regression risk>

Constraints:
- Keep test cases small and reviewable.
- Prefer deterministic assertions where possible.
- Use LLM-as-judge only when deterministic checks cannot capture the behavior.
- Do not include real user PII.
- Include at least one intentionally failing fixture for QA.

Deliverables:
- verdictci.yaml update or new suite config
- test case file
- README explaining the suite
- expected local run command

Manual QA:
Run the suite in fixture mode and capture result JSON.
```
