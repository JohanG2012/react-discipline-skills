# Overview

## Summary

This document defines the authoritative rules for the `react_reuse_update_new`
skill.

This skill operates under:
- `agent-policy-v1` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rru-overview-scope  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Ensures reuse decisions stay within defined responsibilities.

### Requirement

- The skill must evaluate reuse vs update vs new for each needed artifact in
  scope.
- The skill must preserve deterministic behavior for thresholding, tie-breaks,
  and output states.
- The skill must avoid over-generalization of components and prefer minimal
  churn with clear ownership.
- The skill must emit planning guidance only and must not directly implement,
  move, or refactor project code.
- The skill must inherit and enforce shared baseline constraints from
  `agent-policy-v1`.

### Forbidden

- Introducing large refactors unrelated to the request.
- Forcing reuse through leaky domain flags in shared abstractions.
- Returning partial decision payloads when required inputs are invalid or
  discovery evidence is unavailable.
- Defining local mandatory rules that conflict with `agent-policy-v1`.

### Notes

- Use the decision ladder and deterministic defaults to guide outcomes.
