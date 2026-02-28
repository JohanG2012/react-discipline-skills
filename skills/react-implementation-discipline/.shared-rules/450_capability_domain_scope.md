# Capability Domain Scope

## Summary
Defines what domain logic may live inside a capability folder versus the
feature-level domain home.

---

## Rule: Capability-Level Domain Scope and Promotion
**Rule ID:** sr-capability-domain-scope  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Allows local domain specialization without fragmenting canonical
feature domain ownership.
**Covers:** Capability-Level Domain Scope and Promotion.
**Index mode:** reference

### Requirement

- Capability-level `domain/**` is allowed only inside a direct capability
  folder (for example `features/<domain>/<capability>/domain/**`) and only for:
  - capability-only invariants,
  - capability-local projections/view models/selectors.
- Canonical entity models and cross-capability invariants remain in
  `features/<domain>/domain/**`.
- Capability domain modules must not be imported by sibling capabilities.
- Promotion rule:
  - if capability-domain logic is used by 2+ capabilities, promote it to
    feature-level `domain/**`,
  - if promoted logic is pure and cross-domain, promote to `lib/**` instead.
- Promotion decisions are review-driven and must include evidence paths.

### Forbidden

- Defining canonical feature entity models in capability-local `domain/**`.
- Storing cross-capability invariants in one capability's local domain home.
- Importing capability-local domain modules from other capability folders.
