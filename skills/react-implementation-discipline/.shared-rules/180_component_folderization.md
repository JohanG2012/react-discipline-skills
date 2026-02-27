# Component Folderization

## Summary
Defines when components and transport client modules should remain single-file
versus decomposed/folderized, and how extracted modules must be structured and
named.

---

## Rule: Component and Client Module Folderization Threshold Index
**Rule ID:** sr-component-folderization  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Preserves a stable entrypoint while delegating to focused
component and client-threshold rules.
**Covers:** Component and Client Module Folderization Threshold.
**Index mode:** reference

### Requirement

- When this rule is in scope, enforce both:
  - `sr-component-file-threshold`,
  - `sr-client-module-threshold`.

### Forbidden

- Treating this index rule as sufficient without enforcing the referenced
  threshold rules.

---

## Rule: Component File Folderization Threshold
**Rule ID:** sr-component-file-threshold  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps components maintainable by triggering folderization when
size/responsibility thresholds are exceeded.
**Covers:** Component File Folderization Threshold.
**Index mode:** reference

### Requirement

- Keep a component as a single file when all are true:
  - file is about `<= 200` lines and has one clear responsibility,
  - helpers are small and render-support only,
  - there are at most two closely related internal subcomponents.
- Folderize component modules when any is true:
  1. file is about `> 250-300` lines and splitting reduces responsibilities,
  2. component contains three or more meaningful internal subcomponents,
  3. non-trivial local logic should be isolated (mapping/formatting, keyboard
     handling, complex derived state),
  4. it has component-scoped assets (styles/icons/constants),
  5. it is reused broadly and needs a stable module boundary.
- Hard rule:
  - if a single component file exceeds `400` lines, folderization is required
    unless explicitly justified in output notes and/or review metadata.
- Quick heuristic:
  - folderize when file has multiple responsibilities and is above about
    `300` lines and still growing.

### Forbidden

- Keeping oversized multi-responsibility component files as single files without
  explicit justification.
- Treating component folderization as optional after the hard threshold is
  crossed.

---

## Rule: Transport Client Module Threshold
**Rule ID:** sr-client-module-threshold  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents mega transport clients by keeping endpoint orchestration
out of shared client foundations.
**Covers:** Transport Client Module Threshold.
**Index mode:** reference

### Requirement

- Keep a transport client module as a single file when all are true:
  - it stays focused on shared transport concerns (request wrapper, auth/header
    wiring, transport error normalization),
  - endpoint/domain-specific call orchestration is not embedded in client file,
  - file is reasonably small (about `<= 250` lines).
- Decompose transport client logic when any is true:
  1. canonical client file grows to about `> 250-300` lines and mixes concerns,
  2. endpoint-specific URLs/methods/payload shaping accumulate in client file,
  3. multiple domain endpoint calls are orchestrated from one client file.
- Hard rule:
  - if a transport client file (for example `api/client/client.ts`) exceeds
    `400` lines, extraction is required unless explicitly justified in output
    notes and/or review metadata.
- Expected extraction target:
  - endpoint/domain call functions must be extracted to `api/endpoints/**` or
    gravity-equivalent canonical endpoint home,
  - `api/client/**` remains a thin transport foundation (request wrapper,
    auth/header wiring, retry policy, normalized transport errors).

### Forbidden

- Keeping endpoint-specific call orchestration in mega transport client files.
- Treating transport extraction as optional after hard threshold exceedance.

---

## Rule: Folder Structure for a Folderized Component
**Rule ID:** sr-component-folder-structure  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents random folder soup and keeps discovery/search
predictable.
**Covers:** Folder Structure for a Folderized Component.
**Index mode:** reference

### Requirement

- Default required structure for folderized component `ProjectSelector`:

```text
ProjectSelector/
  ProjectSelector.tsx
  index.ts            (optional; only when local area already uses barrels)
```

- Allowed colocated files must be component-scoped only:
  - `ProjectSelector.utils.ts` (component-local pure helpers)
  - `ProjectSelector.types.ts` (component-local types)
  - `ProjectSelector.constants.ts` (component-local constants)
  - `ProjectSelector.styles.module.css` (or local styling per repo convention)
  - `ProjectSelector.test.tsx` (component tests)
- `components/` subfolder is allowed only when module size/complexity justifies
  it and subcomponents remain component-local.

### Forbidden

- Adding transport/backend access layers (`api/`) inside a component folder.
- Adding cross-domain generic utility buckets (for example `utils/` junk drawer
  subfolders).
- Placing shared primitives inside component-owned folders (shared primitives
  belong in `ui/primitives/**`).

---

## Rule: Naming and Exports Inside Folderized Components
**Rule ID:** sr-component-folder-exports  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps imports stable and grep-friendly.
**Covers:** Naming and Exports Inside Folderized Components.
**Index mode:** reference

### Requirement

- Main component file must match folder name and primary export:
  - `ProjectSelector/ProjectSelector.tsx` exports `ProjectSelector`.
- Import style:
  - prefer explicit import path to main file, or
  - folder import only when `index.ts` exists and local area already uses
    barrels.
- Subcomponents should carry module prefix (for example
  `ProjectSelectorItem`, `ProjectSelectorDropdown`) for searchability.

### Forbidden

- Random unprefixed subcomponent names like `Item.tsx` and `Dropdown.tsx`.
- Introducing new barrel patterns in areas that do not already use them.

---

## Rule: Promotion and Demotion for Component Helpers
**Rule ID:** sr-component-helper-promotion  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents leaking component-specific helpers into global utility
layers.
**Covers:** Promotion and Demotion for Component Helpers.
**Index mode:** reference

### Requirement

- Move helper from component folder to `lib/**` only when both are true:
  - helper is reused by two or more domains/features
  - helper is pure (no React imports and no feature/domain knowledge)
- Move helper to `features/<domain>/domain/**` when helper encodes domain
  behavior, even if used across multiple files within that feature.
- Keep component-local helpers colocated when reuse and purity thresholds for
  promotion are not met.

### Forbidden

- Promoting helpers to `lib/**` solely because the source component file is
  large.
- Promoting domain-aware helpers to `lib/**`.

---

## Rule: Folderization Must Not Create a New Home
**Rule ID:** sr-folderization-no-new-home  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents second-architecture drift.
**Covers:** Folderization Must Not Create a New Home.
**Index mode:** reference

### Requirement

- Folderization must stay inside existing gravity home:
  - if component is under `src/components/**`, folderized module stays there
  - if component is feature-owned, folderized module stays in that feature path
- Folderization must preserve current concern ownership and import-boundary
  rules.
- Relocation across homes during folderization is allowed only in explicit
  migration mode with clear boundary scope.

### Forbidden

- Using folderization as justification to create a new top-level `ui/`,
  `shared/`, or other competing concern home.
- Silent home relocation under the guise of formatting/refactor-only work.
