# Feature State Policy

## Summary
Defines when feature-local state is allowed and when state must remain local or
graduate to global store ownership.

---

## Rule: Feature-Local State Admission and Graduation
**Rule ID:** sr-feature-state-policy  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents unnecessary state layers while preserving explicit
ownership for durable cross-route client state.
**Covers:** Feature-Local State Admission and Graduation.
**Index mode:** reference

### Requirement

- Default posture:
  - feature-local `state/**` is discouraged by default,
  - prefer component/hook-local state first,
  - keep server-state in query cache as source of truth.
- Feature-local `features/<domain>/state/**` is allowed only when at least one
  applies:
  - state is shared by 2+ sections/components in the same feature,
  - state acts as a reusable feature-local client service with clear lifecycle
    boundaries.
- Feature-local state scope must remain inside its owner feature and must not
  become implicit global state.
- Server-state mirroring into feature-local state requires explicit rationale
  and bounded scope; absent rationale, mirroring is disallowed.
- Graduation from feature-local state to `store/**` is allowed only when state
  is:
  - app-wide,
  - cross-route durable, or
  - globally meaningful (for example auth/session/preferences/global UI mode).

### Forbidden

- Using `features/<domain>/state/**` as a substitute for global `store/**`.
- Mirroring query-cache/server-state into feature-local state without explicit
  justification.
- Promoting feature-local state to global store without app-wide or cross-route
  ownership need.
