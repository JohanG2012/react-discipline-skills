# No `views` Taxonomy in Features

## Summary
Prevents MVC-style drift and parallel presentation taxonomies inside feature
folders.

---

## Rule: No `views/` or `*View` in Features
**Rule ID:** sr-no-feature-views  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps presentation ownership deterministic across pages,
sections, and components without introducing duplicate view layers.
**Covers:** No views/ or *View in Features.
**Index mode:** reference

### Requirement

- `features/**` must not contain `views/` folders.
- Files inside `features/**` must not use `*View` naming.
- Route-pointed components belong in `pages/**`, not `features/**`.
- Domain-aware UI orchestration in features must use:
  - `sections/**` for orchestration-level UI,
  - `components/**` (or `widgets/**` only when explicitly standardized) for
    feature-owned leaf UI.
- If repository already uses `views/` as established gravity, follow migration
  rules for existing architecture rather than creating mixed taxonomies.
- Do not keep both `sections/` and `views/` in the same feature.
- Do not rename `sections/` to `views/` in greenfield architecture.

### Forbidden

- `features/<domain>/views/**` folders.
- `*View` file names inside `features/**`.
- Route-level feature containers named/organized as views.
- Parallel `sections/` + `views/` presentation homes within one feature.
