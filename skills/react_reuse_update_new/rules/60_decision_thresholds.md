# Decision Outcome Thresholds

## Summary
Defines deterministic decision outcome thresholds and scoring interpretation for
reuse/update/new selection.

---

## Rule: Outcome Threshold Interpretation
**Rule ID:** rru-decision-thresholds  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Converts scoring into predictable decisions and prevents
reviewer-dependent outcomes.

### Requirement

- Use score interpretation guidance for fit:
  - `10`: identical behavior
  - `7-9`: minor wiring/extension
  - `4-6`: significant differences
  - `0-3`: wrong abstraction
- Apply these default threshold values unless explicit overrides are supplied:
  - `max_new_props_for_update=2`
  - `max_flags_allowed_composites=0` (domain modes)
  - `max_generic_flags_allowed_primitives=1`
  - `max_abstraction_risk_score=6`
- Reuse is preferred when:
  - `fit >= 8`
  - `complexity_cost <= 3`
  - `coupling_risk <= 3`
  - `divergence_risk <= 4`
- Update is preferred when:
  - `fit >= 6`
  - change remains a small extension under update thresholds
  - coupling remains low
  - no domain mode flags are introduced in shared composites
- New is preferred when one or more are true:
  - fit is too low for safe reuse/update
  - update would require multiple flags/options that violate thresholds
  - divergence risk is high
  - coupling/domain leakage risk is high

### Forbidden

- Selecting `reuse` or `update` outcomes that violate threshold limits without
  explicit override handling.
- Treating high-divergence/high-coupling outcomes as reusable shared abstractions.
- Omitting applied threshold values from decision output.

### Notes

- Thresholds reduce ambiguity; they do not replace architectural judgment.
