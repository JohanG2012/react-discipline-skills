# No Duplicate UI Patterns (Composites)

## Summary
Prevents parallel implementations of the same reusable interaction pattern and
enforces reuse-first consolidation.

---

## Rule: No Duplicate UI Patterns (Composites)
**Rule ID:** sr-no-duplicate-ui-patterns  
**Priority:** MUST  
**Applies to:** react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevent parallel implementations of the same UI interaction
pattern that cause drift, inconsistent behavior, and refactor churn.

### Requirement

- Definition: a duplicate UI pattern exists when all are true:
  1. same interaction model (for example trigger -> overlay/popover/menu ->
     selectable actions -> close/dismiss),
  2. same structural UI shape (equivalent composition of primitives/composites),
  3. differences are mostly content/config (labels, disabled rules, callbacks,
     minor styling),
  4. shared abstraction is feasible without domain leakage (slots/children/render
     props, no domain mode flags).
- Reuse-first consolidation behavior:
  - reuse the existing composite as-is when viable,
  - if small gaps exist, update existing composite via slots/children/render
    props, content injection, or small generic props (within caps),
  - do not introduce or expand a second parallel copy for the same pattern.
- New composite allowed only when at least one is true:
  - fit is low (`fit < 6`) and forcing reuse would leak abstractions,
  - long-term behavior divergence is expected to be significant,
  - reuse would require domain mode flags or cross-feature coupling,
  - existing composite is clearly the wrong abstraction concern.
- Evidence requirement when choosing new:
  - record explicit `not_found` or wrong-fit evidence against existing
    candidate(s).
- Kebab/actions menu canonical guidance:
  - maintain one canonical reusable composite for this pattern
    (for example `KebabMenu`/`ActionsMenu`),
  - feature behavior is injected via item data/callbacks/optional slots,
  - avoid domain enum-mode flags in shared composite contracts,
  - converging repeated local popover-menu copies is required when interaction
    model plus shape match.
- Scope and migration safety defaults:
  - default mode avoids moves/renames,
  - consolidation first means reusing canonical composite in new/edited flows
    while leaving legacy copies unless explicit migration scope is requested,
  - migration requests must stay scoped and incremental.
- Enforcement heuristics:
  - repeated trigger (for example `...`) plus popover/dropdown plus action list,
  - repeated `stopPropagation` wrappers for same menu behavior,
  - repeated close-on-select logic,
  - repeated menu-item style tokens/strings,
  - repeated accessibility naming conventions for same control type.
- Deterministic default:
  - when uncertain, assume duplicate when interaction model and shape match,
  - choose reuse/update unless that would require domain leakage.

### Forbidden

- Creating or expanding a second composite implementation when duplicate
  conditions are met.
- Choosing new composite by default without candidate evidence review.
- Forcing reuse through domain mode flags such as `variant=\"tasks|projects\"`.
- Broad migration churn (moves/renames) without explicit migration request.
