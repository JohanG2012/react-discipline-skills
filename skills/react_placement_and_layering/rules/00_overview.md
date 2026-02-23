# Overview

## Summary

This document defines the authoritative rules for the `react_placement_and_layering` skill.

This skill operates under:
- `agent-policy-v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rpl-overview-scope  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Ensures placement decisions stay within boundaries.

### Requirement

- The skill must map work to the correct layer and folder.
- The skill must use architecture detection outputs as inputs.
- The skill must justify placement with boundary rules.
- The skill must inherit and enforce shared baseline constraints from
  `agent-policy-v1`.

### Forbidden

- Creating new layers without explicit approval.
- Ignoring existing architectural conventions.
- Defining local mandatory rules that conflict with `agent-policy-v1`.

### Notes

- If placement is ambiguous, list options and preferred choice.
