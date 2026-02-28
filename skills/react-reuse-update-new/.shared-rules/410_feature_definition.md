# Feature Definition

## Summary
Defines what a feature is and which layers may compose features together.

---

## Rule: Feature Definition and Composition Boundary
**Rule ID:** sr-feature-definition  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps feature ownership explicit and prevents route/transport/layout drift into feature boundaries.
**Covers:** Feature Definition and Composition Boundary.
**Index mode:** reference

### Requirement

- A feature is a domain owner, not a route artifact.
- A feature may exist without direct route import.
- A feature must be consumed by at least one composition boundary:
  - `pages/**`, or
  - `core/**`.
- Feature ownership includes:
  - domain logic/invariants,
  - feature hooks,
  - sections/components for that domain,
  - DTO-to-domain mapping for that domain.
- Feature ownership excludes:
  - route orchestration ownership,
  - transport ownership,
  - shared layout/framework shell ownership.

### Forbidden

- Treating a feature as a route-only wrapper with no domain ownership.
- Treating a feature as canonical transport or routing layer.
- Composing multiple features directly from inside one feature.
