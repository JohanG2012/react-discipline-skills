# Pause Defaults Protocol

## Summary

Defines deterministic default behavior and strict pause protocol for structural
ambiguity.

---

## Rule: Deterministic Defaults and Pause Protocol
**Rule ID:** rid-pause-defaults-protocol  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Avoid unnecessary interruptions while preventing structural debt.

### Requirement

- Apply deterministic defaults when safe:
  - ambiguous feature owner -> choose most specific domain
  - unclear UI pattern -> keep logic in feature section
  - unclear reuse/generalize -> prefer section-level duplication
  - unclear state ownership -> prefer local state first
  - unclear abstraction value -> keep implementation concrete
  - unclear naming -> match nearest neighbor naming
- Pause only when cost of guessing is structurally high:
  - no boundary-compliant path exists
  - conflicting patterns block safe placement
  - scope cannot be reduced to minimum safe delivery
- When pausing, follow clean protocol:
  1. state ambiguity precisely
  2. offer 2-3 concrete options
  3. recommend a default option
  4. stop and wait for confirmation
- Keep questions high-leverage and structural; avoid broad or stylistic
  questions when safe defaults exist.

### Forbidden

- Pausing for minor naming/styling choices.
- Asking vague architecture questions during implementation.
- Blocking delivery when a safe deterministic default exists.

### Notes

- Default pause mode is effectively balanced: pause only for structural blockers.
