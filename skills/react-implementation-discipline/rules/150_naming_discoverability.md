# Naming and Discoverability

## Summary
Defines deterministic naming rules for Skill 4 so ownership stays obvious,
discoverability stays high, and layer leakage is prevented.

---

## Rule: Naming and Discoverability Contract
**Rule ID:** rid-naming-discoverability  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Consistent naming keeps ownership obvious, prevents layer
leakage, improves searchability, and makes duplicate patterns easier to detect.

### Requirement

#### A) One file = one primary export = same name

- Every new React component file must export one primary component whose name
  matches the file name.
  - `UserProfileSection.tsx` -> `export function UserProfileSection() { ... }`
- Prefer named exports for components, hooks, and utilities.
- Allow default exports only when framework conventions require them (for
  example Next route modules) or local folder convention already uses defaults.

#### B) Component names must encode layer and responsibility

- Pages/routes:
  - use `*Page` (or framework-required file names such as `page.tsx`)
  - meaning: route entry and orchestration only
- Feature orchestration (domain-aware UI):
  - use `*Section`
  - meaning: domain composition of UI and feature hooks; local UI state is
    allowed
- UI patterns (domain-agnostic reusable composition):
  - use `*Shell`, `*Layout`, or `*Scaffold`
  - use one term consistently in the repo (default: `*Shell`)
  - use role names like `*Toolbar`, `*FilterBar`, `*Header`, `*Footer` when
    they describe stable reusable pattern roles
- Boundaries and async states:
  - use `*Boundary` (`DataStateBoundary`, `AsyncBoundary`, `ErrorBoundary`)
  - boundary components handle UI states only, not data fetching
- Forms:
  - full form: `*Form`
  - form subsection: `*FormSection`
  - reusable field wrapper: `*Field` (domain-agnostic only)
- Modals/dialogs:
  - use `*Dialog` or `*Modal`
  - pick one term consistently (default: `*Dialog`)
  - destructive confirmation patterns: `Confirm*Dialog`
- List/table presentation:
  - use `*List` / `*Table` only for domain-agnostic reusable components
  - if domain-aware, prefer `*Section` or `*Panel` in feature scope
- Panels:
  - use `*Panel` for contained sub-regions with local state
  - prefer `Panel` over ambiguous `Container` naming

#### C) Domain terms are forbidden in `ui/**`

- Components in `ui/primitives/**` or `ui/composites/**` must not include
  domain nouns (for example `TaskRow`, `ProjectFilters`, `InvoiceCard`).
- If domain nouns are required, ownership belongs in `features/<domain>/**`.

#### D) Avoid ambiguous junk-drawer names

- Do not create new components named:
  - `Common*`
  - `Shared*`
  - `Utils*`
  - `Helper*`
  - `Component*`
  - `Wrapper*`
  - `Thing*`
- Reusable components must be named by responsibility (for example `FilterBar`,
  `DataStateBoundary`, `FormSectionShell`).

#### E) Hooks and non-components

- Hooks must be named `useXxx`.
- Hook placement:
  - `features/<domain>/hooks/useXxx.ts` for feature-owned hooks
  - `hooks/useXxx.ts` for generic cross-domain hooks only
- API endpoint modules must be resource-oriented
  (for example `api/endpoints/projects.ts`).
- DTO types must use `*Dto` suffix.

#### F) Follow gravity and local convention when conflicts exist

- If local folder conventions already exist (for example `Screens` instead of
  `Pages`), follow local convention in that area.
- Do not introduce a second naming dialect in the same area.

#### Suffix decision tree (fast checklist)

1. route entry -> `*Page` (or framework route file name)
2. domain-aware UI orchestration -> `*Section` (or `*Panel` for sub-region)
3. reusable domain-agnostic UI pattern -> `*Shell` (default), otherwise
   `*Layout` only if local convention already uses it
4. loading/error/empty or error wrapper -> `*Boundary`
5. forms:
   - full form -> `*Form`
   - subsection -> `*FormSection`
   - reusable domain-agnostic field wrapper -> `*Field`
6. dialog/modal -> `*Dialog` (default); destructive confirm -> `Confirm*Dialog`
7. small dumb building block -> no suffix (`Button`, `Input`, `Card`, `Badge`,
   `Icon`)
8. list/table:
   - reusable domain-agnostic -> `*List` / `*Table`
   - domain-aware -> prefer `*Section` / `*Panel`
9. if name contains domain nouns and target is `ui/**`, stop and keep in
   `features/**` or make truly domain-agnostic

#### Allowed suffix vocabulary (recommended)

- route layer: `Page`
- feature layer: `Section`, `Panel`
- ui composites/patterns: primary `Shell`; allowed only by local convention
  `Layout`, `Scaffold`
- async/state handling: `Boundary`
- forms: `Form`, `FormSection`, `Field` (domain-agnostic only)
- dialogs: `Dialog` (preferred), `Modal` (only if local convention already uses it)
- structural roles: `Header`, `Footer`, `Toolbar`, `FilterBar`,
  `Pager` or `Pagination` (pick one), `Tabs`
- data display (domain-agnostic only): `List`, `Table`, `Row`, `Card`

### Forbidden

- Creating a component whose primary export name does not match the file name
  unless framework behavior requires it.
- Introducing a second naming vocabulary within the same local area (for
  example arbitrary mixing of `*Shell` and `*Layout`).
- Placing domain-named components under `ui/**`.
- Naming reusable components with junk-drawer prefixes:
  `Common*`, `Shared*`, `Utils*`, `Helper*`, `Wrapper*`, `Component*`,
  `Thing*`, `Base*`.

### Notes

- Naming should optimize ripgrep discoverability: searching the exported
  component name should find the defining file quickly.
- For duplicate pattern extraction, prefer pattern names (for example
  `DataStateBoundary`, `FilterBarShell`) over domain names.
