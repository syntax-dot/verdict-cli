# Security Policy

VerdictCI runs evals locally or inside the user's GitHub Actions environment by default. The MVP does not upload prompts, eval cases, model outputs, traces, provider keys, or result artifacts to a hosted VerdictCI service.

## Supported versions

During the MVP, security fixes target the `main` branch and the latest published release candidate.

## Reporting a vulnerability

Use GitHub private vulnerability reporting when it is enabled on the public repository. If private reporting is not available, open a minimal public issue asking for a security contact and avoid posting exploit details, secrets, prompts, raw outputs, or customer data.

Please include:

- affected command, Action input, or package;
- exact version or commit;
- impact and reproduction steps;
- whether secrets, prompts, outputs, or artifacts can be exposed;
- any safe mitigation you have already tested.

## Security expectations

VerdictCI contributors should:

- never log raw secrets;
- avoid printing raw prompts, model outputs, or traces by default;
- keep provider keys in local environment variables or GitHub Secrets;
- preserve deterministic exit codes for security-relevant failures;
- document any future hosted data retention, deletion, access control, and encryption behavior before enabling it.
