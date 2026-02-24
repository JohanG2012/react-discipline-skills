# Ambiguity Strategy

## Summary

Defines deterministic behavior when local patterns conflict or are unclear.

---

## Rule: Ambiguity Resolution Strategy
**Rule ID:** rid-ambiguity-strategy  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Keep delivery moving while minimizing structural mistakes.

### Requirement

- When multiple local patterns exist, use this order:
  1. `follow-existing`: mimic the area being modified
  2. `introduce-boundaries`: keep new module internally consistent
  3. `migrate-as-you-touch`: only when it reduces confusion without scope drift
- Prefer the lowest-churn compliant option when multiple choices are valid.
- Pause only for structural blockers:
  - no boundary-compliant implementation path exists
  - conflicting patterns prevent safe placement
  - scope cannot be reduced to a safe minimum
- For non-structural ambiguity, apply deterministic defaults and proceed.

### Forbidden

- Pausing for minor naming/style choices with safe defaults.
- Introducing broad migrations to resolve local ambiguity.

### Notes

- Interruptions should be rare and high-leverage.
