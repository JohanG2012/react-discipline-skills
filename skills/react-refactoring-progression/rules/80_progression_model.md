# Refactor Progression Model

## Summary

Defines the finalized tier model and mode-specific tier allowances.

---

## Rule: Finalized Tier Model
**Rule ID:** rrp-progression-model  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps tier semantics stable for reviewers and downstream
automation.
**Covers:** Finalized Tier Model.
**Index mode:** reference

### Requirement

- Canonical tier model:
  - Tier A: Reuse alignment
  - Tier B: Implementation hygiene
  - Tier C: Placement corrections
  - Tier D: Architecture convergence
- Opportunistic mode:
  - allows Tier A and Tier B active steps only
  - Tier C/D findings must be follow-up only
- Dedicated mode:
  - allows Tier A/B by default
  - may include Tier C under scope-governor constraints
  - Tier D requires explicit migration mode and approval
- Escalation order must remain:
  - Tier A -> Tier B -> Tier C -> Tier D
- Detection-to-tier mapping must remain deterministic:
  - `feature_too_big_triggers` defaults to Tier B follow-up,
  - escalate `feature_too_big_triggers` to Tier C follow-up when placement
    correction is required,
  - `capability_folder_recommendation` is Tier C follow-up by default because
    it is structural.
- Tier C findings must include structural evidence paths (affected files and
  owning folders) before they can be accepted as follow-up output.

### Forbidden

- Producing Tier C or Tier D active steps in opportunistic mode.
- Producing Tier D active steps without migration mode and explicit approval.

### Notes

- Tier labels are semantic execution bands, not implementation patch
  instructions.
