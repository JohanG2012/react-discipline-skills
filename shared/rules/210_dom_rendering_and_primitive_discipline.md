# DOM Rendering and Primitive Discipline

## Summary
Defines rendering boundaries, primitive-creation thresholds, and shared-UI
domain discipline as separate concerns.

---

## Rule: DOM Rendering and Primitive Discipline Index
**Rule ID:** sr-dom-rendering-and-primitives  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Preserves backward-compatible entrypoint while delegating
enforcement to narrowly scoped rules.

### Requirement

- When this rule is in scope, follow all of:
  - `sr-dom-rendering-boundaries`,
  - `sr-primitive-creation-threshold`,
  - `sr-shared-ui-domain-discipline`.

### Forbidden

- Treating this index rule as sufficient without enforcing the referenced
  detailed rules.

---

## Rule: DOM Rendering Boundaries
**Rule ID:** sr-dom-rendering-boundaries  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents JSX/DOM leakage into logic/data layers.

### Requirement

- Only these layers may render JSX/DOM:
  - `ui/primitives/**`
  - `ui/composites/**`
  - `features/*/sections/**`
  - `pages/**`
  - `core/**` (layout composition only, such as app shell/providers)
- These layers must remain DOM-free:
  - `api/**`
  - `lib/**`
  - `store/**`
  - `hooks/**`
  - `config/**`
- Hooks must return state/functions only and must not render JSX.

### Forbidden

- Rendering JSX from `api/**`, `lib/**`, `store/**`, `hooks/**`, or `config/**`.

---

## Rule: Primitive Creation Threshold and Raw DOM Usage
**Rule ID:** sr-primitive-creation-threshold  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps raw DOM use pragmatic while preventing repeated semantic
reimplementation.

### Requirement

- Prefer existing reusable primitives (for example `Button`, `Input`, `Card`)
  before adding repeated raw semantic elements.
- Raw HTML is allowed when any is true:
  - element is structural/layout-only (`div`, `section`, `span`, etc.),
  - no suitable primitive exists,
  - usage is one-off and not expected to repeat,
  - usage is highly domain-specific and should not leak into `ui/**`.
- Create a primitive in `ui/primitives/**` when any is true:
  - the same semantic element pattern appears across 2+ features/domains,
  - a shared composite needs it as a building block,
  - 2+ near-identical implementations copy style/behavior,
  - accessibility/keyboard/focus/label wiring is repeatedly reimplemented,
  - it is a core UI building block (for example button/input/select/checkbox/
    radio/textarea/link/card/modal/tabs/badge/tooltip base),
  - repeated styling tokens/classes are used to enforce consistency.

### Forbidden

- Duplicating semantic elements already represented by existing primitives.
- Bypassing existing primitives with repeated ad-hoc raw semantic controls.

---

## Rule: Shared UI Domain Discipline
**Rule ID:** sr-shared-ui-domain-discipline  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps shared UI reusable and prevents domain/transport leakage.

### Requirement

- Components in `ui/**` may render valid HTML but must remain domain-agnostic.
- Shared UI must not import from `features/**`.
- Shared UI owns:
  - semantic correctness,
  - accessibility wiring,
  - basic visual state presentation (disabled/loading/selected).
- Shared UI does not own:
  - business logic,
  - domain rules,
  - feature semantics.
- When invalid placement is detected, refactoring should:
  1. move JSX into valid presentation layers,
  2. split logic from markup (`domain/lib` for logic, `sections/ui` for markup),
  3. prefer behavior-preserving extraction within active scope.

### Forbidden

- Hardcoding domain semantics in shared `ui/**`.
- Using shared UI as a transport or business-logic owner.
- Introducing new top-level UI homes while remediating domain leakage.
