# Discovery and Convention Fit

## Summary
Defines mandatory repository discovery and naming/export convention checks before
final placement output.

---

## Rule: Discovery Coverage and Convention Alignment
**Rule ID:** rpl-discovery-conventions  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Prevents duplicate artifacts and naming drift in placement plans.
**Covers:** Discovery Coverage and Convention Alignment.
**Index mode:** reference

### Requirement

- Discovery must check existing homes before proposing new artifacts:
  - route files/entry points
  - feature sections, hooks, and domain modules
  - UI composites and primitives
  - endpoint and DTO modules
  - store slices and state ownership patterns
  - naming/export conventions in the active area
- Naming and export checks must enforce local consistency:
  - pages: `*Page` unless framework or local conventions require otherwise
  - feature sections: `*Section`
  - hooks: `use*`
  - DTOs: `*Dto` and DTO placement in `api/dto` or the gravity-equivalent home
  - component files/exports in `PascalCase`
  - hook files/exports in `useXxx` camelCase
  - named exports by default; allow default exports only for framework-required
    modules or established local-area conventions
  - avoid introducing new barrels unless the local area already uses them
- Keep names searchable by aligning file names and primary exports.
- Use one role term per area (for example `Page` vs `Route` vs `Screen`) and do
  not mix synonyms unpredictably in one area.
- If tests exist in the target area, follow colocated naming compatibility
  (`*.test.tsx` or `*.test.ts`) for touched artifacts.
- Record concrete discovery evidence (paths) or explicit `not_found` outcomes
  before selecting `create`.

### Forbidden

- Proposing new artifact homes before discovery checks complete.
- Inventing a new naming/export style in an established area.
- Treating naming ambiguity as justification for structural churn.

### Notes

- Convention fit is part of placement correctness, not optional polish.
