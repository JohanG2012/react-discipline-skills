# Quick Validation

## Summary

Defines pre-output lightweight checks required for disciplined completion.

---

## Rule: Quick Validation Checklist
**Rule ID:** rid-quick-validation  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Catch common correctness issues before output is finalized.
**Covers:** Quick Validation Checklist.
**Index mode:** reference

### Requirement

- Before final output, confirm:
  - no circular imports introduced by touched files
  - no forbidden imports or boundary violations
  - changed code references valid existing types/contracts
  - query keys remain stable where server-state hooks are updated
  - loading/error/empty handling remains consistent with local patterns
- If repository tests exist and touched behavior requires updates, include
  relevant test adjustments.

### Forbidden

- Finalizing output without running these checks.
- Marking output accepted when these checks identify unresolved failures.

### Notes

- This rule complements (not replaces) formal lint/type/test commands.
