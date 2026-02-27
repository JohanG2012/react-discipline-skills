# Prop Drilling Discipline

## Summary
Defines thresholds and remediation order for prop-drilling debt without forcing
premature global-state escalation.

---

## Rule: Prop Drilling Discipline and Escalation
**Rule ID:** sr-props-drilling-discipline  
**Priority:** SHOULD  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keep component trees readable and maintainable by limiting
pass-through wiring while preserving clear ownership boundaries.

### Requirement

- Definitions:
  - prop drilling: passing props through intermediate components that do not
    consume them, only to reach deeper descendants,
  - pass-through component: component forwarding props it does not consume.
- Treat prop drilling as architectural smell when any applies:
  1. depth threshold: same prop/group forwarded through 3+ layers where
     intermediates do not use it,
  2. volume threshold: component forwards 5+ unused props (excluding
     `className`, `children`, and standard DOM props),
  3. branch duplication: same prop set threaded across multiple sibling
     branches,
  4. churn threshold: drilled props frequently change and repeatedly force
     wiring updates across unrelated components,
  5. UI boundary leakage: domain data/actions drilled into shared `ui/**`
     causing domain awareness.
- Approved remediation ladder (in order):
  1. composition/slots first (`children`, render props, explicit slots),
  2. lift orchestration to `features/<domain>/sections/**`,
  3. feature-scoped context provider inside `features/<domain>/**` when many
     deep descendants need shared state/actions,
  4. global store only for truly global state with explicit policy
     justification.
- Feature-scoped context constraints:
  - provider stays feature-owned (not `ui/**` or global `store/**`),
  - context value shape must be intentional/stable (no everything-bag),
  - provider must not become cross-feature dependency.
- Deterministic default:
  - prefer composition first,
  - if many descendants in one feature need shared value, prefer
    feature-scoped context,
  - do not move to global store without explicit global justification.
- Escalation trigger:
  - if depth >= 3 and volume >= 5 in one subtree, treat as refactor-worthy
    issue in touched scope (while respecting scope-governor limits).

### Forbidden

- Prop-bag objects used mainly to hide drilling instead of reducing
  responsibilities.
- Moving state to global `store/**` as convenience fix without global-state
  justification.
- Making shared `ui/**` domain-aware (domain-mode flags or domain-shaped props)
  to bypass proper feature ownership.
- Introducing new `shared/` or `common/` dumping grounds for drilled values.
