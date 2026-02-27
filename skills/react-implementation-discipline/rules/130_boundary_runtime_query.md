# Boundary Runtime Query

## Summary

Defines boundary-audit detail, runtime safety essentials, and query correctness
requirements.

---

## Rule: Boundary, Runtime, and Query Correctness
**Rule ID:** rid-boundary-runtime-query  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Ensure implementation output is safe at architecture and runtime
levels.
**Covers:** Boundary, Runtime, and Query Correctness.
**Index mode:** reference

### Requirement

- Boundary audit must enforce all canonical restrictions, including alias paths
  when aliases are used.
- `ui/**` must not import `features/**`, `api/**`, `store/**`, `pages/**`.
- `api/**` must not import React/UI/features/pages/store.
- `features/**` must not import `pages/**`.
- `pages/**` must not import canonical endpoint layer directly.
- Do not fetch outside canonical endpoint layer.
- Prevent domain terms in shared UI component/file naming.
- Runtime safety essentials when server data is involved:
  - handle loading state
  - handle error state
  - handle empty state for collection/list views
  - avoid unhandled promise rejections
  - avoid fire-and-forget fetch in UI layers
- Query correctness when server-state caching exists:
  - stable query keys
  - correct invalidation/cache updates after mutations
  - avoid duplicating server-state in global store unless explicitly justified
  - keep retry behavior intentional (small capped retries for transient query
    failures; no automatic mutation retries unless explicitly required)

### Forbidden

- Accepting outputs with unresolved boundary violations.
- Accepting outputs that skip required runtime state handling.
- Duplicating server-state into store without explicit justification.

### Notes

- Record failures in `validation_status` and return `blocked` when mandatory.
