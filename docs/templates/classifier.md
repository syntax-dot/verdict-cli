# Template: classifier eval suite

## Use case

A classifier assigns labels to support tickets, moderation events, or routing tasks.

## Behaviors to test

- correct label;
- confidence threshold;
- abstain/unknown behavior;
- stable output format.

## Example cases

```jsonl
{"id":"billing-refund","input":"I want my money back","expectedLabel":"billing_refund"}
{"id":"technical-login","input":"I cannot sign in after resetting password","expectedLabel":"technical_login"}
{"id":"ambiguous","input":"This is not working","expectedLabel":"unknown"}
```

## Suggested checks

- exact label match;
- JSON schema validation;
- confidence minimum;
- unknown label for ambiguous cases.

## MVP fixture

Include one fixture where the classifier returns the wrong label with high confidence.
