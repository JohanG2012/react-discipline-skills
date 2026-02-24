# Constraint and Scope Governor Alignment

## Summary
Defines required scope and constraint handling for placement planning.

---

## Rule: Constraint-Aware Placement Scope
**Rule ID:** rpl-scope-governor  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Keeps plans reviewable and prevents implicit scope expansion.

### Requirement

- Respect explicit task constraints when provided, including:
  - `avoid_new_folders`
  - `max_files_touched`
  - move/rename enablement and limits
- If explicit constraints are absent, apply shared-policy hard defaults:
  - max files touched: `8`
  - max new files: `4`
  - max moved/renamed files: `0` unless migration mode is explicit
  - max new dependencies: `0` unless explicitly requested
  - max new top-level folders: `0` unless explicitly requested
- If scope pressure exceeds caps, produce the smallest in-cap plan and record
  concise follow-up scope in `notes`.
- If extra out-of-cap scope would materially improve completeness, include a
  structured `scope_expansion_needed` array with items:
  - `why` (short reason)
  - `would_touch` (number of additional files)
- When `scope_expansion_needed` is included, still return the in-cap placement
  plan in the same output.
- If `avoid_new_folders=true`, do not propose new folder homes unless explicit
  override is provided.
- If constraints block all safe placement outcomes, return
  `result_type=validation_error` with blocking errors.

### Forbidden

- Silently exceeding explicit or default scope caps.
- Proposing new dependencies as part of normal placement planning.
- Enabling moves/renames in feature-task mode without explicit migration scope.

### Notes

- Keep scope expansion explicit and bounded; do not hide it in placement output.
