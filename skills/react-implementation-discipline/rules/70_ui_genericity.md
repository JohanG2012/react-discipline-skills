# UI Genericity

## Summary

Defines anti-leakage rules for primitives/composites during implementation.

---

## Rule: UI Genericity and Anti-Leakage
**Rule ID:** rid-ui-genericity  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
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
- Apply layout/shell ownership rules during implementation:
  - low-level minimal-structure building blocks stay in `ui/primitives/**`
  - reusable shell/layout patterns that compose primitives belong in
    `ui/composites/**`
  - domain-owned layout composition belongs in `features/<domain>/sections/**`
- Do not create new top-level `ui/layouts/**` or `ui/shells/**` homes during
  routine implementation.
- If composite layout categorization is required, keep it under existing
  composite home (`ui/composites/layouts/**` or `ui/composites/shells/**`) and
  preserve one-home-per-concern discipline.

### Forbidden

- Encoding domain terms or domain logic in shared `ui/**` components.
- Forcing multi-domain behavior through large flag matrices in composites.
- Placing reusable shell/layout patterns in `ui/primitives/**`.
- Placing domain-owned layout composition in shared `ui/composites/**` by
  default.

### Notes

- Optimize for long-term divergence safety over short-term over-generalization.
