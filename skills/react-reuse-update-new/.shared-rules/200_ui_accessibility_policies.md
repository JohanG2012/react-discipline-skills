# UI Extension and Accessibility Policies

## Summary
Defines shared UI `className` extensibility and accessible-name rules for
placement, reuse, and implementation stages.

---

## Rule: `className` Support Policy
**Rule ID:** sr-ui-classname-support  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps shared UI extensible without forcing styling props
everywhere or creating style-override soup.
**Covers:** className Support Policy.
**Index mode:** reference

### Requirement

- UI primitives (`ui/primitives/**`) MUST accept `className?: string` when they
  render a DOM element.
- UI composites (`ui/composites/**`) SHOULD accept `className?: string` for the
  outer wrapper/root element when the composite renders a stable wrapper.
- If the repo uses class merging (Tailwind/CSS utility patterns), prefer one
  shared merge helper (for example `lib/cn.ts`) and reuse it consistently; do
  not invent per-component merge logic.
- Components that do not render DOM (pure logic, context providers, utility
  wrappers) MUST NOT accept `className` unless they explicitly forward it to a
  single DOM root.
- Feature sections (`features/*/sections/**`) MAY accept `className` only when:
  - the section is used in multiple page layouts requiring wrapper styling
    control, or
  - the section is explicitly designed to be composed as a layout block.
  Otherwise, styling should be handled inside the section or by composing
  wrappers in `pages/**`.
- Pages (`pages/**`) SHOULD NOT accept `className` props; pages are route
  orchestrators and styling is internal composition.

### Forbidden

- Adding many style props (`headerClassName`, `footerClassName`, `rowClassName`,
  etc.) by default.
  - Add slot-level class props only when there are multiple real call sites and
    the composite has stable, intentional slots.
- Forcing `className` on every component for consistency.
- Introducing a second styling extension pattern in the same repo (for example
  mixing `className`, `styles`, and `sx`) unless the repo already has an
  explicit multi-system policy.

### Notes

- If a feature section frequently needs external styling overrides, treat it as
  a signal to:
  - extract a reusable UI composite, or
  - introduce a dedicated wrapper/layout component in the composing layer.

---

## Rule: `aria-label` and Accessible Name Policy
**Rule ID:** sr-a11y-aria-label  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents noisy or incorrect ARIA usage while ensuring
interactive controls always have an accessible name.
**Covers:** aria-label and Accessible Name Policy.
**Index mode:** reference

### Requirement

- Any interactive control (button/link/input/custom widget) MUST have an
  accessible name, provided by one of:
  - visible text content, or
  - `<label>` + `for` association (or equivalent), or
  - `aria-labelledby`, or
  - `aria-label` as fallback when no visible label exists.
- Use `aria-label` only when there is no appropriate visible label (common
  case: icon-only buttons/links).
- Do not add `aria-label` redundantly when a clear visible label already
  exists.
- Decorative icons/elements MUST be marked appropriately (`aria-hidden="true"`
  or equivalent) when they do not convey meaning.
- UI primitives that render interactive elements SHOULD expose the minimal props
  needed to ensure accessible naming:
  - `aria-label`, `aria-labelledby`, and label/description wiring as
    pass-through attributes where relevant.
- UI composites SHOULD pass through accessibility props to the underlying
  interactive primitives and MUST NOT hardcode domain-specific labels.

### Forbidden

- Blanket-adding `aria-label` to every component or every element.
- Adding `aria-label` to non-interactive wrapper elements solely for
  accessibility.
- Overriding an existing correct accessible name with a worse `aria-label` (for
  example generic labels such as `Button`).
- Encoding domain semantics in shared UI via fixed ARIA labels; domain meaning
  belongs in feature-owned layers.

### Notes

- Prefer `aria-labelledby` when there is already visible on-screen text that
  should be used as the accessible name.
- If a control meaning depends on state (`Mute` vs `Unmute`), the accessible
  name should reflect the current action/state.
