# Scope Governor

## Summary

Defines mode-specific scope limits and expansion handling.

---

## Rule: Bounded Scope Execution
**Rule ID:** rrp-scope-governor  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents uncontrolled refactor spread and hidden churn.

### Requirement

- Apply default scope caps unless explicitly overridden:
  - `max_files_touched=8`
  - `max_new_files=4`
  - `max_moved_or_renamed=0`
  - `max_new_dependencies=0`
  - `max_new_top_level_folders=0`
- Opportunistic mode must remain bounded to already touched implementation
  files, except mandatory folderization in the same concern home.
- Opportunistic mode may not expand the touched-file set for production code.
- Opportunistic mode must not include moves/renames, routing changes, or new
  dependencies.
- Opportunistic mode may include directly related test-file updates without
  counting them toward touched-file budget only when all hold:
  - no new dependencies are introduced
  - tests validate behavior directly related to touched code
  - no more than 2 test files are updated by default (or explicitly expanded
    via `scope_expansion_needed[]`)
- Dedicated mode move/rename actions are capped at 3 unless migration mode is
  explicitly enabled.
- Dedicated mode may include broader changes only within explicit cap policy and
  migration constraints.
- Folderization policy:
  - mandatory when touched component size exceeds approximately 400 lines
  - allowed around 250-300 lines only when the split clearly reduces
    responsibilities
  - "clearly reduces responsibilities" means at least one is true:
    - file has 2+ distinct responsibilities
    - file contains 3+ meaningful internal subcomponents that can separate
      cleanly
    - file has non-trivial component-scoped helper pile suitable for
      local `*.utils`/`*.types` extraction
    - split reduces the main file toward a single responsibility and materially
      improves readability
- When materially better completeness exceeds caps, emit bounded
  `scope_expansion_needed[]` with `why` and `would_touch` while still returning
  an in-cap plan.

### Forbidden

- Silent scope expansion beyond active caps.
- Introducing unrelated refactor work outside requested scope.

### Notes

- Scope cap enforcement is mandatory even when step quality appears high.
