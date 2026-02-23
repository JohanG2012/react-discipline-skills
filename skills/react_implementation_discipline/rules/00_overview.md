# Overview

## Summary

This document defines the authoritative rules for the `react_implementation_discipline` skill.

This skill operates under:
- `agent-policy-v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rid-overview-scope  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Ensures implementation discipline stays within boundaries.

### Requirement

- The skill must enforce boundary and quality gates.
- The skill must follow the implementation plan and file touch list.
- The skill must minimize churn and avoid unrelated refactors.
- The skill must inherit and enforce shared baseline constraints from
  `agent-policy-v1`.

### Forbidden

- Skipping required validation steps.
- Modifying architecture documents unless explicitly requested.
- Defining local mandatory rules that conflict with `agent-policy-v1`.

### Notes

- Pause if implementation would violate scope or policy.
