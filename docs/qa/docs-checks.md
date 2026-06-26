# Documentation checks

The starter pack includes `.github/workflows/docs-checks.yml` as a placeholder for the future repo.

Minimum checks:

- required files exist;
- required sections exist;
- public release files exist;
- no unresolved placeholder tokens;
- product name is consistent;
- MVP docs do not describe post-MVP features as required.

Suggested script behavior:

```text
docs:check
  - verify file list
  - grep required headings
  - grep public release checklist terms
  - grep package smoke terms
  - grep forbidden placeholders
  - grep forbidden MVP scope creep phrases
```

Public release files:

- `LICENSE`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/pull_request_template.md`
- `docs/release/public-oss-release.md`

Forbidden MVP dependency phrase patterns:

- `requires GitHub` + `App`
- `requires hosted` + `dashboard`
- `requires` + `billing`
- `requires` + `SSO`

These phrases can appear in post-MVP sections, but not as MVP requirements.
