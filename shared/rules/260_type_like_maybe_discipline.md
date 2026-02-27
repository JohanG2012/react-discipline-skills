# `*Like` and `Maybe<T>` Type Discipline

## Summary
Defines hard governance for boundary-only structural looseness (`*Like`) and
optionality wrappers (`Maybe<T>`), while protecting canonical domain integrity.

---

## Rule: `*Like` and `Maybe<T>` Type Discipline
**Rule ID:** sr-type-like-maybe  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents vague pseudo-types in domain layers while allowing safe
boundary flexibility.

### Requirement

- Intent:
  - structural looseness (`*Like`) and optionality wrappers (`Maybe<T>`) are
    boundary tools, not substitutes for canonical domain models.
- Definitions:
  - `*Like` type: structural compatibility type (for example `UserLike`).
  - `Maybe<T>`: wrapper representing explicit optionality semantics.
  - canonical domain model: authoritative type in
    `features/<domain>/domain/**`.
- `*Like` usage policy:
  - allowed only when all are true:
    - it exists in `api/dto/**`, `features/<domain>/adapters/**`,
      form/input parsing layers, or pure utility input-normalization functions,
    - it represents external or pre-normalized input shapes,
    - it is mapped immediately into a canonical domain model,
    - it is not exported as a primary domain contract.
  - if introduced, all are required:
    - a canonical model it maps to exists,
    - a mapper function exists in the same feature boundary,
    - mapping occurs before UI rendering or store persistence.
- `Maybe<T>` usage policy:
  - allowed only when all are true:
    - it is defined once in a canonical shared location (for example
      `src/lib/types.ts`),
    - semantics are exactly one of:
      - `type Maybe<T> = T | null`, or
      - `type Maybe<T> = T | undefined`,
    - repository-wide usage is consistent with only one of those semantics.
  - allowed contexts:
    - API response normalization,
    - feature-boundary pre-validation states,
    - explicit domain states where absence is meaningful.
- Domain layer integrity (`features/<domain>/domain/**`):
  - types must represent fully validated canonical models,
  - fields should be required unless domain semantics truly model absence,
  - `*Like` is prohibited,
  - `Maybe<T>` is permitted only when domain semantics require true optional
    state.
- Enforcement heuristics:
  - treat as architectural smell when:
    - `*Like` appears outside boundary layers,
    - `Maybe<T>` appears broadly in `ui/**` or `store/**`,
    - canonical models overuse optional fields (`?`) without domain
      justification,
    - a `*Like` type is passed directly into UI without normalization.
- Decision defaults:
  - prefer canonical type plus explicit mapping,
  - prefer required domain fields over `Maybe<T>`,
  - prefer in-place explicit union (`T | null`) over introducing `Maybe<T>`
    unless it improves repository-wide consistency.
- Hard stop conditions:
  - stop and revise when:
    - canonical domain model is replaced by a `*Like` type,
    - multiple `Maybe<T>` definitions exist,
    - domain logic depends on structural `*Like` types.

### Forbidden

- `*Like` types inside:
  - `features/<domain>/domain/**`,
  - `store/**`,
  - shared `ui/**`.
- Using `*Like` to avoid defining canonical domain models.
- Passing `*Like` deep into feature sections/pages without normalization.
- Naming canonical domain models as `SomethingLike`.
- Mixing `null` and `undefined` semantics arbitrarily for `Maybe<T>`.
- Using `Maybe<T>` to avoid validation or to keep post-validation required
  domain fields weak.
- Defining multiple `Maybe` types across modules.

### Notes

- Short philosophy:
  - `*Like` = boundary flexibility.
  - `Maybe<T>` = semantic absence.
  - Domain models = strict canonical contracts.
  - UI/store layers = never vague about domain shape.
