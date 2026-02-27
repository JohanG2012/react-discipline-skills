# Skill Interactions and Invocation

## Summary

Defines required interaction boundaries with upstream/downstream skills.

---

## Rule: Interaction Boundaries
**Rule ID:** rrp-interactions  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents overlap and contradiction across the fixed skill model.
**Covers:** Interaction Boundaries.
**Index mode:** reference

### Requirement

- The skill must not recompute architecture gravity.
- The skill must respect placement decisions, including canonical endpoint-layer
  ownership.
- The skill must not override reuse/update/new decisions from
  `react-reuse-update-new`.
- The skill must remain plan-only and not emit implementation patches.
- Default invocation path:
  - consulted by `react-implementation-discipline` at end of micro/standard
    execution
  - opportunistic mode is used for this default consult
- Dedicated mode is used only when refactor work is explicitly requested.

### Forbidden

- Overriding authoritative placement or reuse decisions inside refactor output.
- Running as an implementation executor.
- Promoting optional extension behavior into mandatory production flow without
  governance change.

### Notes

- This skill augments implementation quality but does not replace any production
  execution skill.
