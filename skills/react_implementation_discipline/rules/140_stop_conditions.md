# Stop Conditions

## Summary

Defines hard stop/revise conditions before output finalization.

---

## Rule: Stop and Revise Conditions
**Rule ID:** rid-stop-conditions  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Prevent knowingly non-compliant output from being emitted.

### Requirement

- Stop and revise plan/output if implementation would require:
  - domain knowledge inside shared `ui/**`
  - endpoint fetch outside canonical endpoint layer
  - leaky shared-composite generalization beyond safe thresholds
  - touched files exceeding 400 lines without extraction/split path
  - touched files exceeding 600 lines at all
- If blocked due to unresolved stop conditions, return `blocked` state with
  explicit required fixes.
- If stop condition is caused by missing mandatory context, return
  `dependency_error` instead of `blocked`.

### Forbidden

- Proceeding with known stop-condition violations.
- Hiding stop-condition violations as warnings-only output.

### Notes

- Stop conditions are hard gates, not advisory guidance.
