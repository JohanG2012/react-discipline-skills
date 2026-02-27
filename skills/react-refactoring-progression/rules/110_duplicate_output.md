# Semantic Duplicate Output Requirements

## Summary

Defines required duplication-cluster output fields for actionable planning.

---

## Rule: Cluster Output Completeness
**Rule ID:** rrp-dup-output  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Ensures clusters are actionable without implementation output.
**Covers:** Cluster Output Completeness.
**Index mode:** inline

### Requirement

- Every semantic duplication cluster must include:
  - `pattern_type`
  - `candidate_files[]`
  - `signals[]`
  - `evidence`
  - `recommended_target`
  - `abstraction_cost`
  - `leakage_risk`
  - `divergence_risk`
  - `refactor_radius`
  - `recommended_next_step`
  - `variation_points[]`
  - `candidate_api`
  - `non_goals[]`
- Cluster output must stay concise and structural; no patch text.

### Forbidden

- Returning semantic duplication clusters without extraction-target and risk
  metadata.
- Returning vague similarity claims without supporting evidence.

---

## Rule: Actionable Next Actions
**Rule ID:** rrp-dup-next-actions  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps output useful for downstream task planning.
**Covers:** Actionable Next Actions.
**Index mode:** reference

### Requirement

- `recommended_next_step` must be one sentence with clear immediate action.
- `candidate_api` must describe expected abstraction interface shape in words
  (not code).
- `non_goals[]` must define what must not be abstracted in the proposed step.

### Forbidden

- Omitting non-goals for duplication recommendations.
- Returning code snippets as the "next action" or candidate API definition.

---

## Rule: Keep-Separate Output Clarity
**Rule ID:** rrp-dup-keep-separate-output  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Makes non-extraction decisions explicit and reviewable.
**Covers:** Keep-Separate Output Clarity.
**Index mode:** inline

### Requirement

- When `recommended_target=keep_separate`, cluster output must include a
  concise `keep_separate_reason`.

### Forbidden

- Recommending `keep_separate` without rationale.
