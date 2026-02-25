# Micro-change Bypass

## Summary
Defines deterministic conditions for bypassing Skills 1-3 and invoking
implementation discipline directly in micro mode.

---

## Rule: Micro-change Bypass and Skill 4 Micro Mode
**Rule ID:** sr-micro-change-bypass  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Allows low-risk behavior-preserving refactors to stay fast while
still enforcing implementation discipline and boundary checks.

### Requirement

- A request may be classified as `micro_change` only when all are true:
  - behavior-preserving refactor intent is explicit.
  - expected touched files are `<= 2`.
  - no new files are required.
  - no move/rename operations are required.
  - no new endpoint/hook/composite homes are introduced.
  - no routing changes are required.
- If `micro_change` is confirmed:
  - Skills 1-3 may be bypassed.
  - Skill 4 may be used directly in `micro mode`.
  - As an alternative, an external checklist-only path may be used when Skill 4
    is not selected.
- Skill 4 `micro mode` must still enforce:
  - boundary audits
  - minimal churn
  - validation/quality checks and explicit check results
  - structured output discipline
- If any `micro_change` condition cannot be confirmed, use the normal staged
  pipeline instead of bypass.

### Forbidden

- Using micro-change bypass for feature additions or structural migrations.
- Skipping boundary/quality validation because the change is small.
- Treating uncertain scope as micro-change without explicit evidence.
