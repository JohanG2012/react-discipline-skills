# Component Folderization

## Summary
Defines when components and transport client modules should remain single-file
versus decomposed/folderized, and how extracted modules must be structured and
named.

---

## Rule: Component and Client Module Folderization Threshold
**Rule ID:** sr-component-folderization  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps UI modules and transport clients maintainable without
creating mega files or mixed-responsibility endpoints.

### Requirement

- Keep a component as a single file when all are true:
  - file is about `<= 200` lines and has one clear responsibility
  - helpers are small and render-support only
  - there are at most two closely related internal subcomponents
- Keep a transport client module as a single file when all are true:
  - file stays focused on shared transport concerns (request wrapper,
    auth/header wiring, transport error normalization),
  - endpoint/domain-specific call orchestration is not embedded in the client
    file,
  - file is reasonably small (about `<= 250` lines).
- Folderize (move to a component module folder) when any is true:
  1. file is about `> 250-300` lines and splitting reduces responsibilities
  2. component contains three or more meaningful internal subcomponents
  3. non-trivial local logic should be isolated (mapping/formatting, keyboard
     handling, complex derived state)
  4. it has component-scoped assets (styles/icons/constants)
  5. it is reused broadly and needs a stable module boundary
- Decompose transport client logic when any is true:
  1. canonical client file grows to about `> 250-300` lines and mixes concerns,
  2. endpoint-specific URLs/methods/payload shaping accumulate in the client
     file,
  3. multiple domain endpoint calls are orchestrated from one client file.
- Hard rule:
  - if a single component file exceeds `400` lines, folderization is required
    unless explicitly justified in output notes and/or review metadata.
  - if a transport client file (for example `api/client/client.ts`) exceeds
    `400` lines, extraction is required unless explicitly justified in output
    notes and/or review metadata.
- Expected extraction target for oversized transport client files:
  - endpoint/domain call functions must be extracted to `api/endpoints/**` or
    the repository's gravity-equivalent canonical endpoint home,
  - `api/client/**` remains a thin transport foundation (request wrapper,
    auth/header wiring, retry policy, normalized transport errors).
- This rule applies across skills and is enforced most strongly in
  `react-implementation-discipline` during execution output validation.

### Forbidden

- Keeping oversized multi-responsibility component files as single files without
  explicit justification.
- Treating folderization as optional when the hard threshold is crossed.
- Keeping endpoint-specific call orchestration in a mega transport client file
  instead of extracting to `api/endpoints/**` (or gravity-equivalent endpoint
  home).

### Notes

- Quick folderization heuristic: folderize when any is true:
  - file has two or more responsibilities
  - splitting subcomponents would improve clarity
  - helper pile is component-local only
  - file is above about `300` lines and still growing
- Quick transport-client heuristic: when the shared client starts accumulating
  endpoint paths, payload shaping, and domain branching, extract those calls to
  `api/endpoints/**` (or gravity-equivalent endpoint home) and keep the client
  thin.

---

## Rule: Folder Structure for a Folderized Component
**Rule ID:** sr-component-folder-structure  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents random folder soup and keeps discovery/search
predictable.

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
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps imports stable and grep-friendly.

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
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents leaking component-specific helpers into global utility
layers.

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
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents second-architecture drift.

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
