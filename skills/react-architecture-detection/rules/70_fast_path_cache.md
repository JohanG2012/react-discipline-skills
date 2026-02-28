# Fast-path Cache Reuse

## Summary
Defines safe reuse of cached detection context for refactor-session fast-path
detection.

---

## Rule: Fast-path Detection Reuse
**Rule ID:** rad-fast-path-cache  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Speeds repeat detection runs without weakening confidence,
consistency, or schema correctness.
**Covers:** Fast-path Detection Reuse.
**Index mode:** reference

### Requirement

- Fast-path detection is allowed only when all are true:
  - task is part of the same repository context
  - existing code is being touched in a refactor/continuation flow
  - a trusted prior `detection_result` exists in memory cache
- Fast-path must refresh at minimum from current evidence:
  - `ui.home`
  - `api.home`
  - `domain.home`
  - `state.home`
  - `i18n.home`
  - `gravity_map`
- Carry forward unchanged fields only when refreshed evidence does not conflict.
- Recompute strategy/pause evaluation when refreshed evidence changes structural
  confidence or concern homes.
- Fall back to full scan when:
  - cache is missing
  - cache is stale or repository context changed
  - refreshed evidence lowers confidence on structural concerns
- Output must remain full schema-valid `detection_result` payload (not partial
  delta output).

### Forbidden

- Using cached output across different repositories or unrelated tasks.
- Returning partial payloads in fast-path mode.
- Reusing stale cache without current evidence refresh.

### Notes

- Fast path is a performance optimization, not a relaxation of detection rigor.
