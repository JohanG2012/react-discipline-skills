# Overview

## Summary

This document defines the authoritative rules for the `agent_policy_v1` skill.

This skill operates under:
- `agent_policy_v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** apv-overview-scope  
**Priority:** MUST  
**Applies to:** agent_policy_v1  
**Rationale:** Ensures the policy skill stays focused on governance and scope.

### Requirement

- The skill must operate only within its defined responsibility.
- The skill must not perform responsibilities assigned to other skills.
- The skill must not reinterpret or override policy without explicit approval.

### Forbidden

- Expanding scope beyond the Scope Governor without explicit override.
- Introducing implicit changes to repository structure.

### Notes

- If uncertainty affects governance decisions, pause and request clarification.
