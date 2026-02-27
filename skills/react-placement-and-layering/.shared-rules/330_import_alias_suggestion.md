# Deep Relative Import Alias Suggestion

## Summary
Requires an explicit human-facing recommendation to introduce `@/` alias when
deep relative imports are detected and no canonical alias exists.

---

## Rule: Deep Relative Imports Should Trigger `@/` Alias Suggestion
**Rule ID:** sr-import-alias-suggestion  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Reduces brittle path traversal noise while keeping alias adoption
as an explicit, human-approved tooling decision.
**Covers:** Deep Relative Imports Should Trigger @/ Alias Suggestion.
**Index mode:** reference

### Requirement

- Trigger this rule when touched or reviewed code contains deep relative import
  paths (for example `../../../` or deeper).
- If a canonical root alias already exists (for example `@/` or
  gravity-equivalent), use existing repository convention and do not propose a
  second alias system.
- If no canonical alias exists, the agent must include an explicit suggestion to
  the human to introduce `@/` aliasing for maintainability/readability.
- If no canonical alias exists and the active skill supports clarification
  requests (for example `react-refactoring-progression`), the agent must ask the
  human before planning alias adoption scope:
  - provide options `A`/`B`/`C` (optional `D`),
  - include one recommended option with brief rationale,
  - pause alias-related planning until answer is received.
- Suggestion content must be practical and scoped:
  - note why deep traversal is a maintenance smell,
  - propose introducing one canonical alias (prefer `@/` unless repository
    convention indicates otherwise),
  - state that migration can be incremental (touched files first).
- Alias introduction itself remains opt-in:
  - do not apply alias config/import rewrites unless explicitly requested or
    approved by user scope.

### Forbidden

- Silently introducing alias config and import rewrites when user scope does not
  request tooling/path changes.
- Planning alias-adoption changes in clarification-capable flows without asking
  the human first.
- Introducing a second competing root alias pattern when one already exists.
- Continuing to add new deep relative traversals in touched code after alias is
  already established by repository convention.

### Notes

- Boundary rules still apply equally to aliased imports and raw relative imports
  (aliasing is path ergonomics, not boundary bypass).
