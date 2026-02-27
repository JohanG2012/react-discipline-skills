# Overview

## Summary

This document defines the authoritative rules for the `react-implementation-discipline` skill.

This skill operates under:
- `react-implementation-discipline` (with mandatory shared baseline policy baked in at build time)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** sr-overview-scope  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps shared baseline governance and scope constraints explicit.
**Covers:** Skill Scope Definition.
**Index mode:** reference

### Requirement

- The skill must operate only within its defined responsibility.
- The skill must not perform responsibilities assigned to other skills.
- The skill must not reinterpret or override policy without explicit approval.
- The shared baseline must apply uniformly to:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`
- The production execution skill set for this initiative is fixed to those four
  skills; the shared baseline policy is not a production execution skill.
- Shared policy/config updates must not be modeled as new execution skills.
- Document precedence must remain deterministic:
  - `specs/001-agent-policy-v1/master_spec.md` is authoritative.
  - Supporting policy docs may fill non-conflicting open details only.
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
**Rule ID:** sr-overview-nongoals  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents policy drift into implementation-specific prescriptions.
**Covers:** Baseline Non-goals.
**Index mode:** reference

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
