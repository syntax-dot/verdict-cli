# Evidence policy

VerdictCI development should be evidence-led.

## Evidence types

Valid evidence:

- test output;
- CLI transcript;
- generated result JSON;
- GitHub Action log;
- Markdown job summary;
- schema validation output;
- screenshot only when reviewing a UI;
- reviewer findings.

Invalid evidence:

- "looks good";
- "should work";
- dry-run that does not execute the behavior;
- tests that only assert mocks were called;
- count-only checks for behavior that needs semantic validation.

## Evidence paths

Use:

```text
.omo/evidence/YYYY-MM-DD-<task-slug>.md
.omo/evidence/YYYY-MM-DD-<task-slug>.txt
.omo/evidence/YYYY-MM-DD-<task-slug>.json
```

For generated result artifacts:

```text
.tmp/verdictci-result.json
```

Do not commit `.tmp/` unless a fixture is intentionally promoted to `examples/`.

## Completion receipt

Every task summary should include:

- tests run;
- manual QA command;
- evidence path;
- cleanup receipt;
- docs updated or not applicable.

## Cleanup

If QA starts a server, creates a temp directory, or writes large artifacts, clean it up or document why it remains.

For normal CLI docs checks, no runtime cleanup is needed.
