# Access and Write Control

## Summary

Defines repository-access requirements and fail-closed behavior when context is
missing.

---

## Rule: Context Access and Write Discipline
**Rule ID:** rid-access-control  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Prevent unsafe assumptions and maintain controlled change output.

### Requirement

- Require repository read/search capability for convention and boundary checks.
- Minimum context capabilities:
  - list relevant tree
  - search patterns
  - read target files and config files
- If direct repository context is unavailable, return `dependency_error` with
  actionable `fallback_context_bundle_requirements`, including at least:
  - feature-relevant file tree
  - `package.json`
  - router/entry files when applicable
  - canonical API home information
  - sample primitive/composite/section/hook/endpoint modules
- Default write control behavior:
  - produce reviewable patch/new-file output
  - avoid direct structural writes outside approved plan
  - never auto-edit architecture docs or specification docs (`specs/**`, including `specs/**/master_spec.md`) unless requested

### Forbidden

- Producing accepted implementation output without required context evidence.
- Silent direct-write behavior that bypasses planned review controls.

### Notes

- Fail closed on missing context; do not guess structural conventions.
