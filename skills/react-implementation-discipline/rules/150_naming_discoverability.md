# Naming and Discoverability

## Summary
Defines implementation naming governance as focused rules so ownership,
searchability, and layer boundaries remain explicit.

---

## Rule: Naming and Discoverability Contract Index
**Rule ID:** rid-naming-discoverability  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Preserves stable entrypoint while delegating to single-focus
naming rules.

### Requirement

- When this rule is in scope, enforce all of:
  - `rid-file-export-alignment`,
  - `rid-component-role-naming`,
  - `rid-naming-boundary-hygiene`,
  - `rid-hook-endpoint-type-naming`.

### Forbidden

- Treating this index rule as sufficient without enforcing the referenced naming
  rules.

---

## Rule: File and Export Naming Alignment
**Rule ID:** rid-file-export-alignment  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Keeps files grep-friendly and ownership obvious.

### Requirement

- Each new React component file must export one primary component with matching
  name:
  - `UserProfileSection.tsx` -> `export function UserProfileSection()`.
- Prefer named exports for components, hooks, and utilities.
- Allow default exports only when:
  - framework behavior requires them, or
  - local area convention already uses them consistently.

### Forbidden

- Mismatched component file and primary export names without framework-required
  exception.
- Introducing default exports as a new convention in areas that are named-export
  oriented.

---

## Rule: Component Role Naming
**Rule ID:** rid-component-role-naming  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Makes layer responsibility explicit from component names.

### Requirement

- Route orchestration components use `*Page` (or framework-required route files).
- Domain-aware feature orchestration uses `*Section` (or `*Panel` for contained
  sub-regions).
- Domain-agnostic reusable UI patterns use one consistent composite term
  (default `*Shell`, with local-convention `*Layout`/`*Scaffold` only when
  already established).
- Async/error/loading wrappers use `*Boundary`.
- Form naming:
  - full form: `*Form`,
  - subsection: `*FormSection`,
  - reusable domain-agnostic wrapper: `*Field`.
- Dialog naming:
  - default `*Dialog` (or `*Modal` only when local convention already uses it),
  - destructive confirmation: `Confirm*Dialog`.
- `*List`/`*Table` names are for domain-agnostic reusable components; domain-
  aware list/table UI should remain feature-owned (`*Section`/`*Panel`).

### Forbidden

- Mixing naming dialects in the same area (for example arbitrary `*Shell` and
  `*Layout` mixing without local convention).
- Using suffixes that hide route/feature/shared ownership intent.

---

## Rule: Naming Boundary Hygiene
**Rule ID:** rid-naming-boundary-hygiene  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Prevents domain leakage and junk-drawer naming drift.

### Requirement

- Components in `ui/primitives/**` or `ui/composites/**` must not contain domain
  nouns (for example `TaskRow`, `ProjectFilters`, `InvoiceCard`).
- If domain nouns are required, ownership stays in `features/<domain>/**`.
- Reusable components must be named by responsibility (for example `FilterBar`,
  `DataStateBoundary`), not vague prefixes.
- Follow existing local naming convention when it already exists (for example
  `Screens` area naming), and keep one dialect per area.

### Forbidden

- Placing domain-named components under `ui/**`.
- Introducing junk-drawer names such as:
  - `Common*`, `Shared*`, `Utils*`, `Helper*`, `Wrapper*`, `Component*`,
    `Thing*`, `Base*`.
- Introducing a second naming dialect in one local area.

---

## Rule: Hook, Endpoint, and DTO Naming
**Rule ID:** rid-hook-endpoint-type-naming  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Keeps non-component artifacts predictable and discoverable.

### Requirement

- Hooks must use `useXxx` naming.
- Hook placement:
  - `features/<domain>/hooks/useXxx.ts` for feature-owned hooks,
  - `hooks/useXxx.ts` for generic cross-domain hooks only.
- API endpoint modules should be resource-oriented (for example
  `api/endpoints/projects.ts`).
- DTO types should use `*Dto` suffix.

### Forbidden

- Non-`useXxx` hook naming.
- Resource-agnostic endpoint module naming that obscures ownership.
- DTO naming that drifts from `*Dto` in established areas.

### Notes

- Naming should optimize ripgrep discoverability and quick ownership diagnosis.
