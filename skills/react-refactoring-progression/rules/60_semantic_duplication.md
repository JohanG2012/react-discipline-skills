# Semantic Duplication

## Summary

Defines qualification and scoring for structural duplication candidates.

---

## Rule: Semantic Duplication Qualification
**Rule ID:** rrp-semantic-duplication  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents unsafe abstraction and focuses on high-leverage reuse.
**Covers:** Semantic Duplication Qualification.
**Index mode:** reference

### Requirement

- A duplication cluster qualifies only when all are true:
  - responsibility equivalence
  - variation expressibility with <=2 small props/slots or feature-local
    extraction
  - abstraction safety (no domain logic in shared UI and no UI transport logic)
  - acceptable divergence risk
- A duplication cluster also requires at least two independent similarity
  signals.
- Required discovery coverage includes:
  - layout skeletons
  - loading/error/empty boundary trees
  - interaction state-machine patterns
  - config schemas (table/form structures)
  - hook orchestration flows
  - domain-parallel component structures
  - DTO-to-domain mapping pipelines
- Normalize superficial differences (names, literals, import path details)
  before evaluating structural similarity.
- Compare normalized structures on:
  - JSX tree shape
  - conditional decision-tree shape
  - hook usage flow
  - state-machine transitions
- For each cluster, emit:
  - `why_now`
  - at least one of `unblocks`, `reduces_future_cost`, `standard_alignment`
  - `recommended_target`
  - `abstraction_cost`
  - `leakage_risk`
  - `divergence_risk`
  - `refactor_radius`
  - `recommended_next_step`
  - `variation_points[]`
- Use one extraction target only per cluster:
  - `keep_separate`
  - `extract_ui_primitive`
  - `extract_ui_composite`
  - `extract_feature_section`
  - `extract_feature_hook`
  - `extract_lib_utility`
- Recommend `extract_ui_composite` only when variation can be represented with
  slots/children and no domain mode flags are needed.
- Prefer "one level up":
  - within-feature duplication -> feature-local extraction first
  - cross-feature duplication -> shared UI extraction only when leakage risk is
    low
- Reject shared UI extraction when domain-mode flags are required or divergence
  risk is high.
- Default heuristics:
  - if required new props exceed 2, avoid shared UI extraction
  - if divergence risk is high, prefer `keep_separate` or feature-local
    extraction
  - large-radius recommendations should be follow-up scope by default

### Forbidden

- Declaring duplication candidates with only one weak similarity signal.
- Recommending cross-domain shared abstraction when leakage risk is high.

### Notes

- Prefer feature-local extraction before cross-feature abstraction when both are
  viable.
