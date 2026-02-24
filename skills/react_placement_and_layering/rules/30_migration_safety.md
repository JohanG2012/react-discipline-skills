# Migration Strategy and Placement Safety

## Summary
Defines migration-aware placement behavior and duplicate-home prevention.

---

## Rule: Strategy and One-Home Discipline
**Rule ID:** rpl-migration-safety  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Prevents parallel architectures and unsafe structural churn.

### Requirement

- Choose exactly one strategy per run:
  - `follow-existing`
  - `introduce-boundaries`
  - `migrate-as-you-touch`
- Follow gravity for each concern by extending the active home unless an
  explicit migration boundary is selected.
- Avoid duplicate homes by keeping one authoritative home per concern in the
  run (`authoritative_home_map`).
- Introduce new target structure only when the new scope is isolated,
  self-consistent, and does not create competing homes.
- Classify placement work as either:
  - feature task (default: updates/creates only, no moves), or
  - migration task (moves allowed only in explicit migration scope).
- Default move posture is no moves/renames; move operations require explicit
  enablement and complete import-update targets.
- In move-enabled runs, keep move scope bounded to one concern and three files
  or fewer.
- In bootstrap-triggered repositories (flat/ad-hoc with no clear homes), folder
  creation is limited to canonical homes and only the minimal folders needed for
  the task.
- In bootstrap mode, create `store/` only when truly global client state is
  required.

### Forbidden

- Treating two locations as simultaneously correct for the same concern.
- Introducing broad relocation/migration during routine feature-scope planning.
- Creating bootstrap folders outside canonical homes.
- Mixing feature-behavior changes with structural migration by default.

### Notes

- Prefer stable import boundaries and incremental convergence over early broad
  file moves.
