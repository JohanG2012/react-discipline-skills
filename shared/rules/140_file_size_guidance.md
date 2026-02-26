# File Size Guidance

## Summary
Defines soft file-size and responsibility guidance to prevent oversized modules.

---

## Rule: File Size and Responsibility Guidance
**Rule ID:** sr-file-size-guidance  
**Priority:** SHOULD  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Encourages maintainable module boundaries and limits
responsibility drift.

### Requirement

- Treat folder-specific line limits as soft caps, not hard compile gates.
- Prefer responsibility-based splitting when files become hard to reason about.
- Use practical warning signals:
  - Around 400 lines: architecture smell.
  - Around 600+ lines: refactor strongly recommended.
- Favor this practical rule: no file should require more than about three screen
  heights to understand its primary responsibility.

### Forbidden

- Ignoring clear multi-responsibility smells in oversized files.
