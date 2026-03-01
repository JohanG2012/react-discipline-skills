# Ownership and Naming

## Summary
Defines shared ownership boundaries and naming conventions for downstream skill
specifications.

---

## Rule: Ownership and Naming Contract
**Rule ID:** sr-ownership-naming  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps responsibility boundaries and naming deterministic across
all downstream specs.
**Covers:** Ownership and Naming Contract.
**Index mode:** reference

### Requirement

- `pages/**` remain thin route orchestrators.
- `features/**` own domain behavior, feature hooks, and domain mapping.
- `ui/primitives/**` and `ui/composites/**` stay domain-agnostic.
- Components in `ui/**` must use domain-agnostic names:
  - file base name and primary export must not encode feature/domain/capability
    owner nouns.
- `api/**` stays transport-only and returns DTOs or normalized errors.
- `store/**` is global client-state only; do not mirror server-state without
  explicit justification.
- Naming conventions must remain deterministic:
  - `*Page.tsx` for pages.
  - `*Section.tsx` for feature sections.
  - `use*.ts` for hooks.
  - `*.dto.ts` and `*Dto` for DTOs.
- Naming and exports must remain searchable and consistent:
  - Prefer matching file/export names.
  - Prefer named exports unless framework conventions require default exports.
  - Avoid introducing barrel files unless the local area already uses them
    consistently.
- If a feature-owned component is generalized for cross-domain reuse:
  - do not keep domain-specific file/export naming,
  - rename to a domain-agnostic responsibility/pattern name before or with move
    to `ui/**`.
- If a feature component is reused across capabilities or domains, perform
  explicit `ui/**`-fit assessment (ownership, dependencies, naming); promote to
  `ui/**` when it qualifies.

### Forbidden

- Domain mode flags in shared composites.
- Domain-specific file names or primary export names in `ui/**`.
- Introducing new naming schemes when local patterns are clear.
- API transport concerns in UI or generic hook layers.
- Mixed synonym vocabularies for the same role in the same scope (for example
  mixing `Page` and `Route` naming without existing convention).
- Keeping cross-capability/cross-domain reusable components in feature homes
  without a `ui/**` suitability assessment.
