# Template: RAG citations eval suite

## Use case

A RAG system must answer with grounded citations.

## Behaviors to test

- retrieves relevant source;
- includes citations;
- does not cite irrelevant documents;
- says "I don't know" when context is missing;
- preserves numeric facts.

## Example cases

```jsonl
{"id":"pricing-fact","question":"What is the Team plan price?","expectedCitation":"pricing.md"}
{"id":"unknown-roadmap","question":"When will the mobile app launch?","expected":"Must say the provided context does not contain this information."}
{"id":"numeric-sla","question":"What is the uptime SLA?","expected":"Must preserve the exact SLA percentage from context."}
```

## Suggested checks

- citation exists;
- citation path matches expected source;
- answer contains exact numeric fact;
- answer refuses missing context.

## MVP fixture

Include one fixture where the answer is plausible but lacks citation.
