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
**Covers:** Anti-Pattern Findings.
**Index mode:** reference

### Requirement

- Detect and classify high-value anti-patterns, including:
  - implicit visibility ownership in shared presentational components
  - fetch/transport usage outside canonical endpoint ownership
  - domain leakage into shared UI abstractions
  - unjustified server-state mirroring in global store
  - prop-drilling debt across pass-through component chains
  - umbrella-feature drift (single feature acting like a mini `features` root)
  - feature-local presentation/transport shadow homes (for example
    `features/*/views/**`, `*View` naming, `features/*/api/**`)
- Anti-pattern tier defaults:
  - implicit visibility in shared presentational UI -> Tier A
  - fetch outside canonical endpoint layer -> Tier B (Tier C when widespread)
  - domain leakage into shared UI -> Tier B
  - server-state mirrored to global store without justification -> Tier B
    (Tier C when systemic)
  - prop-drilling debt -> Tier B (Tier C when subtree breadth/churn is high)
  - umbrella-feature drift -> Tier B (Tier C when widespread and high-churn)
  - feature-local shadow homes for views/api -> Tier B
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
  - prop-drilling debt:
    - same prop/group forwarded through 3+ layers without intermediate use,
    - pass-through forwarding volume >=5 props in a layer,
    - repeated sibling-branch threading of same prop set,
    - drilled domain data/actions leaking into shared `ui/**`
  - umbrella-feature drift:
    - one feature contains multiple domain sub-areas plus parallel layer-style
      internal taxonomies (`components/`, `hooks/`, `utils/`, `rules/`, etc.),
    - recurring shared glue inside one feature indicates multiple hidden domain
      owners
  - feature-local shadow homes:
    - feature paths matching `features/*/views/**` or `features/**/*View.*`,
    - feature paths matching `features/*/api/**` while canonical API home
      exists
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
- If model-only confidence is low, follow `rrp-detection-assist-scripts` for
  script-assisted candidate discovery and fallback behavior.

### Forbidden

- Emitting anti-pattern findings without traceable affected files.
- Promoting out-of-mode findings to blocking active-step status.
- Producing recommendations that are purely aesthetic or preference-driven.
- Treating script output as authoritative evidence without direct rule-based
  review.

### Notes

- Detection should prioritize standards alignment over style-only concerns.
