# Migration Strategy and Placement Safety

## Summary
Defines migration-aware placement behavior and duplicate-home prevention.

---

## Rule: Strategy and One-Home Discipline
**Rule ID:** rpl-migration-safety  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Prevents parallel architectures and unsafe structural churn.
**Covers:** Strategy and One-Home Discipline.
**Index mode:** reference

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
- Feature-root creation safety:
  - creating a new top-level `features/<name>/` is allowed only for
    route/nav-level or otherwise user-facing owners,
  - non-user-facing capability must remain under an existing owner as
    `features/<owner>/modules/<name>/` (or local equivalent module subhome),
  - React-free cross-feature logic should be placed in `lib/**` rather than
    spawning feature roots.
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
- Creating sibling top-level feature roots with overlapping normalized
  stem/prefix when one owner can host a module.
- Introducing broad relocation/migration during routine feature-scope planning.
- Creating bootstrap folders outside canonical homes.
- Mixing feature-behavior changes with structural migration by default.

### Notes

- Prefer stable import boundaries and incremental convergence over early broad
  file moves.
