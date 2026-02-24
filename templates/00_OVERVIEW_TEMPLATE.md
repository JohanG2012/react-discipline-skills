# Overview

## Summary

This document defines the authoritative rules for the `<skill-name>` skill.

This skill operates under:
- `agent-policy-v1` (mandatory baseline policy baked in at build time)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** <prefix>-overview-scope  
**Priority:** MUST  
**Applies to:** <skill-name>  
**Rationale:** Ensure the skill operates only within its defined responsibility.

### Requirement

- The skill must operate only within its defined responsibility.
- The skill must not perform responsibilities assigned to other skills.
- The skill must not silently modify architecture decisions made by other skills.
- The skill must inherit and enforce shared baseline constraints from
  `agent-policy-v1`.
- The skill must not reinterpret or override `agent-policy-v1`.
- The skill must return output in the structure defined by its `SKILL.md` output
  contract.

### Forbidden

- Recomputing upstream decisions unless explicitly allowed.
- Performing structural migrations unless migration mode is active.
- Expanding scope beyond the Scope Governor without explicit override.
- Introducing implicit changes to policy or folder structure.
- Defining local mandatory rules that conflict with `agent-policy-v1`.
- Returning unstructured prose outside the skill output contract.

### Notes

- If uncertainty affects structural decisions, pause according to the clean
  pause protocol.
- Local decisions may be made using deterministic defaults.
- For shared baseline policy skills, add a second `Baseline Non-goals` rule to
  prevent policy drift into implementation recipes.
