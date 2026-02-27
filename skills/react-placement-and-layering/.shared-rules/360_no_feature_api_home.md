# No Feature-Local API Homes

## Summary
Prevents transport-layer fragmentation by enforcing one canonical API home.

---

## Rule: No `api/` Inside Features When Canonical API Home Exists
**Rule ID:** sr-no-feature-api-home  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Preserves one-home-per-concern for transport ownership and
prevents endpoint drift into feature folders.
**Covers:** No api/ Inside Features When Canonical API Home Exists.
**Index mode:** reference

### Requirement

- If a canonical API home exists (for example `src/api/**`,
  `src/services/api/**`, or gravity-equivalent), features must not define local
  `api/` folders.
- All transport logic must stay in the canonical endpoint layer:
  - `fetch`,
  - axios/client wrappers,
  - endpoint functions.
- Features must consume transport through the canonical endpoint layer only.
- DTO-to-domain mapping remains feature-owned in
  `features/<domain>/domain/**` or `features/<domain>/adapters/**`.
- Bootstrap exception is valid only when both are true:
  - no canonical API home exists yet, and
  - architecture detection explicitly enters bootstrap mode.
- Even in bootstrap mode, create canonical API home directly; do not create
  feature-local transport homes.

### Forbidden

- `features/<domain>/api/**` when canonical API home exists.
- Direct HTTP calls inside `features/**` transport ownership.
- Returning domain-mapped types from `api/**` as canonical contracts.
- Creating secondary transport homes inside feature boundaries.
