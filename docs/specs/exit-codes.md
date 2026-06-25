# Exit codes

VerdictCI exit codes are part of the public contract.

| Code | Meaning | CI result |
| ---: | --- | --- |
| 0 | Required eval checks passed. | success |
| 1 | Required eval checks ran but failed thresholds. | failure |
| 2 | Usage or configuration error. | failure |
| 3 | Provider, adapter, or runtime execution error. | failure |
| 4 | Unexpected internal error. | failure |

## Rules

- A behavioral regression is exit `1`, not `3`.
- Missing config is exit `2`.
- Invalid YAML is exit `2`.
- Promptfoo assertion failures are eval failures and can exit `1`.
- Promptfoo command, provider, runtime, or output parsing failures exit `3`.
- Provider timeout is exit `3`.
- Uncaught exception is exit `4`.

## Why this matters

CI users need to distinguish:

- "the AI behavior failed";
- "the tool was configured wrong";
- "the provider failed";
- "VerdictCI has a bug".

Do not collapse all failures into exit `1`.
