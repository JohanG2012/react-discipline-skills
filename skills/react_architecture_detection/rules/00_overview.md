# Overview

## Summary

This document defines the authoritative rules for the `react_architecture_detection` skill.

This skill operates under:
- `agent_policy_v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rad-overview-scope  
**Priority:** MUST  
**Applies to:** react_architecture_detection  
**Rationale:** Ensures architecture detection stays within its defined responsibility.

### Requirement

- The skill must focus on detecting repository structure and gravity.
- The skill must not make placement decisions beyond reporting signals.
- The skill must not modify repository structure.

### Forbidden

- Recommending migrations without explicit instruction.
- Editing files as part of detection.

### Notes

- If signals are ambiguous, report uncertainty and recommend follow-up.
