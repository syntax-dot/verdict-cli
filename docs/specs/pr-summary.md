# PR summary spec

The PR or GitHub Action summary is the main user-facing surface in the MVP.

## Goals

The summary should answer:

1. Can this PR merge?
2. What changed?
3. Which evals failed?
4. What should the developer inspect next?

## Minimal Markdown

```markdown
# VerdictCI: failed

2 suites, 24 cases: 21 passed, 3 failed, 0 errored.

| Suite | Verdict | Passed | Failed | Notes |
| --- | --- | ---: | ---: | --- |
| support-bot | failed | 8 | 2 | passRate 0.80 < 0.90 |
| rag-citations | passed | 13 | 0 | |

## Failed cases

| Case | Suite | Reason |
| --- | --- | --- |
| refund-policy | support-bot | Answer omitted required refund window. |

Result artifact: `verdictci-result.json`
```

## Tone

Use plain, direct language.

Avoid:

- hype;
- vague "AI quality improved" claims;
- long model outputs in the summary;
- blaming the developer.

## Length

Default summary should stay under 120 lines.

Large details belong in the result artifact.
