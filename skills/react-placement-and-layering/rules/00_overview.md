# Overview

## Summary

This document defines the authoritative rules for the `react-placement-and-layering` skill.

This skill operates under:
- `shared-rules` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rpl-overview-scope  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Ensures placement decisions stay within boundaries.

### Requirement

- The skill must map work to the correct layer and folder.
- The skill must use architecture detection outputs as inputs.
- The skill must justify placement with boundary rules.
- The skill must inherit and enforce shared baseline constraints from
  `shared-rules`.
- The skill must validate required inputs before planning.
- The skill must return strict machine-consumable JSON output only.
- The skill must keep output structural and exclude raw source snippets and
  secret-like values.

### Forbidden

- Creating new layers without explicit approval.
- Ignoring existing architectural conventions.
- Defining local mandatory rules that conflict with `shared-rules`.
- Producing best-effort plans from missing or invalid required inputs.
- Returning unstructured prose output outside the output contract.

### Notes

- If placement is ambiguous, list options and preferred choice in contract
  fields only.
