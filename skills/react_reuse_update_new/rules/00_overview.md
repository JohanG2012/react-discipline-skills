# Overview

## Summary

This document defines the authoritative rules for the `react_reuse_update_new` skill.

This skill operates under:
- `agent_policy_v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rru-overview-scope  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Ensures reuse decisions stay within defined responsibilities.

### Requirement

- The skill must evaluate reuse vs update vs new for existing code.
- The skill must avoid over-generalization of components.
- The skill must prefer minimal churn and clear ownership.

### Forbidden

- Introducing large refactors unrelated to the request.
- Forcing reuse through leaky flags.

### Notes

- Use the decision ladder to guide outcomes.
