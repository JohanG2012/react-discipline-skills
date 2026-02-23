# Overview

## Summary

This document defines the authoritative rules for the `<skill_name>` skill.

This skill operates under:
- `agent-policy-v1` (mandatory baseline policy)
- Repository gravity decisions determined by Architecture Detection (if applicable)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** <prefix>-overview-scope  
**Priority:** MUST  
**Applies to:** <skill_name>  
**Rationale:** Ensures the skill operates only within its defined responsibility and does not leak into other skill domains.

### Requirement

- The skill must operate only within its defined responsibility.
- The skill must not perform responsibilities assigned to other skills.
- The skill must not silently modify architecture decisions made by other skills.
- The skill must not reinterpret or override `agent-policy-v1`.

### Forbidden

- Recomputing gravity decisions unless explicitly allowed.
- Performing structural migrations unless migration mode is active.
- Expanding scope beyond the Scope Governor without explicit override.
- Introducing implicit changes to policy or folder structure.

### Notes

- If uncertainty affects structural decisions, pause according to the Clean Pause Protocol.
- Local decisions may be made using deterministic defaults.