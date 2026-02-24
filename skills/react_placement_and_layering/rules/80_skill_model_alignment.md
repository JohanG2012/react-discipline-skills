# Skill Model Alignment

## Summary
Defines alignment with the fixed execution-skill model and shared policy layer.

---

## Rule: Fixed Execution-Skill Scope
**Rule ID:** rpl-skill-model-alignment  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Prevents skill-scope drift and preserves cross-skill ownership
boundaries.

### Requirement

- Treat `react_placement_and_layering` as one of the fixed production execution
  skills.
- Keep primary output focused on placement plans and layer assignments.
- Coordinate with upstream architecture detection outputs and downstream reuse
  and implementation skills without absorbing their responsibilities.
- Keep shared policy/config as a separate baseline layer; do not re-model
  policy concerns as new execution-skill behavior.
- Preserve four-skill production scope:
  - `react_architecture_detection`
  - `react_placement_and_layering`
  - `react_reuse_update_new`
  - `react_implementation_discipline`

### Forbidden

- Expanding this skill to perform full implementation, broad refactors, or
  architecture detection recomputation.
- Reframing shared policy-layer behavior as a new execution-skill concern.
- Expanding production scope beyond the fixed four execution skills.

### Notes

- Cross-skill handoffs must remain explicit and machine-consumable.
