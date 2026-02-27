# Type Assertion Discipline (`as T`)

## Summary
Allows narrow, locally provable assertions while forbidding assertion-driven
type lies across boundaries and domain models.

---

## Rule: Type Assertion Discipline (`as T`)
**Rule ID:** sr-types-assertion-discipline  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Allow necessary inference help without enabling type lies that
bypass boundaries, validation, and domain integrity.

### Requirement

- Definitions:
  - type assertion: `expr as T` (excluding `as const` literal narrowing),
  - external data: DTO/JSON payloads, untyped third-party values, `unknown`
    inputs, storage reads, and runtime data not guaranteed by TypeScript.
- Default stance:
  - non-`const` assertions (`as T`) are allowed when they reflect runtime
    reality and respect layer boundaries,
  - assertions are allowed only when narrowing or expressing known runtime truth
    that TypeScript cannot infer,
  - assertions must not coerce incompatible shapes or bypass validation.
- Green / OK cases:
  - narrowing where TypeScript cannot track local truth but runtime checks and
    context establish it (for example event/ref narrowing),
  - framework/library interop where upstream types are broader than effective
    runtime shape,
  - `as const`-adjacent narrowing assistance that does not alter semantic
    runtime shape ownership.
- Yellow cases (allowed with discipline, require scrutiny):
  - asserting API payload shape without validation (prefer `unknown` plus
    parse/guard),
  - asserting union member without checking discriminator/guard first.
- Allowed usage (narrowing-safe and locally provable):
  - DOM/event/ref narrowing after guards/invariant checks,
  - library/framework interop where upstream types are broader and safer
    alternatives are impractical,
  - narrowing an already-validated value (schema parse, type guard result).
- Scope rule:
  - apply assertion to the smallest possible expression.
- Boundary rule for external data:
  - do not assert external data directly to semantic/domain types,
  - treat external input as `unknown` (or DTO type),
  - validate/narrow via runtime schema checks or explicit guards/assert helpers,
  - map validated values to canonical domain models in feature boundary,
  - canonical domain types must come from validation plus mapping, not raw
    assertion,
  - do not propagate asserted external shapes across feature/domain boundaries.
- Prefer these alternatives before assertion:
  1. proper narrowing (`in`, discriminants, type guards),
  2. helper functions with narrowing-aware return types,
  3. runtime validation at DTO/form/storage boundaries,
  4. DTO-to-domain mapping.
- Escalation/refactor smell triggers:
  - repeated assertions for same shape problem in a feature,
  - assertions on API payloads or `JSON.parse` outputs,
  - assertions skipping mapping and flowing into domain/sections/pages,
  - assertions used where discriminated unions should exist.
  - when triggered, fix path is guard/validation plus mapping or stronger type
    modeling.
- Relationship to double assertion:
  - `as unknown as T` remains governed by `sr-types-double-assertion` (if
    present in repository policy) as last-resort escape hatch,
  - before double assertion, apply this rule's alternatives and boundary
    constraints first.
- Deterministic default:
  - when uncertain, do not assert; use `unknown` plus narrowing or boundary
    validation plus mapping.

### Forbidden

- Forcing correctness through assertion in:
  - `features/<domain>/domain/**` (domain invariants belong in
    constructors/guards/mappers),
  - `ui/**` shared primitives/composites for data-model coercion,
  - `store/**` state initialization from asserted external shapes.
- Asserting to make a type error disappear without proving runtime truth.
- Asserting union members without prior discriminator/guard evidence.
- Direct `as T` coercion of external data into canonical domain or semantic
  types.
- Assertion-driven bypass of validation and mapping boundaries.
- Assertion sprawl that substitutes for proper union modeling, guards, or
  schema validation.

### Notes

- Narrowing-safe DOM/ref assertions in UI are valid when they follow local
  runtime checks and do not coerce data models.
