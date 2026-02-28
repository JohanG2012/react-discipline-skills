# Feature Too-Big Triggers

## Summary
Defines deterministic trigger conditions that require a bounded size/governance
review for an oversized feature owner.

---

## Rule: Feature Size Governance Triggers
**Rule ID:** sr-feature-too-big-triggers  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps oversized feature drift detectable and action-oriented
without forcing unsafe broad restructures.
**Covers:** Feature Size Governance Triggers.
**Index mode:** reference

### Requirement

- `size_review_required=true` must be raised when either condition is met:
  - any hard trigger fires, or
  - at least 2 soft triggers fire in the same owner feature.
- Hard triggers (any one is sufficient):
  - forbidden shadow homes are present in the feature owner (for example
    `views/**`, `*View`, or feature-local `api/**` when canonical API home
    exists),
  - feature-internal composition boundary break is present
    (cross-feature composition from inside `features/**`),
  - parallel ownership homes for the same concern exist in the same feature and
    create ambiguous ownership.
- Soft triggers (2+ required):
  - feature owner has high footprint (for example 20+ non-test source files),
  - one requested change requires touching 2+ distinct sub-areas/capabilities,
  - repeated duplicate UI/logic patterns exist across sub-areas with no
    sanctioned shared extraction,
  - candidate new sub-area name collides by stem/prefix with existing
    sub-area naming inside the same feature owner.
- Required response when triggered:
  - flag `size_review_required=true`,
  - recommend the smallest in-cap next step first,
  - include follow-up scope expansion only when needed for correctness,
  - keep output as review + plan; no automatic restructure.

### Forbidden

- Auto-restructuring broad feature trees when trigger conditions fire.
- Introducing parallel homes while handling size triggers.
- Introducing wrapper taxonomies like `capabilities/` or `modules/` to
  mask ownership ambiguity.
