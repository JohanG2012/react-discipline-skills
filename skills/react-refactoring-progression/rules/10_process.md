# Refactor Planning Process

## Summary

Defines deterministic, risk-ordered planning behavior.

---

## Rule: Tiered Planning Sequence
**Rule ID:** rrp-process  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Ensures predictable and low-risk refactor planning.

### Requirement

- Validate required inputs before planning steps.
- Resolve effective output mode before planning output:
  - accept optional `output_mode` (`human|agent`)
  - default to `human` when a human explicitly instructs this skill to run
  - default to `agent` otherwise
- Use canonical tier labels only: `A`, `B`, `C`, `D`.
- Order active plan steps from lower-risk to higher-risk tiers.
- Apply deterministic ordering with no additional custom ordering beyond:
  - tier order (`A -> B -> C -> D`)
  - risk order (low before high within the produced list)
- Escalate only when at least one condition is true:
  - a lower-tier improvement is blocked by compliance constraints
  - no meaningful lower-tier improvements remain
  - dedicated refactor mode is explicitly requested
- Every step must include:
  - `why_now`
  - at least one of `unblocks`, `reduces_future_cost`, `standard_alignment`
- Set `behavior_change=none` by default.
- If behavior-preserving guarantees cannot be met, set
  `behavior_change=requires_approval` and mark step as gated.
- In opportunistic mode, produce only Tier A/B active steps and prioritize:
  - dead code removal and import cleanup
  - naming clarity and local helper extraction
  - type tightening
  - non-structural boundary-conformance fixes
- In opportunistic mode, treat Tier C/D findings as non-blocking follow-up
  guidance only.
- In opportunistic mode, do not include:
  - layer changes
  - endpoint relocation
  - cross-home adjustments
  - architectural boundary introduction
- In dedicated mode, allow Tier C/D only under scope-governor and migration
  constraints.

### Forbidden

- Skipping low-risk tiers when safe lower-tier improvements are available.
- Returning unguided or rationale-free steps.
- Using mixed tier naming schemes (for example `0-4` plus `A-D`) in one output.
- Escalating for aesthetic cleanup, style-only churn, or speculative
  "refactor for future" rationale.

### Notes

- Tier C/D recommendations in opportunistic mode belong in follow-up findings,
  not active steps.
