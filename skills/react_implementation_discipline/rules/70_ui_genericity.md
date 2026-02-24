# UI Genericity

## Summary

Defines anti-leakage rules for primitives/composites during implementation.

---

## Rule: UI Genericity and Anti-Leakage
**Rule ID:** rid-ui-genericity  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Prevent domain coupling and unstable abstractions in shared UI.

### Requirement

- When updating shared composites:
  - prefer slots/children/render composition
  - do not add domain-specific props or enums
  - do not import domain types
- When updating primitives:
  - small ergonomic props are allowed
  - do not introduce domain mode flags
- If reuse would require leaky abstraction via `variant`, `mode`, or `context`
  flags, prefer feature-section ownership or safe duplication.
- Keep domain behavior in feature sections/hooks, not in shared UI layers.

### Forbidden

- Encoding domain terms or domain logic in shared `ui/**` components.
- Forcing multi-domain behavior through large flag matrices in composites.

### Notes

- Optimize for long-term divergence safety over short-term over-generalization.
