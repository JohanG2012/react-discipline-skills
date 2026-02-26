# DOM Rendering and Primitive Discipline

## Summary
Defines deterministic rendering ownership and primitive-creation thresholds to
prevent DOM leakage into logic/data layers and avoid abstraction drift.

---

## Rule: DOM Rendering Boundaries and Primitive Creation Discipline
**Rule ID:** sr-dom-rendering-and-primitives  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Enforces deterministic rendering ownership, prevents DOM leakage
into non-presentation layers, and defines when to introduce reusable UI
primitives versus allowing raw HTML.

### Requirement

- Rendering layer boundaries:
  - only these layers may render JSX/DOM:
    - `ui/primitives/**`
    - `ui/composites/**`
    - `features/*/sections/**`
    - `pages/**`
    - `core/**` (layout composition only, such as app shell/providers)
  - these layers must remain DOM-free (no JSX rendering):
    - `api/**`
    - `lib/**`
    - `store/**`
    - `hooks/**`
    - `config/**`
  - hooks must return state/functions only and never JSX.
- Primitive usage vs raw DOM:
  - when reusable primitives exist (for example `Button`, `Input`, `Card`),
    `features/**/sections/**` and `pages/**` should use them.
  - repeated direct implementations of `<button>`, `<input>`, or `<a>` should
    not bypass existing primitives.
  - raw HTML is allowed when:
    - the element is structural/layout-only (`div`, `section`, `span`, etc.),
    - no suitable primitive exists,
    - usage is truly one-off and not expected to repeat, or
    - usage is highly domain-specific and would leak domain semantics into
      `ui/**`.
- Missing primitive creation threshold:
  - raw DOM may be used temporarily if no suitable primitive exists.
  - create a new primitive in `ui/primitives/**` when any applies:
    - same semantic element pattern appears across two or more
      features/domains,
    - a shared composite needs that element as a building block,
    - two or more near-identical implementations exist with copy-pasted style
      or behavior,
    - multiple call sites independently reimplement accessibility/keyboard/focus
      or label wiring,
    - the element is a core building block (for example button/input/select/
      checkbox/radio/textarea/link/card base/modal base/tabs base/badge/
      tooltip base),
    - styling tokens/classes are repeated to enforce visual consistency.
- Shared UI layer discipline:
  - components in `ui/**` may render valid HTML but must remain domain-agnostic.
  - shared UI must not hardcode domain-specific ARIA labels or domain text.
  - shared UI must not import from `features/**`.
  - shared UI owns semantic correctness, accessibility wiring, and basic visual
    state presentation.
  - shared UI does not own business logic, domain rules, or feature semantics.
- Refactoring enforcement:
  - when DOM appears in invalid layers, refactoring should evaluate:
    1. move JSX to nearest valid presentation layer,
    2. extract reusable primitive when duplication threshold is met,
    3. split logic from markup (`domain/lib` for logic, `sections/ui` for
       markup),
    4. remove duplicated semantic implementations,
    5. replace duplicated raw DOM with shared primitive.
  - refactoring must remain behavior-preserving and within scope-governor
    limits.
- Scope and migration constraints:
  - primitive creation must respect scope caps (default max new files: 4 unless
    explicitly expanded), add no new dependencies, and create no parallel homes.
  - primitive extraction must stay inside existing gravity home
    (`ui/primitives/**`).
  - if extraction exceeds caps, emit `scope_expansion_needed[]` and deliver a
    minimal in-cap safe result first.
- Architectural principle:
  - this rule governs responsibility boundaries, not HTML availability.
  - vanilla HTML is allowed in presentation layers.
  - prefer shared primitives when reuse thresholds are met.
  - never render DOM in logic/data layers.
  - never use raw DOM as a shortcut around established abstractions.

### Forbidden

- Rendering JSX from `hooks/**`, `lib/**`, `store/**`, or `api/**`.
- Duplicating semantic elements already represented by primitives.
- Hardcoding domain semantics inside `ui/**`.
- Creating a new top-level UI home during primitive extraction.
- Introducing new styling systems or UI libraries during primitive creation
  without explicit approval.
- Using primitive extraction as justification for broad migration.

### Notes

- Any JSX detected in DOM-free layers is a structural violation and should be
  treated as high-priority boundary remediation.
