# Layout and Shell Placement

## Summary
Defines deterministic placement for layout/shell components and prevents
parallel layout homes.

---

## Rule: Layout and Shell Ownership Decision
**Rule ID:** sr-layout-shell-placement  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Removes ambiguity between `ui/primitives`, `ui/composites`, and
`features/<domain>/sections` for layout-like components.
**Covers:** Layout and Shell Ownership Decision.
**Index mode:** reference

### Requirement

- Place in `ui/primitives/**` only when the component is a low-level building
  block with minimal structure/behavior.
  - Typical primitives: `Stack`, `Box`, `Spacer`, `Grid`, thin `Container`.
- Place in `ui/composites/**` when the component composes multiple primitives
  into a reusable UI pattern.
  - Typical composites: `PageShell`, `ModalShell`, `PanelShell`,
    `MasterDetailLayout`, `AppShell`, `SidebarLayout`, `CardLayout`,
    `TableShell`, `EmptyStatePanel`.
- Place in `features/<domain>/sections/**` when the layout is domain-owned
  composition, even if it looks like a generic layout.
  - Example: project-specific layout section with domain navigation, filters,
    or domain-state behavior.
- Fast decision rule:
  - minimal low-level building block -> primitive
  - reusable composed pattern -> composite
  - domain-owned composition/behavior -> feature section
- This rule applies to all skills and must be enforced most strongly during
  execution in `react-implementation-discipline`.

### Forbidden

- Treating reusable shells/layout patterns as primitives.
- Treating domain-owned layout composition as shared composite by default.
- Using unclear "looks like layout" labeling to bypass domain ownership checks.

### Notes

- If ownership is ambiguous and impact is structural, use shared pause protocol
  thresholds.

---

## Rule: Layout and Shell Subfolder Policy
**Rule ID:** sr-layout-shell-subfolder-policy  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents creation of competing layout homes while allowing
bounded categorization inside composites when needed.
**Covers:** Layout and Shell Subfolder Policy.
**Index mode:** reference

### Requirement

- Default policy: do not create dedicated top-level layout homes for
  `layouts/` or `shells/`.
- If categorization is needed, keep it inside existing composite home:
  - `src/ui/composites/layouts/*`
  - `src/ui/composites/shells/*`
- Allow this subfolder split only when all are true:
  - composite catalog is large/noisy (for example around ten or more layout/shell
    components)
  - repository already uses category subfolders inside `ui/**`
  - split does not create a competing second home
- Folderization/categorization must preserve existing gravity home and
  one-home-per-concern discipline.

### Forbidden

- Creating a parallel top-level home like `src/ui/layouts/*` or
  `src/ui/shells/*` by default.
- Using category split to bypass migration-scope rules.
- Introducing both `ui/composites/*` and new top-level `ui/layouts/*` as active
  homes for the same concern.
