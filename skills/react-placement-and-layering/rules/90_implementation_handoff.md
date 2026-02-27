# Implementation Handoff Formatting

## Summary
Defines downstream implementation-output formatting defaults referenced by this
planning skill.

---

## Rule: Implementation Output Format Defaults
**Rule ID:** rpl-implementation-handoff  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Keeps handoff output reviewable and consistent across placement
and implementation stages.
**Covers:** Implementation Output Format Defaults.
**Index mode:** reference

### Requirement

- This skill remains planning-first and JSON-contract driven.
- When a downstream implementation handoff is requested, use these formatting
  defaults:
  - updated files: provide changed snippets by default
  - switch to unified diff when:
    - edits span non-adjacent regions in one file
    - changes touch imports, exports, and logic together
    - snippet-only output is likely to be misapplied
  - new files: provide full file content
  - existing files: avoid full-file dumps unless explicitly requested, or the
    file is small (about under 60 lines) and entirely changed
  - if a newly proposed file would exceed about 250 lines, split
    responsibilities instead of producing one oversized file
- Keep implementation-handoff guidance scoped to the approved placement plan and
  scope-governor limits.

### Forbidden

- Returning implementation output in free-form or low-context formats that
  increase patch-application risk.
- Combining structural migration and feature behavior changes in one handoff
  unless migration scope is explicitly requested.
- Expanding handoff scope beyond the selected placement plan without explicit
  structured scope expansion.

### Notes

- These defaults govern implementation handoff shape; they do not replace the
  mandatory placement JSON contract.
