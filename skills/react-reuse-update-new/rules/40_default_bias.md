# Deterministic Default Bias

## Summary
Defines mandatory default actions and pause behavior to keep reuse decisions
deterministic and low-friction.

---

## Rule: Deterministic Defaults and Pause Discipline
**Rule ID:** rru-default-bias  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Reduces over-asking and ensures predictable outcomes when
ambiguity exists but safe defaults are available.
**Covers:** Deterministic Defaults and Pause Discipline.
**Index mode:** reference

### Requirement

- Apply these deterministic defaults unless structural risk requires a pause:
  - ambiguous feature owner -> choose the most specific domain
  - UI pattern unclear -> keep logic in the feature section
  - reuse vs generalize unclear -> duplicate section-level implementation
  - multiple state options -> prefer local state first
  - unsure store usage -> avoid introducing global store state
  - unsure abstraction -> keep implementation concrete
  - API placement unclear -> use the existing API home
  - folder placement unclear -> follow upstream gravity and nearest established
    home from placement outputs
  - naming unclear -> match nearest-neighbor naming
- Pause only when at least one condition is true:
  - safe progress is impossible without clarification
  - multiple structural paths are equally valid
  - wrong default choice likely creates long-term structural debt
- When pausing, use clean protocol:
  1. state the ambiguity
  2. offer 2-3 concrete options
  3. provide recommended default
  4. wait for confirmation

### Forbidden

- Pausing for minor naming or harmless small-prop decisions.
- Overriding deterministic defaults without explicit structural risk.
- Proceeding with conflicting structural assumptions after deciding to pause.

### Notes

- Default behavior should maximize forward progress and minimize architectural
  churn.
