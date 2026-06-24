# Result JSON spec

Default output:

```text
verdictci-result.json
```

## Goals

The result JSON must be:

- stable;
- machine-readable;
- versioned;
- useful to humans and agents;
- safe to archive as CI artifact.

## Minimal shape

```json
{
  "schemaVersion": 1,
  "tool": {
    "name": "VerdictCI",
    "version": "0.1.0"
  },
  "run": {
    "id": "local-2026-06-22T15-00-00Z",
    "startedAt": "2026-06-22T15:00:00Z",
    "durationMs": 1234,
    "configPath": "verdictci.yaml",
    "mode": "fixture"
  },
  "summary": {
    "verdict": "failed",
    "suites": 1,
    "cases": 10,
    "passed": 8,
    "failed": 2,
    "skipped": 0,
    "errored": 0
  },
  "suites": [
    {
      "id": "support-bot",
      "verdict": "failed",
      "passed": 8,
      "failed": 2,
      "errored": 0,
      "thresholdFailures": [
        {
          "metric": "passRate",
          "expected": 0.9,
          "actual": 0.8
        }
      ],
      "cases": [
        {
          "id": "refund-policy",
          "status": "failed",
          "score": 0.4,
          "reason": "Answer omitted required refund window."
        }
      ]
    }
  ]
}
```

## Verdict values

Allowed:

- `passed`
- `failed`
- `errored`

## Case statuses

Allowed:

- `passed`
- `failed`
- `skipped`
- `errored`

## Privacy

Result JSON may include raw model output only when configured.

Future field:

```json
"privacy": {
  "rawOutputsIncluded": false,
  "redaction": "summary-only"
}
```

## Schema evolution

Rules:

- add fields without breaking readers;
- never remove fields in the same major schema version;
- bump `schemaVersion` for breaking changes;
- document migrations.
