# Overview

## Summary

This document defines the authoritative rules for the `agent-policy-v1` skill.

This skill operates under:
- `agent-policy-v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** apv-overview-scope  
**Priority:** MUST  
**Applies to:** agent-policy-v1  
**Rationale:** Ensures the policy skill stays focused on governance and scope.

### Requirement

- The skill must operate only within its defined responsibility.
- The skill must not perform responsibilities assigned to other skills.
- The skill must not reinterpret or override policy without explicit approval.
- The shared baseline must apply uniformly to:
  - `react_architecture_detection`
  - `react_placement_and_layering`
  - `react_reuse_update_new`
  - `react_implementation_discipline`
- The production execution skill set for this initiative is fixed to those four
  skills; `agent-policy-v1` is shared baseline policy and not a production
  execution skill.
- Shared policy/config updates must not be modeled as new execution skills.
- Document precedence must remain deterministic:
  - `SPEC.md` is authoritative.
  - `POLICY.md` may fill non-conflicting open details only.
- The shared baseline must explicitly govern:
  - Architecture/dependency boundaries.
  - Deterministic defaults and pause behavior.
  - Scope-governor limits and expansion protocol.
  - Output consistency for planning and implementation.
  - Ownership/naming conventions and completion checks.

### Forbidden

- Expanding scope beyond the Scope Governor without explicit override.
- Introducing implicit changes to repository structure.
- Creating competing policy sources that conflict with shared baseline precedence.
- Adding new production execution skills without explicit scope/constitution
  update.

---

## Rule: Baseline Non-goals
**Rule ID:** apv-overview-nongoals  
**Priority:** MUST  
**Applies to:** agent-policy-v1  
**Rationale:** Prevents policy drift into implementation-specific prescriptions.

### Requirement

- Shared policy must define constraints and governance, not implementation
  recipes.
- Shared policy must not implicitly change through examples, migration behavior,
  or downstream reinterpretation.
- Downstream skills may add local guidance only when it does not conflict with
  shared mandatory rules.

### Forbidden

- Treating examples as policy overrides.
- Introducing stack/framework mandates as shared-policy requirements without
  explicit spec approval.

### Notes

- If uncertainty affects governance decisions, pause and request clarification.
