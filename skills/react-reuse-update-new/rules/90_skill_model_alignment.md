# Skill Model Alignment

## Summary
Defines alignment with the fixed execution skill model and shared policy layer.

---

## Rule: Fixed Skill Model Compliance
**Rule ID:** rru-skill-model-alignment  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Prevents scope drift and keeps responsibilities aligned across
the four execution skills.

### Requirement

- Treat this skill as one of the fixed execution skills in the current model.
- Primary output remains a refined implementation plan with per-artifact
  reuse/update/new decisions.
- Shared policy/config remains a separate layer and must not be re-modeled as a
  new execution skill by this rule set.
- This skill may refine decisions but must not absorb responsibilities owned by
  architecture detection, placement/layering, or implementation discipline.

### Forbidden

- Reframing policy-layer concerns as new execution-skill behavior in this skill.
- Expanding this skill to replace other execution skills in the fixed model.

### Notes

- Cross-skill coordination is mandatory; ownership boundaries remain explicit.
