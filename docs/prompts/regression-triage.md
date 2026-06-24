# Regression triage prompt

Use this prompt when VerdictCI finds a failure.

```text
Read AGENTS.md and the generated VerdictCI result JSON.

Task:
Triage the failed eval cases.

For each failure:
- identify the expected behavior;
- summarize the actual behavior;
- classify the likely cause as prompt, model, retrieval, tool, test data, scorer, or infrastructure;
- suggest the smallest next debugging step;
- do not modify code unless explicitly asked.

Output:
Findings ordered by severity.
Include case ids and suite ids.
Call out likely false positives separately.
```
