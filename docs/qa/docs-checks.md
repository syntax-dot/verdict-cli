# Documentation checks

The starter pack includes `.github/workflows/docs-checks.yml` as a placeholder for the future repo.

Minimum checks:

- required files exist;
- required sections exist;
- no unresolved placeholder tokens;
- product name is consistent;
- MVP docs do not describe post-MVP features as required.

Suggested script behavior:

```text
docs:check
  - verify file list
  - grep required headings
  - grep forbidden placeholders
  - grep forbidden MVP scope creep phrases
```

Forbidden MVP dependency phrase patterns:

- `requires GitHub` + `App`
- `requires hosted` + `dashboard`
- `requires` + `billing`
- `requires` + `SSO`

These phrases can appear in post-MVP sections, but not as MVP requirements.
