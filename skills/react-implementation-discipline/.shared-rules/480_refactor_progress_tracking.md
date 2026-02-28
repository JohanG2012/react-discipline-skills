# Refactor Progress Tracking Files

## Summary
Allows temporary `README.md` progress tracking during medium/high-risk refactor
work while preventing accidental commits and repository pollution.

---

## Rule: Temporary Refactor Progress README Discipline
**Rule ID:** sr-refactor-progress-readme  
**Priority:** SHOULD  
**Applies to:** react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Medium/high-risk refactors benefit from explicit checkpoint
tracking, but temporary planning artifacts must not leak into permanent history.
**Covers:** Temporary Refactor Progress README Discipline.
**Index mode:** reference

### Requirement

- For refactor work with step risk `medium` or `high`, it is allowed and
  recommended to create temporary progress-tracking `README.md` files.
- Preferred temporary tracking home is `.refactor-progress/**/README.md` to keep
  transient notes outside product source folders.
- Progress `README.md` content should stay concise and execution-focused, such
  as:
  - current checkpoint and next checkpoint,
  - invariants to preserve,
  - remaining risk items/blockers.
- Temporary progress files must be treated as non-deliverable artifacts:
  - never stage them,
  - never commit them,
  - remove them once refactor execution is complete.
- If temporary progress files are accidentally staged, unstage them before final
  output/commit steps.
- Temporary progress files do not justify scope expansion and do not count as
  deliverable output files.

### Forbidden

- Staging or committing temporary refactor progress `README.md` artifacts.
- Leaving temporary progress `README.md` artifacts in the repository after
  refactor completion.
- Using temporary progress notes as a substitute for required structured output.
