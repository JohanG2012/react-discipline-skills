# Access Control and Fallback Context

## Summary
Defines repository evidence requirements and dependency-error behavior when
direct read/search access is unavailable.

---

## Rule: Repository Evidence Access
**Rule ID:** rad-access-control  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Reliable detection requires direct repository signals or explicit
fallback context.
**Covers:** Repository Evidence Access.
**Index mode:** reference

### Requirement

- Detection should run with repository read/search access.
- Minimum capabilities expected:
  - list repository/src tree
  - search routing/UI/API/domain/state patterns
  - read source and config files on demand
- If direct access is unavailable, require fallback context bundle containing:
  - top-level and `src/` tree (depth about 3-4)
  - `package.json`
  - router entry/setup files
  - current API home/client location
  - representative primitive/composite/section/hook/endpoint examples
- If repository evidence is missing/incomplete, return `dependency_error` with
  actionable `fallback_context_bundle_requirements`.
- Keep default write posture controlled; this skill does not apply code edits.

### Forbidden

- Finalizing structural detection without repository evidence or fallback
  context.
- Guessing gravity homes when evidence is absent.
- Treating direct source edits as part of detection output behavior.

### Notes

- When access is constrained, keep uncertainty explicit in output notes.
