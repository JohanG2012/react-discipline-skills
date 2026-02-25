# Detection Process

## Summary
Defines deterministic repository scanning and classification workflow for
architecture detection.

---

## Rule: Deterministic Signal Scan
**Rule ID:** rad-process  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Ensures architecture classification is evidence-based and
repeatable across runs.

### Requirement

- Validate required inputs before scanning:
  - `repo_root` (or current repository root)
  - `target_architecture` reference context
  - `task_scope` (`small_change | feature_change | new_route | refactor`)
- Accept optional hints when provided and treat them as weak priors only:
  - `framework_hint`
  - `router_hint`
  - `state_hint`
- Run concern scans in deterministic order:
  1. routing and entry points
  2. UI homes/conventions
  3. domain organization
  4. API/data-access homes
  5. state ownership/home
- Routing scan must check framework and router signals, including:
  - Next (`app/**/page.*`, `next.config.*`, `next/navigation`)
  - Remix (`app/routes/*`, `remix.config.*`)
  - React Router/TanStack Router (`RouterProvider`, `createBrowserRouter`,
    `Routes`, `Route`, `@tanstack/router`)
- UI scan must detect active homes and conventions (`ui/`, `components/`,
  `common/`, `shared/`, `atoms/molecules` patterns).
- Data-access scan must identify the canonical backend-access home
  (`api/`, `services/`, `client/`) and current state stack signals.
- Domain scan must classify organization (`features`, `modules`, `domains`,
  `flat`, or `mixed`).
- Classify repository shape as one of:
  - close to target architecture
  - different but internally structured
  - flat/ad-hoc
- Determine clear concern homes using gravity heuristics (at least one):
  - about 70%+ of related files live there
  - most concern imports resolve there
  - recent active edits for that concern consistently use that location
- For concerns with confidence `< 0.7`, set:
  - `home = unknown`
  - `status = ambiguous`
  and include concise uncertainty notes.
- Produce exactly one `gravity_map`.
- Emit `api.home` as canonical endpoint layer for downstream boundary checks.
- Compute `alignment_score` (`0-100`) plus:
  - `alignment.blockers[]`
  - `alignment.next_migration_step`
- Use deterministic defaults when signals conflict and no high-impact structural
  ambiguity requires pause.

### Detection sequence

1. Gather repository entry/context signals.
2. Execute routing/UI/domain/API/state scans.
3. Score confidence and assign concern homes/status.
4. Build one gravity map and alignment summary.
5. Hand off migration strategy selection to `rad-migration-safety`.
6. Hand off pause evaluation to `rad-default-bias`.
7. Hand off output shaping to `rad-output`.

### Forbidden

- Skipping required concern scans or returning partial concern output.
- Returning multiple gravity maps in one run.
- Marking a concern `resolved` when confidence is `< 0.7`.
- Recomputing/overriding shared policy defaults locally.
- Emitting detection output without canonical endpoint-layer assignment.

### Notes

- If no clear signal exists, classify the area as ambiguous and surface
  uncertainty explicitly.
- Concern evidence should reference concrete files/folders, not generic claims.
