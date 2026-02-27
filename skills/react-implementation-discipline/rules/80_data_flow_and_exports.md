# Data Flow and Exports

## Summary

Defines execution order, data-flow boundaries, and export wiring discipline.

---

## Rule: Bottom-Up Flow and Minimal Export Wiring
**Rule ID:** rid-data-flow-exports  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Keep implementation predictable and avoid boundary leakage.
**Covers:** Bottom-Up Flow and Minimal Export Wiring.
**Index mode:** reference

### Requirement

- Prefer bottom-up implementation order when applicable:
  1. DTO/type boundaries
  2. endpoint modules
  3. domain/adapters
  4. feature hooks
  5. UI primitives/composites
  6. feature sections
  7. page composition
- Enforce predictable data flow:
  - endpoint modules return transport DTO data
  - feature layer maps DTO to domain where needed
  - sections render domain-facing data
  - pages compose sections
- Do not fetch inside UI components when canonical endpoint flow exists.
- Wire exports minimally:
  - update nearest existing barrel only when the area already uses barrels
  - avoid introducing new barrel files unless local convention requires it

### Forbidden

- Bypassing endpoint ownership from UI/page layers.
- Creating broad barrel rewires unrelated to requested change.

### Notes

- Keep wiring changes local to reduce merge and review risk.
