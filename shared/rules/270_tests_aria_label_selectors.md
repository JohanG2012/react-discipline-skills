# Test Selectors and `aria-label` Usage

## Summary
Defines stable, user-centric test selector priorities while preventing
accessibility attributes from being used as test-only hooks.

---

## Rule: Test Selectors and `aria-label` Usage
**Rule ID:** sr-tests-aria-label-selectors  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keep tests user-centric and stable without abusing accessibility
attributes as test-only hooks.

### Requirement

- Scope:
  - This rule applies to test strategy and test artifacts across unit,
    integration, and end-to-end coverage when execution skills propose or modify
    tests/selectors.
- Selector priority order (use highest viable):
  1. role plus accessible name (preferred),
  2. visible label selectors (inputs/controls),
  3. `aria-label` / accessible-name selectors (conditional),
  4. `data-testid` (fallback for stability/ambiguity),
  5. CSS classes or DOM-structure selectors (last resort; discouraged).
- `aria-label` selectors are allowed only when all are true:
  - the element is meant to be accessible by name (for example icon-only button
    or unlabeled control),
  - the label is semantic and stable (for example `Close dialog`, `Open menu`,
    `Delete task`),
  - selector stability is acceptable for localization/copy volatility in current
    repository context,
  - query scope resolves to an unambiguous target.
- `data-testid` fallback:
  - when stable user-centric selectors are not viable due to localization churn,
    repeated controls, virtualization, unstable icon-only naming, or ambiguous
    accessible names, use dedicated `data-testid`,
  - `data-testid` must be semantic and deterministic (for example
    `task-delete-button`, `inbox-sync`, `pin-lock-submit`),
  - `data-testid` must not encode styling or DOM structure,
  - `data-testid` should be scoped to the owning feature/component boundary.
- Accessibility integrity:
  - do not add `aria-label` solely for testing,
  - add `aria-label` only when it improves real accessibility (for example
    unlabeled controls, icon-only buttons, custom inputs),
  - when visible label association exists, tests should prefer that association
    instead of redundant `aria-label`.
- Enforcement heuristics:
  - frequent test failures from copy tweaks are a selector-smell signal,
  - heavy `aria-label` string selection across tests indicates fragility,
  - added `aria-label` attributes with no accessibility value indicate misuse,
  - selecting by plain text when role/name query is available indicates missed
    user-centric selection.
- Deterministic defaults:
  - prefer role-based queries first,
  - when label stability is doubtful, prefer `data-testid` over `aria-label`.

### Forbidden

- Targeting `aria-label` when label text is product/marketing copy likely to
  change.
- Targeting user-facing `aria-label` values as primary hooks in localized (or
  localization-ready) surfaces without stability controls.
- Injecting `aria-label` only to satisfy tests.
- Relying on fragile ordering among similarly named elements when selector scope
  is ambiguous.
- Defaulting to CSS class/DOM-structure selectors when stable higher-priority
  selectors are available.
