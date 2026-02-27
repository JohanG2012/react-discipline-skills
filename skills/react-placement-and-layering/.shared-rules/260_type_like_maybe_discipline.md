# `*Like` and `Maybe<T>` Type Discipline

## Summary
Splits boundary flexibility and optionality semantics into separate rules while
keeping strict domain integrity requirements explicit.

---

## Rule: `*Like` and `Maybe<T>` Discipline Index
**Rule ID:** sr-type-like-maybe  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Preserves backward-compatible entrypoint while delegating to
single-focus type rules.
**Covers:** *Like and Maybe<T> Discipline.
**Index mode:** reference

### Requirement

- When this rule is in scope, follow all of:
  - `sr-type-like-boundary`,
  - `sr-type-maybe-semantics`,
  - `sr-domain-type-integrity`.

### Forbidden

- Applying this index rule without enforcing the referenced type-discipline
  rules.

---

## Rule: `*Like` Boundary Discipline
**Rule ID:** sr-type-like-boundary  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Restricts structural compatibility types to boundary layers.
**Covers:** *Like Boundary Discipline.
**Index mode:** reference

### Requirement

- `*Like` types are allowed only when all are true:
  - they exist in boundary-oriented homes (`api/dto/**`,
    `features/<domain>/adapters/**`, input parsing/normalization layers),
  - they model external or pre-normalized input shape,
  - they are mapped immediately to canonical domain models,
  - they are not exported as canonical domain contracts.
- If a `*Like` type is introduced, all are required:
  - canonical mapped model exists,
  - mapper exists in same feature boundary,
  - mapping occurs before UI rendering or store persistence.

### Forbidden

- Using `*Like` inside `features/<domain>/domain/**`, `store/**`, or shared
  `ui/**`.
- Using `*Like` to avoid defining canonical domain models.
- Passing `*Like` deep into pages/sections without normalization.
- Naming canonical models as `SomethingLike`.

---

## Rule: `Maybe<T>` Semantics Discipline
**Rule ID:** sr-type-maybe-semantics  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Enforces one explicit repository-wide optionality semantic.
**Covers:** Maybe<T> Semantics Discipline.
**Index mode:** reference

### Requirement

- `Maybe<T>` is allowed only when all are true:
  - defined once in a canonical shared location (for example `src/lib/types.ts`),
  - semantics are exactly one of:
    - `type Maybe<T> = T | null`, or
    - `type Maybe<T> = T | undefined`,
  - repository uses one meaning consistently.
- Allowed contexts:
  - API response normalization,
  - feature-boundary pre-validation states,
  - explicit domain states where absence is meaningful.

### Forbidden

- Mixing `null` and `undefined` semantics arbitrarily.
- Using `Maybe<T>` to bypass validation.
- Defining multiple `Maybe` aliases in different modules.

---

## Rule: Domain Type Integrity
**Rule ID:** sr-domain-type-integrity  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps domain-layer contracts strict and canonical.
**Covers:** Domain Type Integrity.
**Index mode:** reference

### Requirement

- In `features/<domain>/domain/**`:
  - types represent validated canonical models,
  - fields are required unless domain semantics explicitly model absence.
- `Maybe<T>` in domain models is allowed only when domain semantics require true
  optional state.
- Treat as architectural smell when:
  - `*Like` appears outside boundaries,
  - `Maybe<T>` appears broadly in `ui/**` or `store/**`,
  - canonical models overuse optional fields without domain justification.
- Deterministic defaults:
  - prefer canonical types with explicit mapping,
  - prefer required domain fields over optional wrappers by default.

### Forbidden

- Replacing canonical domain models with `*Like` types.
- Using `Maybe<T>` to keep post-validation required fields weak.
- Letting domain logic depend on structural compatibility types.
