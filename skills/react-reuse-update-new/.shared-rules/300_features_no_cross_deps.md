# No Cross-Feature Dependencies

## Summary
Prevents direct feature-to-feature imports to preserve ownership boundaries and
avoid feature-graph coupling.

---

## Rule: No Cross-Feature Dependencies
**Rule ID:** sr-features-no-cross-deps  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Preserve clear ownership and prevent feature-graph coupling that
causes architectural drift and refactor explosions.
**Covers:** No Cross-Feature Dependencies.
**Index mode:** reference

### Requirement

- Core rule:
  - `features/**` must not import from other `features/**` modules.
  - This includes:
    - UI components/sections from another feature,
    - hooks from another feature,
    - domain models/types from another feature,
    - feature-local utilities/adapters/state from another feature.
- Allowed alternatives when multiple features need shared capability:
  1. `ui/**` for shared UI primitives/composites only (no domain logic/types),
  2. `lib/**` for pure cross-domain utilities (no React imports, no domain
     knowledge),
  3. `api/**` as shared transport contract in canonical endpoint layer
     (`api/endpoints/**` or gravity-equivalent), with each feature mapping DTO
     to its own domain model,
  4. `core/**` for cross-cutting infrastructure/composition (auth/session,
     telemetry, providers, routing setup; not domain behavior).
- Exception mechanism (rare):
  - cross-feature import is allowed only when all are true:
    - an explicitly designated shared-domain module exists (for example
      `features/_shared/**` or `domains/**`),
    - that module is documented in exactly one canonical policy location (for
      example `ARCHITECTURE.md` or `src/config/agentOverrides.ts`),
    - exported contracts are intentionally domain-agnostic or multi-feature
      primitives,
    - usage is consistent with no parallel ad hoc cross-feature imports.
  - absent such designation, cross-feature imports remain forbidden.
- Enforcement heuristics:
  - import path pattern `features/<A>/**` importing `features/<B>/**` where
    `A != B`,
  - a feature section rendering another feature section/component directly,
  - a feature hook calling another feature hook directly,
  - a feature consuming another feature's domain types instead of mapping
    transport data locally.
- Deterministic default:
  - prefer `lib/**` if pure,
  - prefer `ui/**` if UI-only,
  - otherwise keep feature-specific implementations separate; duplication at
    section level is acceptable while reusing shared primitives/composites.
- Hard stop conditions:
  - stop and revise when a change would:
    - introduce new cross-feature import,
    - move domain ownership from one feature into another without explicit
      migration scope,
    - create a second shared dumping-ground inside `features/**`.

### Forbidden

- Direct imports from one feature into another feature without explicit shared
  domain designation.
- Cross-feature coupling through UI, hooks, domain types, adapters, or
  feature-local state modules.
- Creating parallel ad hoc shared areas under `features/**` to bypass ownership
  boundaries.
