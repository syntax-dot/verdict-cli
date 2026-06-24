# Config YAML spec

Default filename:

```text
verdictci.yaml
```

Alternative accepted filename:

```text
evals.yaml
```

## Minimal example

```yaml
version: 1
name: support-bot-evals

defaults:
  required: true
  threshold:
    passRate: 0.9

suites:
  - id: support-bot
    description: Support bot regression suite
    adapter: fixture
    cases: examples/support-bot/cases.jsonl
    thresholds:
      passRate: 0.9
      maxFailures: 1
```

## Fields

### `version`

Required integer.

Current: `1`.

### `name`

Required string.

Human-readable run name.

### `defaults`

Optional shared defaults.

### `suites`

Required non-empty array.

Each suite:

| Field | Required | Description |
| --- | --- | --- |
| `id` | yes | Stable machine id. |
| `description` | no | Human-readable purpose. |
| `adapter` | yes | `fixture` for Milestone 2 execution. `promptfoo` is reserved for a later adapter milestone. |
| `cases` | yes | Path to test cases. |
| `thresholds` | no | Suite-specific pass/fail thresholds. |
| `required` | no | Whether failure should fail final verdict. Defaults true. |

## Thresholds

Supported MVP thresholds:

```yaml
thresholds:
  passRate: 0.9
  maxFailures: 0
  maxErrors: 0
```

Suite-specific thresholds override `defaults.threshold` values. If no `required` value is set on a suite, it inherits `defaults.required`; if neither value exists, the suite is required.

Pass rate is calculated as:

```text
passed / (passed + failed + errored)
```

Skipped cases do not affect the pass-rate denominator.

## Fixture cases

Milestone 2 supports JSONL fixture case files for deterministic local and CI demos. Each non-empty line must be a JSON object:

```json
{
  "id": "refund-window",
  "input": "Can I get a refund after 45 days?",
  "expected": "Must state that refunds are available only within the configured refund window.",
  "fixture": {
    "status": "failed",
    "score": 0.2,
    "reason": "Answer omitted required refund window."
  }
}
```

Required fixture fields:

| Field | Required | Description |
| --- | --- | --- |
| `id` | yes | Stable case id. |
| `input` | yes | Example user input. Not copied into Milestone 2 result JSON. |
| `expected` | yes | Expected behavior. Not copied into Milestone 2 result JSON. |
| `fixture.status` | yes | `passed`, `failed`, `skipped`, or `errored`. |
| `fixture.score` | no | Numeric score from `0` to `1`. |
| `fixture.reason` | no | Short reason safe to show in CI output and result JSON. |

## Path behavior

Relative paths resolve from the config file directory, not process cwd.

## Validation errors

Validation errors must name:

- config path;
- field path;
- expected type or allowed values;
- suggested fix.
