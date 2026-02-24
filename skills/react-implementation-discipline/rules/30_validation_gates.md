# Validation Gates

## Summary

Defines mandatory implementation validation checks and execution order.

---

## Rule: Validation Gate Sequence
**Rule ID:** rid-validation-gates  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Catch high-risk defects early and keep completion criteria
consistent.

### Requirement

- Always execute this high-signal sequence before final output:
  1. Boundary audit
  2. Type/lint checks when tooling exists
  3. Loading/error/empty state review when relevant
  4. Query key/invalidation sanity when relevant
  5. Scope/minimal churn audit
  6. Existing test suite checks when present
- Required always:
  - boundary rules satisfied
  - no fetching outside canonical endpoint ownership
  - plan-followed minimal churn
- Required when tooling exists:
  - type/lint commands pass using repository-standard checks
- Required when test suite exists:
  - relevant tests updated or added for changed behavior
- Any failed mandatory gate must set `final_state=blocked`.

### Forbidden

- Declaring success when required gates were skipped.
- Treating failed mandatory gates as warnings-only output.

### Notes

- Keep validation deterministic and evidence-based.
