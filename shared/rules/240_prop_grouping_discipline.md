# Prop Grouping Discipline

## Summary
Defines when grouping component props is valid versus when it becomes boundary
bypass or prop-surface concealment.

---

## Rule: Prop Grouping Discipline
**Rule ID:** sr-prop-grouping-discipline  
**Priority:** SHOULD  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps prop grouping intentional and cohesive while preventing
config-bag anti-patterns that hide responsibility drift.

### Requirement

- Group props only when the grouped shape represents one cohesive concern (for
  example `pagination`, `sorting`, `filters`).
- Group names must be concern-specific and explicit; avoid generic umbrella
  names.
- Grouped props in `ui/**` must remain domain-agnostic and must not carry domain
  entities, domain IDs, or domain behavior flags.
- Prefer composition (`children`, slots, render props) or feature-owned wrappers
  when grouping would otherwise mix unrelated concerns.
- If grouping is used as an escalation action for cap exceedance, reference this
  rule from `sr-prop-count-caps` plan/refactor notes.

### Forbidden

- Generic junk-drawer groups such as `config`, `options`, or `settings` that
  mix unrelated concerns.
- Grouping unrelated data, callbacks, and mode switches solely to reduce visible
  top-level prop count.
- Using grouped objects to pass domain-specific models into shared `ui/**`
  components.
- Using prop grouping to bypass layer boundaries or hide shared-composite domain
  switches.

### Notes

- This rule defines grouping correctness; prop-surface thresholds and escalation
  triggers are defined in `sr-prop-count-caps`.
