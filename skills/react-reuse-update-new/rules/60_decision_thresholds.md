# Decision Outcome Thresholds

## Summary
Defines deterministic decision outcome thresholds and scoring interpretation for
reuse/update/new selection.

---

## Rule: Outcome Threshold Interpretation
**Rule ID:** rru-decision-thresholds  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Converts scoring into predictable decisions and prevents
reviewer-dependent outcomes.
**Covers:** Outcome Threshold Interpretation.
**Index mode:** reference

### Requirement

- Use score interpretation guidance for fit:
  - `10`: identical behavior
  - `7-9`: minor wiring/extension
  - `4-6`: significant differences
  - `0-3`: wrong abstraction
- Use score normalization anchors for coupling/divergence/locality:
  - `coupling_risk=0`: no new imports and no cross-domain references
  - `coupling_risk=5`: new imports within the same feature boundary
  - `coupling_risk=10`: cross-domain import or new global dependency
  - `divergence_risk=0`: behavior is effectively identical
  - `divergence_risk=5`: behavior is similar but likely to evolve separately
  - `divergence_risk=10`: behavior is expected to diverge significantly over time
  - `locality_benefit=0`: ownership is pulled away from the feature/domain home
  - `locality_benefit=5`: neutral ownership/locality impact
  - `locality_benefit=10`: ownership remains close to the feature/domain home
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
- When `decision=new`, apply feature-root gate before finalizing `target_path`:
  - new top-level `features/<name>/` is valid only for route/nav-level or
    otherwise user-facing owners,
  - non-user-facing/internal capability must target
    `features/<owner>/modules/<name>/` (or local equivalent module subhome),
  - React-free artifacts should prefer `lib/**`,
  - if candidate feature name shares normalized stem/prefix with existing
    top-level feature owner (including simple singular/plural variants), treat
    as submodule placement under that owner, not a new sibling feature root.

### Forbidden

- Selecting `reuse` or `update` outcomes that violate threshold limits without
  explicit override handling.
- Treating high-divergence/high-coupling outcomes as reusable shared abstractions.
- Returning `decision=new` that introduces a non-user-facing top-level
  `features/<name>/` root.
- Omitting applied threshold values from decision output.

### Notes

- Thresholds reduce ambiguity; they do not replace architectural judgment.
