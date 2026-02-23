# Placement Process

## Summary
Defines the placement workflow for new or updated files.

---

## Rule: Layer Mapping
**Rule ID:** rpl-process  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Keeps placement decisions consistent and testable.

### Requirement

- Validate required inputs before planning:
  - implementation request
  - target architecture rules
  - architecture-detection result
- Translate the request into explicit planning requirements before choosing
  files.
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
- Map requested changes to a single owning layer per artifact.
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
  - if architecture confidence is below `0.7` and impact is structural, trigger
    clean pause protocol and, after explicit resolution, select repository
    evidence with `resolution_mode=pause_resolved`
  - for all other conflict cases, keep architecture detection as the effective
    source
  - after explicit resolution, record each concern in
    `source_of_truth_resolutions`
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
- Emitting move/rename plans without explicit import-update targets.

### Notes

- Use deterministic defaults when choices are otherwise equivalent.
- If non-structural ambiguity remains after lookup, choose the safest minimal
  artifact and record the ambiguity in notes.
- If structural ambiguity remains unresolved, pause and request confirmation.
