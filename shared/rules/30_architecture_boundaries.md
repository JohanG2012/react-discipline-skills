# Architecture Boundaries

## Summary
Defines shared architecture and dependency-boundary rules all downstream skills
must enforce.

---

## Rule: Architecture and Dependency Boundaries
**Rule ID:** apv-architecture-boundaries  
**Priority:** MUST  
**Applies to:** __TARGET_SKILL__  
**Inherited from:** shared-rules  
**Rationale:** Ensures all downstream skills enforce one consistent
architecture and import-boundary model.

### Requirement

- The following non-negotiables must be enforced:
  - Do not create new folders unless explicitly allowed by policy or user
    instruction.
  - Never place domain business logic in `ui/**` or `api/**`.
  - Never fetch outside the canonical endpoint layer
    (`api/endpoints/**` or gravity-equivalent API home).
  - Prefer small, composable changes over large refactors.
  - Avoid `shared/` or `common/` dumping-ground patterns.
- Dependency direction must remain consistent with the baseline:
  - `ui/**` must not import `features/**`, `api/**`, `store/**`, or `pages/**`.
  - `api/**` must not import React, `ui/**`, `features/**`, `pages/**`, or
    `store/**`.
  - `features/**` must not import `pages/**`.
  - `pages/**` must not import canonical endpoint modules directly.
  - `hooks/**` must not import `features/**`, `pages/**`, or `store/**`; imports
    from `api/**` are allowed only when documented in exactly one canonical
    policy location.
- The canonical endpoint layer must be determined once per task by Architecture
  Detection and reused consistently in boundary checks for that task.
- If a path alias exists (for example `@/`), all boundary rules apply equally to
  alias imports and raw `src/**` imports.
- Generic fetch-hook exceptions are valid only when documented in exactly one
  canonical policy location; multiple policy locations invalidate the exception.
- No second home may be introduced for the same concern (UI/API/store/routing)
  unless explicit migration scope is approved.

### Forbidden

- Competing homes for the same concern in the same scope.
- Domain terms in reusable `ui/**` component file names.
- DTO-to-domain mapping in `api/**`.

### Notes

- Architecture Detection owns gravity decisions; downstream skills inherit those
  decisions unless a valid pause is triggered.
