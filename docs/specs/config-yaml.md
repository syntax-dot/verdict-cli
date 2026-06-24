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
| `adapter` | yes | `fixture`, `promptfoo`, or future adapter id. |
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

## Path behavior

Relative paths resolve from the config file directory, not process cwd.

## Validation errors

Validation errors must name:

- config path;
- field path;
- expected type or allowed values;
- suggested fix.
