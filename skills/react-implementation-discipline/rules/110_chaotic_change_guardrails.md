# Chaotic Change Guardrails

## Summary

Defines explicit anti-patterns that must be avoided during implementation.

---

## Rule: Anti-Chaotic Change Guardrails
**Rule ID:** rid-chaotic-change-guardrails  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Prevent architecture drift and uncontrolled maintenance debt.
**Covers:** Anti-Chaotic Change Guardrails.
**Index mode:** reference

### Requirement

- Do not introduce new `shared/` or `common/` dumping-ground abstractions.
- Do not move inline utility/domain logic into pages/sections when it belongs
  in domain/lib layers.
- Do not bypass canonical endpoint layers from hooks/UI.
- Do not combine structural migration with feature behavior in the same change
  unless explicitly requested.
- Keep feature changes local and migration-aware; avoid two-architecture
  parallelism.

### Forbidden

- Refactor-for-future changes without immediate feature value.
- Creating mega components with many mode/flag combinations.

### Notes

- If migration work is necessary, isolate it as explicit scope.
