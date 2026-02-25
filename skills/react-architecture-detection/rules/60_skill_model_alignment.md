# Skill Model Alignment

## Summary
Defines alignment with fixed execution-skill boundaries and shared policy layer.

---

## Rule: Fixed Execution-Skill Scope
**Rule ID:** rad-skill-model-alignment  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Prevents ownership drift between detection and downstream skills.

### Requirement

- Treat `react-architecture-detection` as one of four fixed production
  execution skills.
- Keep primary output focused on:
  - repository classification
  - concern homes / gravity map
  - migration strategy metadata
- Preserve ownership boundaries:
  - do not perform placement planning (Skill 2)
  - do not perform reuse/update/new decisioning (Skill 3)
  - do not perform implementation edits (Skill 4)
- Keep shared policy/config updates in shared layer; do not model them as new
  execution skills.
- Preserve fixed production scope:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`

### Forbidden

- Expanding this skill to absorb downstream planning or implementation work.
- Reframing shared policy behavior as a new execution skill.
- Expanding production scope beyond fixed four execution skills.

### Notes

- Downstream skills must reuse detection outputs rather than recomputing
  gravity by default.
