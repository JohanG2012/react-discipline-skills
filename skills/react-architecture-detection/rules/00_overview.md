# Overview

## Summary

This document defines the authoritative rules for the `react-architecture-detection` skill.

This skill operates under:
- `shared-rules` (mandatory baseline policy)

All rules defined here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rad-overview-scope  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Ensures architecture detection stays within its defined responsibility.
**Covers:** Skill Scope Definition.
**Index mode:** reference

### Requirement

- The skill must focus on detecting repository structure and gravity.
- The skill must not make placement decisions beyond reporting signals.
- The skill must not modify repository structure.
- The skill must be detection-only and must not perform feature implementation,
  file moves, or refactors.
- The skill must inherit and enforce shared baseline constraints from
  `shared-rules`.

### Forbidden

- Recommending direct file moves/refactors as mandatory actions during
  detection.
- Editing files as part of detection.
- Implementing runtime/business logic changes in repository source files.
- Defining local mandatory rules that conflict with `shared-rules`.

### Notes

- If signals are ambiguous, report uncertainty and provide bounded follow-up
  options in structured output fields.
