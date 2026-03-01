# Feature Components Scope

## Summary
Defines what may live in `features/<domain>/components/**` so feature
components do not become a shadow shared-UI system.

---

## Rule: What May Live in `features/<domain>/components/`
**Rule ID:** sr-feature-components-scope  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents feature components from becoming a second shared UI home
or hiding domain/transport logic in presentation files.
**Covers:** What May Live in features/<domain>/components/.
**Index mode:** reference

### Requirement

- `features/<domain>/components/**` exists for feature-owned UI pieces that are
  not route-level orchestration and are not yet qualified for shared `ui/**`
  ownership.
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
- Cross-capability/cross-domain reuse assessment is required when either is
  true:
  - a feature component is reused by 2+ capabilities in the same feature, or
  - a feature component is reused by 2+ domains/features.
- `ui/**`-fit assessment must verify all:
  - naming can be domain-agnostic (file base name + primary export),
  - dependencies are UI-only/shared-safe (no feature-owned domain/transport
    coupling),
  - behavior is reusable pattern/interaction rather than domain ownership.
- Hard guardrail:
  - if a component in `features/<domain>/components/**` is reused by 2+
    domains/features and passes `ui/**`-fit assessment, promote it to `ui/**`,
  - if reused by 2+ capabilities, assess for promotion and prefer `ui/**` when
    it passes `ui/**`-fit checks,
  - any promoted component must use domain-agnostic file/export naming in
    `ui/**`.

### Forbidden

- Transport logic in feature components:
  - `fetch`, axios, endpoint ownership, DTO mapping.
- Cross-domain shared UI maintained under feature components.
- Domain algorithms/business rules/complex transformation logic in component
  files (belongs in feature domain or feature hooks).
- Route orchestration concerns in feature components (belongs in pages/sections).
- Shared dumping-ground subfolders like `common/` or `shared/` under
  feature-components homes.
- Moving/promoting a component to `ui/**` while keeping domain-specific
  file/export naming.
