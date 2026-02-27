# Feature Components Scope

## Summary
Defines what may live in `features/<domain>/components/**` so feature
components do not become a shadow shared-UI system.

---

## Rule: What May Live in `features/<domain>/components/`
**Rule ID:** rpl-feature-components-scope  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents feature components from becoming a second shared UI home
or hiding domain/transport logic in presentation files.

### Requirement

- `features/<domain>/components/**` exists for feature-owned UI pieces that are
  not cross-domain reusable and are not route-level orchestration.
- Allowed component characteristics (all required):
  - domain-bound UI with domain terminology and feature-coupled behavior,
  - feature-scoped reuse (same feature only, not intended cross-feature),
  - UI-oriented behavior only (local UI state, minor presentation logic, event
    handlers),
  - leaf/support role (for example extracted from sections to reduce size or
    complexity).
- Structural constraints:
  - feature components may import:
    - `ui/**`,
    - same-feature hooks/domain utilities,
    - `lib/**`,
  - feature components must not import:
    - `pages/**`,
    - canonical endpoint modules directly,
    - other features unless explicitly allowed shared-domain policy exists.
- Deterministic placement matrix:
  - route-level orchestration -> `pages/**`,
  - domain-aware orchestration -> `features/<domain>/sections/**`,
  - feature-owned leaf UI -> `features/<domain>/components/**`,
  - cross-domain reusable UI -> `ui/primitives/**` or `ui/composites/**`,
  - pure logic -> `features/<domain>/domain/**` or `lib/**`.
- Hard guardrail:
  - if a component in `features/<domain>/components/**` is reused by 2+ domains,
    has no domain terminology, or becomes a mini shared composite, promote it
    to `ui/**`.

### Forbidden

- Transport logic in feature components:
  - `fetch`, axios, endpoint ownership, DTO mapping.
- Cross-domain shared UI maintained under feature components.
- Domain algorithms/business rules/complex transformation logic in component
  files (belongs in feature domain or feature hooks).
- Route orchestration concerns in feature components (belongs in pages/sections).
- Shared dumping-ground subfolders like `common/` or `shared/` under
  feature-components homes.
