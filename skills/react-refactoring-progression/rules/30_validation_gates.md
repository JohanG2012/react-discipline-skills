# Validation Gates

## Summary

Defines behavior-preservation and approval gate checks.

---

## Rule: Behavior Preservation Enforcement
**Rule ID:** rrp-validation-gates  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents accidental regressions during refactor planning.
**Covers:** Behavior Preservation Enforcement.
**Index mode:** reference

### Requirement

- Validate behavior-preservation invariants for each active step.
- Backend contract invariants (hard):
  - no endpoint, method, param, header, or request/response shape changes
  - no transport-semantics changes
- UI/UX invariants (hard):
  - no major user-noticeable UI behavior changes
  - no new UX breakage
  - only tiny visual consistency adjustments are acceptable
- Behavioral invariants (hard):
  - no external component contract breakage unless strictly equivalent
  - no route path/navigation changes
  - no query-key or cache-semantics changes
  - no user-facing loading/error/empty behavior changes
- Record behavior-preservation checks in `plan.behavior_preservation[]` when
  produced.
- If project tests exist, planning should require preserving or extending
  relevant behavior coverage before high-risk refactor execution.
- Always require boundary-audit, lint/type correctness, and no new test/lint
  regressions in acceptance notes.
- If any step requires non-preserving behavior, mark it
  `behavior_change=requires_approval` and set final state to `blocked` unless
  explicit approval is already present.
- Ensure blocked plans include actionable notes describing required approvals or
  changes.

### Forbidden

- Treating non-preserving steps as accepted by default.
- Omitting preservation checks for steps with non-trivial scope.

### Notes

- `blocked` status is valid for refactor-plan outputs that require explicit
  approval before execution.
