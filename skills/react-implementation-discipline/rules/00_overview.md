# Overview

## Summary

This document defines authoritative constraints for
`react-implementation-discipline`.

This skill operates under:

- `agent-policy-v1` (mandatory baseline policy)

All rules here are binding for agents and LLMs using this skill.

---

## Rule: Skill Scope Definition
**Rule ID:** rid-overview-scope  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Keep implementation output disciplined, reviewable, and aligned
with architecture and policy.

### Requirement

- Enforce plan fidelity: implementation must follow the approved revised plan.
- Enforce boundary and quality gates before output is finalized.
- Enforce minimal churn: avoid unrelated refactors and speculative cleanup.
- Inherit and enforce shared baseline constraints from `agent-policy-v1`.
- Treat these by default as out of scope unless explicitly approved:
  - architecture migration
  - new dependencies
  - unrelated cleanup/refactor work
  - policy/spec document edits
- Require deterministic output states:
  - `accepted`
  - `blocked`
  - `dependency_error`
  - `validation_error`

### Forbidden

- Skipping required validation, boundary, or scope checks.
- Modifying architecture/specification policy artifacts unless explicitly requested.
- Defining local mandatory rules that conflict with `agent-policy-v1`.
- Returning unqualified implementation output when mandatory checks fail.

### Notes

- If required repository context is unavailable, fail closed.
- Always prefer bounded, reviewable changes over large structural drift.
