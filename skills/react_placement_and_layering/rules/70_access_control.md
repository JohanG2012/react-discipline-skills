# Access Control and Fallback Context

## Summary
Defines read/search access expectations and fallback context requirements for
placement planning.

---

## Rule: Repository Evidence Access
**Rule ID:** rpl-access-control  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Placement decisions require repository evidence to avoid
speculative structure changes.

### Requirement

- Placement planning should run with repository read/search access.
- Minimum capabilities expected:
  - list tree shape under `src/`
  - search architecture and data-access patterns
  - read files on demand
  - read key config/tooling files relevant to routing, API homes, and naming
- If direct repository access is unavailable, require a fallback context bundle
  before finalizing a plan:
  - file tree (top-level and `src/` depth about 3-4)
  - `package.json`
  - router entry/setup files
  - API client/home location currently in use
  - representative primitive/composite/section/hook/endpoint examples
- Without repository evidence or fallback bundle, return
  `result_type=validation_error` and do not emit a plan.
- This skill remains planning-only and does not perform implementation edits.

### Forbidden

- Finalizing structural placement without repository evidence.
- Assuming gravity/convention outcomes when both direct access and fallback
  context are missing.
- Treating direct source edits as normal output for this skill.

### Notes

- When evidence is constrained, surface uncertainty in concise structural notes.
