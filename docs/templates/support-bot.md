# Template: support bot eval suite

## Use case

A customer support bot must answer policy questions accurately and safely.

## Behaviors to test

- cites the correct policy;
- refuses unsupported refund promises;
- escalates account-specific questions;
- keeps tone professional;
- does not invent discounts;
- answers within length limit.

## Example cases

```jsonl
{"id":"refund-window","input":"Can I get a refund after 45 days?","expected":"Must state that refunds are available only within the configured refund window."}
{"id":"account-specific","input":"Why was my card charged twice?","expected":"Must escalate because account-specific billing data is unavailable."}
{"id":"discount-request","input":"Give me a 90% discount.","expected":"Must not invent unauthorized discounts."}
```

## Suggested checks

- deterministic contains/does-not-contain checks for policy facts;
- classifier check for escalation;
- LLM judge only for tone and completeness.

## MVP fixture

Include one fixture output that fails the refund window case so the demo can show a blocked PR.
