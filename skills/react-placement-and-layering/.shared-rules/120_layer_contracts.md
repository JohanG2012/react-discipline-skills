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
- `ui/**` remains domain-agnostic and transport-agnostic.
- `api/**` remains transport-only with DTO ownership and normalized error
  outputs.
- `store/**` is global client-state only; server-state source of truth remains
  query cache.
- `core/**` composes providers/setup rather than domain behavior.
- `hooks/**` are cross-domain generic hooks unless in feature-owned hook homes.
- `config/**` is canonical home for env and feature-flag access points.
- Cross-layer error handling follows three-stage ownership:
  - `api/endpoints/**`: normalized transport errors.
  - `features/*/hooks/**`: expose hook-level error shapes.
  - `pages/**` and `features/*/sections/**`: choose user-facing feedback.

### Forbidden

- Fetching or transport logic in page/UI layers.
- Domain logic in `ui/**` or transport mapping in `api/**`.
- UI feedback policy embedded in transport layers.
