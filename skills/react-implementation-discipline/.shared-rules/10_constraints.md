# Policy Constraints

## Summary
Defines non-negotiable scope and cap controls for downstream skill work.

---

## Rule: Minimal Scope Enforcement
**Rule ID:** sr-constraints  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents uncontrolled scope expansion and dependency creep.
**Covers:** Minimal Scope Enforcement.
**Index mode:** reference

### Requirement

- Changes must stay within the requested feature scope.
- New top-level folders must not be added without explicit approval.
- New dependencies must not be added without explicit approval.
- `pre_approved_collisions` must exist only in shared baseline header and be
  empty unless explicitly approved in a future version.
- When work appears to exceed scope caps, deliver the smallest viable in-cap
  result and provide a structured follow-up scope list.

### Forbidden

- Silent expansion of scope.
- Introducing unapproved dependencies or repositories.
- Defining downstream-local collision registries.
- Mixing structural migration moves with feature behavior work unless explicitly
  requested.

### Notes

- If a requirement cannot be met without expanding scope, pause and request
  approval.

---

## Rule: Scope Governor Hard Defaults
**Rule ID:** sr-scope-governor  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Controls churn and keeps delivery bounded.
**Covers:** Scope Governor Hard Defaults.
**Index mode:** reference

### Requirement

- Hard defaults (unless explicitly overridden):
  - Max files touched: `8`
  - Max new files: `4`
  - Max moved/renamed files: `0` (unless migration mode explicitly enabled)
  - Max new dependencies: `0`
  - Max new top-level folders: `0`
- When caps are exceeded, provide a structured scope expansion request with
  concrete `why` and `would_touch` fields, while still delivering an in-cap
  result.

### Forbidden

- Exceeding hard defaults silently.
- Expanding dependency or top-level folder scope without explicit approval.
