# Prop Count Caps

## Summary
Defines soft prop-surface caps and mandatory escalation actions to prevent prop
soup and abstraction creep.

---

## Rule: Prop Count Caps and Escalation Actions
**Rule ID:** sr-prop-count-caps  
**Priority:** SHOULD  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents prop soup and abstraction creep by enforcing
responsibility boundaries and preferring composition/wrappers over flag
matrices.

### Requirement

- Soft prop caps by layer/type (not hard compile failures):
  - `ui/primitives/**`: max 10 component-defined props
    - excludes native passthrough props from
      `ComponentPropsWithoutRef<...>`-style extension.
  - `ui/composites/**`: max 12 props.
  - `features/*/components/**`: max 12 props.
  - `features/*/sections/**`: max 15 props.
  - `core/**` shells/layout: max 8 props.
  - `pages/**`: max 8 props (prefer near-zero; pages should not be generic
    reusable components).
- When exceeding a cap, choose at least one escalation action and record it in
  planning/refactor metadata:
  1. split by responsibility (extract subcomponents),
  2. replace flags with composition (`children`, slots, render props),
  3. introduce feature-owned wrapper to keep shared UI generic,
  4. group props only when compliant with `sr-prop-grouping-discipline`,
  5. demote from shared UI when domain divergence is the driver.
- Layer-specific escalation constraints:
  - `ui/composites/**` must not exceed cap via domain mode flags
    (`variant="tasks|projects"`, `mode/context` matrices); prefer feature
    wrapper or feature-local duplication.
  - `ui/primitives/**` should remain thin via native passthrough plus minimal
    ergonomic props.
  - `pages/**` should not accumulate prop surfaces; extract section/composite
    instead.

### Forbidden

- Exceeding a cap silently without documenting chosen escalation action.
- Violating `sr-prop-grouping-discipline` (for example domain models hidden in
  grouped objects passed into `ui/**`).
- Growing shared composites through large flag matrices or domain switches.
- Designing one-component-to-rule-them-all APIs that hide unrelated
  responsibilities behind props.

### Notes

- Prop count is a complexity proxy; responsibility boundaries are the core
  signal.
- If temporary cap exceedance is unavoidable, record follow-up refactor scope
  instead of allowing continuing prop-surface growth.
