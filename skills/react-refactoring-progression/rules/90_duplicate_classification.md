# Semantic Duplicate Classification

## Summary

Defines deterministic classification and evidence standards for semantic
duplication clusters.

---

## Rule: Pattern Type Classification
**Rule ID:** rrp-dup-pattern-types  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Ensures each duplication candidate maps to one clear extraction
strategy.
**Covers:** Pattern Type Classification.
**Index mode:** reference

### Requirement

- Every semantic duplication cluster must declare exactly one primary
  `pattern_type`:
  - `layout_skeleton`
  - `data_state_boundary`
  - `interaction_state_machine`
  - `config_schema`
  - `hook_orchestration`
  - `domain_parallel_component`
  - `mapping_pipeline`
  - `permission_gating`
  - `other`
- If `pattern_type=other`, include a concise `type_explanation`.

### Forbidden

- Returning unlabeled duplication clusters.
- Assigning multiple primary pattern types to one cluster.
- Using `other` without an explanation.

---

## Rule: Two-Signal Qualification Gate
**Rule ID:** rrp-dup-two-signals  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Reduces false positives from cosmetic similarity.
**Covers:** Two-Signal Qualification Gate.
**Index mode:** reference

### Requirement

- A cluster may qualify as a semantic duplication candidate only when at least
  two independent signals are present.
- Signals must represent structural or responsibility-level similarity and must
  not be identifier-only similarity.

### Forbidden

- Declaring a duplication candidate from a single weak signal.
- Treating naming similarity as a standalone qualification signal.

---

## Rule: Structural Evidence Quality
**Rule ID:** rrp-dup-evidence  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps recommendations actionable and auditable.
**Covers:** Structural Evidence Quality.
**Index mode:** reference

### Requirement

- Each cluster must include concise structural evidence that covers:
  - shared responsibility
  - structural similarity basis
  - variation surface
  - target-layer rationale
- Evidence must explain why the recommendation is safe for the proposed layer.

### Forbidden

- Evidence that only references cosmetic similarity.
- Raw code dumps instead of structural explanation.
