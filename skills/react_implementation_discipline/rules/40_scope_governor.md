# Scope Governor

## Summary

Defines hard execution caps and bounded scope expansion behavior.

---

## Rule: Scope and Churn Caps
**Rule ID:** rid-scope-governor  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Prevent implementation drift and keep output reviewable.

### Requirement

- Enforce default hard caps unless explicitly overridden:
  - max files touched: `8`
  - max new files: `4`
  - max moved/renamed files: `0`
  - max new dependencies: `0`
  - max new top-level folders: `0`
- When caps are exceeded but minimum delivery is possible:
  - return the in-cap minimal output
  - include bounded `scope_expansion_needed[]` with `why` and `would_touch`
  - include concise `recommended_follow_up_scope[]`
- Out-of-scope requests without explicit approval must be excluded from
  implementation payload.

### Forbidden

- Expanding scope silently.
- Adding dependencies without explicit approval.
- Mixing migration moves with feature behavior without explicit request.

### Notes

- Favor smallest viable in-cap delivery first.
