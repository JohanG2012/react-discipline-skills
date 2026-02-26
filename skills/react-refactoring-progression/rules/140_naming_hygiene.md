# Naming Hygiene

## Summary

Defines deterministic naming-hygiene checks for refactor plans so component/file
naming remains searchable, layer-aligned, and domain-safe.

---

## Rule: Refactor — Naming Hygiene and Correct Placement
**Rule ID:** rrf-naming-hygiene  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents naming drift and misplaced ownership during refactors by
aligning with established naming contracts.

### Requirement

- Treat naming as incorrect/suspect when any is true:
  - component primary export name does not match defining file name (except
    framework-required defaults),
  - domain-named components are placed under `ui/**`,
  - suffix/name does not match responsibility:
    - route orchestrators missing `*Page` convention (or framework route
      equivalent),
    - domain-aware orchestration not using section/panel conventions,
    - reusable UI patterns using domain nouns instead of role/pattern names,
  - hooks not using `use*` naming,
  - DTO naming/contracts violating `*.dto.ts` or `*Dto` conventions in areas
    where they apply,
  - mixed naming dialect in one area (for example unstable mixing of
    `*Shell`/`*Layout`/`*Scaffold` without local convention),
  - junk-drawer naming that hides responsibility (`Common*`, `Shared*`,
    `Utils*`, `Helper*`, `Wrapper*`, `Thing*`, etc.).
- For suspect naming, refactor should evaluate smallest compliant action in this
  order:
  1. rename file/export to match one-file one-primary-export contract,
  2. rename component to responsibility-aligned, domain-agnostic pattern name
     when in `ui/**`,
  3. relocate ownership to correct layer when domain naming reveals domain
     behavior ownership,
  4. keep local convention where explicit gravity/local standard exists instead
     of introducing a second dialect,
  5. stop/block and return scoped expansion request when correction requires
     broad migration or scope-cap breach.
- Any accepted naming refactor must preserve behavior and remain within current
  scope-governor limits.
- Refactor naming decisions must be consistent with:
  - `rid-naming-discoverability` from
    `react-implementation-discipline/rules/150_naming_discoverability.md`
  - `sr-ownership-naming` from `shared/rules/40_ownership_naming.md`.

### Forbidden

- Renaming for style preference only when no ownership/discoverability issue
  exists.
- Introducing new naming vocabularies in a local area with clear existing
  convention.
- Keeping domain semantics in shared UI names to avoid moving ownership.
- Performing churn-heavy rename waves outside approved scope.

### Notes

- Naming corrections should optimize ripgrep discoverability and ownership
  clarity first; cosmetic consistency is secondary.
