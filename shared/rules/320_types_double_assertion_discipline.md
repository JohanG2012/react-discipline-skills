# Double Type Assertion Discipline (`as unknown as T`)

## Summary
Constrains double assertions to rare, boundary-scoped escape hatches with
adjacent safety steps and no unsafe propagation.

---

## Rule: Double Type Assertion Discipline (`as unknown as T`)
**Rule ID:** sr-types-double-assertion  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents silencing type errors and leaking unsafe shapes across
boundaries while allowing rare, justified boundary interop.

### Requirement

- Definition:
  - double assertion is any `X as unknown as T` pattern (including equivalent
    two-step `any` cast patterns).
- Default stance:
  - double assertions are forbidden by default,
  - allowed only as last-resort boundary escape hatch.
- Escape hatch is allowed only when all are true:
  1. boundary-only location:
     - `api/dto/**` validation/parsing seams,
     - `features/<domain>/adapters/**`,
     - third-party interop wrappers,
     - legacy typed holes with no immediate safe alternative.
  2. narrow scope:
     - cast is applied to smallest possible expression.
  3. adjacent safety step:
     - same function/file scope includes runtime validation, explicit
       guard/assert helper (`isT`/`assertIsT`), or documented trusted-source
       rationale when validation is infeasible.
  4. no propagation:
     - result is normalized/mapped into canonical type before crossing deeper
       layers (especially before UI rendering or store persistence).
- Preferred alternatives must be attempted first:
  1. type narrowing/guards,
  2. stronger type modeling (generics/overloads/discriminated unions),
  3. runtime validation at boundaries,
  4. DTO-to-domain mapping to canonical types.
  - double assertion is permitted only when alternatives are impractical for
    current scoped change.
- Escalation/refactor smell triggers:
  - multiple double assertions in same feature area,
  - cast coercing DTO directly to domain model without mapping,
  - cast result exported/propagated beyond boundary seam,
  - repeated same cast pattern across call sites.
  - when triggered, add follow-up to replace with guard/assert helper, schema
    validation, or explicit mapping.
- Enforcement heuristics:
  - cast enables field access without validation,
  - cast bypasses known DTO/domain mismatch,
  - cast exists only to satisfy TypeScript with no safety explanation.
- Deterministic default:
  - when uncertain, do not use double assertion; prefer `unknown` plus narrowing
    or explicit mapping.

### Forbidden

- Double assertions in:
  - `ui/**`,
  - `features/<domain>/domain/**`,
  - `pages/**`,
  - `store/**`.
- Using double assertion to suppress type errors without adjacent safety
  evidence.
- Using double assertion as replacement for validation/mapping at boundaries.
- Allowing double-asserted external shapes to propagate across layers.
