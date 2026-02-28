# Migration and Placement Strategy

## Summary
Defines migration-aware placement rules and strategy selection constraints.

---

## Rule: Migration and Placement Strategy
**Rule ID:** sr-migration-placement  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents mixed-architecture drift and keeps placement decisions
deterministic in legacy or evolving repositories.
**Covers:** Migration and Placement Strategy.
**Index mode:** reference

### Requirement

- Do not introduce parallel architectures for the same concern.
- Choose a strategy per change:
  - Follow existing.
  - Introduce target structure at boundaries.
  - Migrate as you touch (explicit migration scope only).
- Default balanced behavior:
  - No moves/renames unless explicitly enabled.
  - Introduce new homes only when isolated and non-competing.
  - Keep feature behavior and structural migration separate unless explicitly
    requested.
- Gravity decisions from Architecture Detection are inherited by downstream
  skills and must not be recomputed unless pause/escalation resolves a conflict.
- If move mode is explicitly enabled, keep moves small and complete import
  updates in the same change.
- When governance triggers fire (for example oversized feature signals, split
  triggers, or capability-cluster thresholds), output must:
  - recommend the smallest in-cap next step,
  - optionally include scope-expansion follow-up when needed for correctness,
  - avoid auto-restructure behavior.

### Forbidden

- Two active homes for the same concern in one scope.
- Mixing broad structural migration with unrelated behavior changes.
- Recomputing gravity independently in downstream skills without escalation.
- Auto-restructuring repositories when governance triggers are detected.
