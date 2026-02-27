# Access Control and Fallback Context

## Summary
Defines repository access requirements for reuse planning and the mandatory
fallback context bundle when direct repository access is unavailable.

---

## Rule: Read/Search Access and Fallback Bundle
**Rule ID:** rru-access-control  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Reuse decisions require repository evidence; fallback inputs must
be explicit when direct access is unavailable.
**Covers:** Read/Search Access and Fallback Bundle.
**Index mode:** reference

### Requirement

- Reuse planning should run with repository read/search access.
- Minimum read/search capabilities expected for decision-quality execution:
  - list `src/` tree shape
  - search code patterns (for example API/query/router identifiers)
  - read file contents on demand
  - read key tooling/config files relevant to architecture signals
- If direct repository access is unavailable, emit `dependency_error` and
  include a fallback context bundle requirement checklist covering:
  - file tree (top-level + `src/` depth ~3-4)
  - `package.json`
  - router entry/config files
  - API client location currently in use
  - representative examples (primitive, composite, section, hook, endpoint)
- Default write mode for this skill remains controlled planning output; direct
  code edits are out of scope for this skill unless explicitly enabled by
  upstream workflow.

### Forbidden

- Producing structural reuse decisions without repository evidence or fallback
  context inputs.
- Assuming architecture signals when both direct access and fallback context are
  missing.
- Treating direct implementation edits as part of this skill's normal output.

### Notes

- This skill is decision-planning only; implementation belongs to downstream
  execution skills.
