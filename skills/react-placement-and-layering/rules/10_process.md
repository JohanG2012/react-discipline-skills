# Placement Process

## Summary
Defines the placement workflow for new or updated files.

---

## Rule: Layer Mapping
**Rule ID:** rpl-process  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Keeps placement decisions consistent and testable.

### Requirement

- Validate required inputs before planning:
  - implementation request
  - target architecture rules
  - architecture-detection result
- Resolve effective output mode before planning:
  - accept optional `output_mode` (`human|agent`)
  - default to `human` when a human explicitly instructs this skill to run
  - default to `agent` otherwise
- Translate the request into explicit planning requirements before choosing
  files.
- Classify the request using one or more task categories before placement:
  - new page/route
  - new feature capability
  - new UI element
  - new API endpoint/backend integration
  - refactor/reuse improvement
  - bug fix
- Apply this skill whenever a new frontend file is introduced (for example
  React component, hook, route, API client, store module, or shared utility),
  including when that need is discovered mid-implementation.
- Just-in-time trigger: if implementation is already in progress and a new file
  is discovered as necessary, pause implementation, run this placement skill,
  then continue implementation using the placement result.
- Select one primary feature owner for the run.
- Select one strategy for the run (`follow-existing`,
  `introduce-boundaries`, or `migrate-as-you-touch`).
- Enforce import guardrails before finalizing:
  - `ui/**` must not import from `features/**`, `api/**`, `store/**`, or
    `pages/**`
  - `api/**` must not import React, `ui/**`, `features/**`, `pages/**`, or
    `store/**`
  - `lib/**` must not import React
  - `features/**` must not import from `pages/**`
  - `pages/**` must not import from the canonical endpoint layer directly; use
    feature hooks
  - `hooks/**` must not import from `features/**`, `pages/**`, or `store/**`;
    imports from `api/**` are allowed only when documented in exactly one
    canonical policy location
  - fetching/transport must remain in the canonical endpoint layer for the task
  - when a path alias exists (for example `@/`), apply guardrails to alias and
    raw `src/**` paths equally
- Enforce cross-layer error ownership in placement decisions:
  - `api/endpoints/**` owns normalized typed transport errors (`ApiError`) with
    `message` and optional `status`, `code`, `details`, and `cause`
  - `features/*/hooks/**` expose consistent error result shape and do not emit
    toasts/snackbars for query/page-load failures
  - `pages/**` and `features/*/sections/**` own user-facing error behavior;
    default query/page-load failures to inline retry UI
  - mutation toast/snackbar feedback is allowed only when that app pattern
    already exists; otherwise keep mutation feedback inline near the action
- Enforce state persistence policy when store/global-state artifacts are planned:
  - persist only user preferences and lightweight durable UI state
  - prefer URL query parameters for shareable/bookmarkable state
  - do not persist ephemeral UI state (for example modal open flags)
  - do not persist server-state snapshots in global store unless explicitly
    justified by performance-critical caching, offline-first requirements, or a
    documented architectural decision
- Map requested changes to a single owning layer per artifact.
- Apply explicit layout/shell placement ownership before finalizing each
  layout-like artifact:
  - choose `ui/primitives/**` only for low-level minimal-structure building
    blocks (for example `Stack`, `Box`, `Spacer`, `Grid`, thin `Container`)
  - choose `ui/composites/**` for reusable shell/layout patterns that compose
    multiple primitives (for example `PageShell`, `ModalShell`, `AppShell`,
    `MasterDetailLayout`, `TableShell`, `EmptyStatePanel`)
  - choose `features/<domain>/sections/**` when the layout is domain-owned
    composition (for example domain navigation, filters, or domain states)
- Default to no dedicated top-level `ui/layouts/**` or `ui/shells/**` homes.
- Allow composite categorization folders only under existing composite home:
  - `ui/composites/layouts/**`
  - `ui/composites/shells/**`
  and only when local `ui/**` already uses category subfolders and the split
  does not create a competing second home.
- Perform required repository lookup before proposing new artifacts:
  - existing route files
  - existing feature sections
  - existing UI composites/primitives
  - existing endpoint/DTO files
  - existing store slices
  - naming/export conventions
- Prefer reuse of existing folders over creating new ones.
- Apply action decision ladder per artifact:
  - `reuse` when a suitable artifact already exists as-is
  - `update` when small extension of an existing artifact is enough
  - `create` only when reuse/update is not suitable
- Produce explicit artifact records with purpose, action, layer, and path.
- For architecture/repository concern conflicts:
  - use architecture detection as default source and do not recompute gravity
  - set `override_threshold` to the shared structural pause-confidence
    threshold (`0.7` under current shared defaults)
  - if architecture confidence is below `0.7` and impact is structural, trigger
    clean pause protocol and, after explicit resolution, select repository
    evidence with `resolution_mode=pause_resolved`
  - for all other conflict cases, keep architecture detection as the effective
    source
  - after explicit resolution, record each concern in
    `source_of_truth_resolutions`
- Preserve unresolved high-impact structural ambiguity from architecture
  detection or placement analysis and block plan finalization until
  clarification is resolved.
- Keep a concise authoritative-home map for the run and use it consistently for
  placement decisions (`authoritative_home_map`).
- If no path alias is already configured, keep relative imports and do not
  introduce alias configuration unless explicitly requested.
- Include decision explanation metadata with detected architecture signals and
  chosen direction.
- Document why adjacent layers were not chosen.
- If move/rename operations are explicitly enabled, include `old_path ->
  new_path` and import-update targets before finalizing.
- In move-enabled runs, keep moves small (default: three files or fewer) and
  keep moves scoped to one concern in the run.
- If edits are confined to existing files and no new placement decision is
  required, emit a no-op placement outcome with `artifacts: []`,
  `file_actions: []`, and a short stay-in-place justification.

### Forbidden

- Splitting a single responsibility across multiple layers.
- Introducing inconsistent naming conventions.
- Emitting placement artifacts without a selected strategy and owner.
- Finalizing a plan when guardrail violations remain unresolved.
- Creating new artifacts when a clearly suitable reusable artifact already
  exists.
- Recomputing gravity independently from architecture-detection output.
- Applying repository-evidence override without explicit pause resolution when
  structural impact is present.
- Creating a parallel top-level `ui/layouts/**` or `ui/shells/**` home by
  default.
- Classifying reusable shell/layout patterns as primitives.
- Classifying domain-owned layout composition as shared composite by default.
- Finalizing `result_type=placement_plan` while unresolved high-impact structural
  ambiguity remains.
- Emitting move/rename plans without explicit import-update targets.
- Continuing implementation after discovering a new-file requirement without
  first running placement.

### Notes

- Use deterministic defaults when choices are otherwise equivalent.
- If non-structural ambiguity remains after lookup, choose the safest minimal
  artifact and record the ambiguity in notes.
- If structural ambiguity remains unresolved, pause and request confirmation.
