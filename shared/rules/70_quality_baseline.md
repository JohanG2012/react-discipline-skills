# Completion and Quality Baseline

## Summary
Defines mandatory completion checks and runtime-safety expectations inherited by
all downstream skills.

---

## Rule: Completion and Quality Baseline
**Rule ID:** sr-dod-baseline  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Ensures every downstream skill validates critical correctness and
safety gates before completion.

### Requirement

- Boundary audit must pass:
  - No forbidden imports by layer.
  - No fetching outside canonical endpoint layer.
  - `api/**` remains transport-only.
- Runtime safety baseline:
  - Loading state handling when server data is involved.
  - Error state handling.
  - Empty state handling for list/collection views.
  - No unhandled promise rejections.
- Minimal churn baseline:
  - Touch only planned files unless deviations are explained.
  - Avoid unrelated refactors.
- If tooling exists, applicable checks must pass (`tsc`, lint, and existing test
  suites relevant to changed behavior).
- If TanStack Query (or equivalent) is used, query correctness checks must
  ensure stable keys, intended invalidation, and justified server-state/store
  boundaries.
- Tests are required only when a suite already exists and changed behavior falls
  within that suite's scope.

### Forbidden

- Marking work done without boundary/safety checks.
- Treating optional quality checks as mandatory when repository tooling does not
  exist.
- Claiming compliance while skipping available type/lint checks in repositories
  that provide those checks.
