# Layer Contracts

## Summary
Defines shared folder-layer contracts and cross-layer error handling ownership.

---

## Rule: Layer Contracts and Error Ownership
**Rule ID:** sr-layer-contracts  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps ownership deterministic across pages, features, UI, API,
store, core, hooks, lib, and config.
**Covers:** Layer Contracts and Error Ownership.
**Index mode:** reference

### Requirement

- `pages/**` are route orchestrators and must not fetch directly from canonical
  endpoint modules.
- `features/**` own domain logic, feature hooks, and DTO-to-domain mapping.
- Composition boundary is explicit:
  - only `pages/**` and `core/**` may compose multiple features together,
  - `features/**` must not import/render other feature sections/components/hooks
    for cross-feature composition.
- `ui/**` remains domain-agnostic and transport-agnostic.
- `api/**` remains transport-only with DTO ownership and normalized error
  outputs.
- `store/**` is global client-state only; server-state source of truth remains
  query cache.
- `features/<domain>/state/**` is allowed only for feature-local client state
  shared by 2+ sections/components in that same feature.
- Feature-local state must not mirror server-state/query-cache data without
  explicit rationale and constrained scope.
- `core/**` composes providers/setup rather than domain behavior.
- `hooks/**` are cross-domain generic hooks unless in feature-owned hook homes.
- `config/**` is canonical home for env and feature-flag access points.
- Cross-layer error handling follows three-stage ownership:
  - `api/endpoints/**`: normalized transport errors.
  - `features/*/hooks/**`: expose hook-level error shapes.
  - `pages/**` and `features/*/sections/**`: choose user-facing feedback.

### Forbidden

- Fetching or transport logic in page/UI layers.
- Cross-feature composition inside `features/**` layers.
- Domain logic in `ui/**` or transport mapping in `api/**`.
- Using feature-local state as a substitute for global `store/**`.
- Mirroring server-state into feature-local state without explicit
  justification.
- UI feedback policy embedded in transport layers.
