# UI and Accessibility Hygiene

## Summary

Defines deterministic hygiene checks for `className` and `aria-label` in
refactor planning without expanding architecture scope.

---

## Rule: Refactor — `className` Hygiene and Correct Placement
**Rule ID:** rrp-ui-classname-hygiene  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Remove style-prop drift without creating new architecture or
prop soup.

### Requirement

- Detect `className` as incorrect/suspect when any is true:
  - non-DOM modules accept `className` but do not render a DOM root:
    - `hooks/**`, `features/*/hooks/**`
    - `features/*/domain/**`, `lib/**`
    - `api/**`
    - `config/**`
  - a component accepts `className` but does not pass it to a stable root
    element (unused prop or inconsistent inner-child application).
  - a feature section/page repeatedly uses `className` as a layout escape
    hatch.
  - a composite accumulates slot-style prop explosion (`headerClassName`,
    `rowClassName`, `cellClassName`, etc.) without multiple real call sites
    needing them.
  - `className` is used to encode domain state (for example `taskCompleted`,
    `projectArchived`) instead of being derived internally from domain
    props/state.
- Evaluate smallest compliant action in this order:
  1. remove unused `className` props (and update callers)
  2. forward `className` correctly to one stable DOM root (preferred for
     `ui/primitives/**` and most `ui/composites/**`)
  3. replace deep external styling needs with composition (wrapper in composing
     layer)
  4. extract reusable UI wrapper/composite when multiple call sites style the
     same structural pattern
  5. consolidate style extension by reusing canonical repo merge helper
     (for example `lib/cn.ts`) when present
  6. stop/block when fixing needs structural expansion (new top-level folders,
     cross-home moves, new dependencies, or second styling system) and return
     scoped expansion request.

### Forbidden

- Adding `className` for consistency to components that should not be style
  extensible.
- Introducing new styling prop patterns (`sx`, `styles`, etc.) in repos already
  using `className`.
- Adding many slot-level class props in composites without clear multi-call-site
  evidence.

### Notes

- Prefer remove/forward over introducing new APIs.
- Repeated external styling overrides on feature sections signal boundary smell;
  consider extracting a composite or composing wrappers at page level.

---

## Rule: Refactor — `aria-label` Hygiene and Correct Placement
**Rule ID:** rrp-a11y-aria-label-hygiene  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevent ARIA misuse while ensuring every control has a correct
accessible name.

### Requirement

- Detect `aria-label` as incorrect/suspect when any is true:
  - added to non-interactive wrappers (`div`, `section`, `span`) without real
    accessible-name requirement.
  - added to interactive element that already has a good visible label.
  - accepted by container components that do not own the interactive element.
  - added in shared UI with hardcoded domain semantics.
  - generic/wrong naming (`Button`, `Click`, `Icon`) or labels that do not
    reflect current state/action.
  - used where `<label>`/`aria-labelledby` should be used because visible text
    already exists.
  - added where native semantics already provide correct naming/role and ARIA
    makes it worse.
- Evaluate smallest compliant action in this order:
  1. remove redundant/incorrect `aria-label` when correct accessible name
     already exists
  2. move accessible-name ownership to correct layer:
     - feature sections/pages define domain labels
     - shared primitives/composites accept+forward ARIA props
  3. replace with better mechanism:
     - use `<label>`/`aria-labelledby` for labeled inputs
     - use `aria-label` for icon-only controls
  4. fix wording to specific, state-correct labels
  5. add missing accessible name for icon-only/custom controls via primitive
     pass-through or visible label
  6. stop/block when fixes need structural scope expansion and return scoped
     expansion request.

### Forbidden

- Blanket adding `aria-label` across UI.
- Hardcoding domain-specific accessible names in shared `ui/**`.
- Leaving interactive controls without any accessible name.
- Adding ARIA that conflicts with native semantics (wrong role/name
  combinations).

### Notes

- For icon-only controls, `aria-label` is usually correct.
- Prefer `aria-labelledby` when visible text exists and should name the
  control.
- When label meaning depends on state, ensure accessible name updates with
  current state.
