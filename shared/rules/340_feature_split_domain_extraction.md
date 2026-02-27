# Umbrella Feature Split and Domain Extraction

## Summary
Prevents umbrella features from becoming mini feature roots with unclear
ownership, rising coupling, and internal parallel taxonomies.

---

## Rule: Umbrella Feature Split and Domain Extraction
**Rule ID:** sr-feature-split-domain-extraction  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevent feature folders from turning into umbrella owners that
hide multiple domains and destabilize placement/reuse boundaries.

### Requirement

- Definitions:
  - umbrella feature: a feature folder that contains multiple domain sub-areas
    and starts acting like a second `features` root,
  - extracted feature: a new `features/<domain>/` owner created to restore
    clear domain ownership.
- Split triggers (extraction is required when any applies):
  - internal domain partitioning resembles multiple first-class features,
  - duplicate layer taxonomies appear inside one feature (for example
    `api/`, `components/`, `hooks/`, `utils/`, `rules/`) while multiple domain
    sub-areas also exist,
  - ownership ambiguity is recurring and the feature becomes a dumping ground,
  - cross-domain coupling grows inside one feature (shared helpers/state/UI
    glue for unrelated sub-areas),
  - reviewability breaks down (changes routinely span unrelated sub-areas).
- Required extraction outcome when triggered:
  - extract each domain sub-area into first-class feature ownership with
    `features/<domain>/sections/**`, `components/**`, `hooks/**`,
    `domain/**` (plus `adapters/**` when needed),
  - reduce original umbrella feature to exactly one of:
    1. route/page orchestration (preferred, usually in `pages/**`), or
    2. thin feature shell with orchestration wiring only.
- Migration-safe extraction protocol:
  1. choose target feature owners first (one owner per sub-area),
  2. move domain logic and adapters before UI,
  3. move feature hooks next,
  4. move feature-owned UI next (sections, then leaf components),
  5. promote shared utilities correctly:
     - `ui/**` for reusable UI patterns,
     - `lib/**` for pure cross-domain helpers,
     - `api/**` remains canonical transport home,
  6. enforce no cross-feature imports after extraction.
- Deterministic default:
  - if uncertain whether a feature is umbrella-shaped, prefer extraction once
    multiple distinct domain sub-areas exist and shared glue is growing,
  - keep orchestration at `pages/**` (or a thin shell), not in a lingering
    umbrella owner.

### Forbidden

- Keeping two active owners for the same concern after split
  (half-umbrella/half-split).
- Creating feature-local transport homes when canonical API home exists (for
  example `features/<x>/api/**` alongside canonical `api/**`).
- Introducing `views/` inside features as a substitute for `sections/`.
- Splitting by technical layer taxonomy (MVC-style) instead of domain ownership.
