# Anti-Pattern Detection

## Summary

Defines anti-pattern detection requirements and output mapping.

---

## Rule: Anti-Pattern Findings
**Rule ID:** rrp-detection  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Turns known architecture drift signals into actionable planning
metadata.

### Requirement

- Detect and classify high-value anti-patterns, including:
  - implicit visibility ownership in shared presentational components
  - fetch/transport usage outside canonical endpoint ownership
  - domain leakage into shared UI abstractions
  - unjustified server-state mirroring in global store
- Anti-pattern tier defaults:
  - implicit visibility in shared presentational UI -> Tier A
  - fetch outside canonical endpoint layer -> Tier B (Tier C when widespread)
  - domain leakage into shared UI -> Tier B
  - server-state mirrored to global store without justification -> Tier B
    (Tier C when systemic)
- Detection heuristics must include:
  - implicit visibility:
    - component in `ui/primitives/**` or `ui/composites/**`
    - conditionally returns `null` based on external props
    - component is not an explicit boundary/guard wrapper
  - fetch outside endpoint layer:
    - transport logic exists outside canonical endpoint ownership
  - domain leakage:
    - domain-specific naming/types/flags in shared UI
  - server-state mirror:
    - cache-backed server data redundantly stored in global store with no
      explicit performance/offline rationale
- Emit findings with:
  - stable `finding_id`
  - `type`
  - assigned `tier`
  - `affected_files[]`
  - `recommended_step_id`
- Ensure out-of-mode findings are surfaced as non-blocking follow-up guidance.
- Detection focus should align with standards enforced by:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`

### Forbidden

- Emitting anti-pattern findings without traceable affected files.
- Promoting out-of-mode findings to blocking active-step status.
- Producing recommendations that are purely aesthetic or preference-driven.

### Notes

- Detection should prioritize standards alignment over style-only concerns.
