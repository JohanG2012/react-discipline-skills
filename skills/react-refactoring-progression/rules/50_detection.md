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
  - feature-too-big governance triggers fired (`size_review_required=true`)
  - capability-folder recommendation triggers (`3+` distinct capability
    clusters in one feature owner)
  - run-once effect guard hacks instead of dependency modeling
  - async duplicate-prevention that relies on state only
  - async race/out-of-order response protection gaps
  - async handler discipline violations in JSX/error handling
  - observer/listener registration churn
  - unstable list key usage for dynamic lists
  - pagination cursor coupling to business fields
  - component responsibility overload (god-component pattern)
  - error gating that blocks unrelated flows
- Anti-pattern tier defaults:
  - implicit visibility in shared presentational UI -> Tier A
  - fetch outside canonical endpoint layer -> Tier B (Tier C when widespread)
  - domain leakage into shared UI -> Tier B
  - server-state mirrored to global store without justification -> Tier B
    (Tier C when systemic)
  - prop-drilling debt -> Tier B (Tier C when subtree breadth/churn is high)
  - umbrella-feature drift -> Tier B (Tier C when widespread and high-churn)
  - feature-local shadow homes for views/api -> Tier B
  - feature-too-big triggers fired -> Tier B follow-up
    (Tier C follow-up when placement correction is required)
  - capability-folder recommendation (3+ clusters) -> Tier C follow-up
  - run-once effect hacks -> Tier B
  - async state-only gating -> Tier B
  - async race protection gaps -> Tier C when data-correctness risk is active
    (Tier B otherwise)
  - async handler discipline violations -> Tier B
  - observer/listener churn -> Tier B
  - unstable list keys -> Tier B (Tier C when reorder/insert bugs are active)
  - pagination cursor coupling -> Tier C
  - component responsibility overload -> Tier B (Tier C when placement split is
    required)
  - error gating isolation breaches -> Tier B
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
  - feature-too-big triggers fired:
    - hard trigger(s) from `sr-feature-too-big-triggers` are present, or
    - 2+ soft trigger signals from `sr-feature-too-big-triggers` are present
      and structural risk is clear
  - capability-folder recommendation:
    - `3+` distinct capability clusters detected under one
      `features/<domain>/` owner per `sr-feature-capability-clusters`,
    - extraction remains review/planning guidance (no auto-migration)
  - run-once effect hacks:
    - effect uses run-suppression guards (`didRun`, `hasInitialized`,
      `isFirst`, `mountedRef`, `ranOnceRef`) to avoid re-runs,
    - effect omits real dependencies and uses guard logic with empty deps
  - async state-only gating:
    - duplicate async prevention relies only on local state flags
      (`loading`/`isFetching`/`isSubmitting`) in rapid multi-trigger paths
  - async race protection gaps:
    - overlapping async calls can update same target without abort/latest
      acceptance rules,
    - paginated/state merges apply responses without continuity/currentness
      checks
  - async handler discipline:
    - multi-step async logic embedded inline in JSX handlers,
    - repeated actions have divergent error normalization/surfacing
  - observer/listener churn:
    - effect dependencies cause frequent observer/listener teardown/recreate
      cycles unrelated to stable target changes
  - unstable list keys:
    - dynamic lists use index keys or unstable/collision-prone derived keys
  - pagination cursor coupling:
    - client derives next cursor from business fields without opaque token or
      explicit tie-break invariant
  - component responsibility overload:
    - single component owns multiple orchestration concerns (fetching,
      pagination, mutations, routing side-effects, heavy derived state) plus UI
  - error gating isolation breaches:
    - one error flag blocks unrelated actions/requests in same feature flow
- Emit findings with:
  - stable `finding_id`
  - `type`
  - assigned `tier`
  - `affected_files[]`
  - `affected_folders[]` for structural findings (or clear folder-level paths
    represented in `affected_files[]`)
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
- Emitting structural anti-pattern findings without folder-level evidence.
- Promoting out-of-mode findings to blocking active-step status.
- Producing recommendations that are purely aesthetic or preference-driven.
- Treating script output as authoritative evidence without direct rule-based
  review.

### Notes

- Detection should prioritize standards alignment over style-only concerns.
