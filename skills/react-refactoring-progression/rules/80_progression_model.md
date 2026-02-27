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

### Forbidden

- Producing Tier C or Tier D active steps in opportunistic mode.
- Producing Tier D active steps without migration mode and explicit approval.

### Notes

- Tier labels are semantic execution bands, not implementation patch
  instructions.
