# Deterministic Defaults and Pause Discipline

## Summary
Defines deterministic default actions and strict pause criteria for placement
decisions.

---

## Rule: Default Bias and Clean Pause Protocol
**Rule ID:** rpl-default-bias  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Keeps planning flow predictable while pausing only for
high-impact ambiguity.

### Requirement

- Apply deterministic defaults unless structural risk requires a pause:
  - ambiguous feature owner -> choose the most specific domain
  - UI pattern unclear -> keep logic in the feature section
  - reuse vs generalize unclear -> prefer section-level duplication
  - multiple state options -> prefer local state first
  - unsure store usage -> avoid introducing global store state
  - unsure abstraction -> keep implementation concrete
  - API placement unclear -> use the existing API home
  - folder placement unclear -> follow gravity and nearest established home
  - naming unclear -> match nearest-neighbor naming
- Pause only when both are true:
  - `confidence < 0.7`
  - impact is structural
- For low-confidence non-structural decisions, proceed with deterministic
  defaults.
- When pausing, use a clean protocol:
  1. state the structural ambiguity
  2. provide two or three bounded options
  3. provide one recommended default
  4. wait for confirmation
- Default pause mode is `balanced`; respect explicit policy overrides for
  `strict` or `autonomous` modes.

### Forbidden

- Pausing for minor naming choices, harmless small prop additions, or other
  low-impact local decisions with safe defaults.
- Asking vague or philosophical architecture questions during execution.
- Continuing with conflicting structural assumptions after deciding a pause is
  required.

### Notes

- Question quality must remain high-leverage, structural, and blocking.
