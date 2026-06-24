# Acceptance criteria

## Documentation pack acceptance

The starter pack is acceptable when:

- root `README.md` explains the product and start path;
- root `AGENTS.md` gives actionable Codex instructions;
- product docs cover founder, repo, monetization, distribution, and sources;
- scope docs define MVP, non-goals, and validation plan;
- architecture docs define CLI, GitHub Action, privacy, and data flow;
- implementation docs define roadmap, repo map, decisions, and kickoff steps;
- specs define CLI, config YAML, result JSON, GitHub Action, exit codes, and PR summary;
- agentic docs define Codex workflow, task template, review template, and evidence policy;
- templates cover support bot, RAG citations, tool agent, and classifier;
- QA docs define manual checks and evidence rules.

## MVP implementation acceptance

The implemented MVP is acceptable when:

- `verdictci --help` works;
- `verdictci validate --config examples/support-bot/verdictci.yaml` works;
- passing fixture suite exits `0`;
- failing fixture suite exits `1`;
- invalid config exits `2`;
- provider/runtime error exits `3`;
- unexpected internal error maps to `4`;
- result JSON matches `docs/specs/result-json.md`;
- GitHub Action example runs and writes summary;
- no data uploads occur by default.

## Business validation acceptance

The product is validated enough to build hosted features when:

- 10 real repos have run the CLI;
- 5 design partners have tried it;
- 3 teams use it on more than one PR;
- 1 real regression was caught or clarified;
- at least 2 users ask for hosted history or better team workflow.
