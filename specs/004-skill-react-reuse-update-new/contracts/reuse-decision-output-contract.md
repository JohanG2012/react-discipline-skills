# Reuse Decision Output Contract

## Purpose

Define the normative output interface produced by
`react-reuse-update-new` and consumed by downstream planning and
implementation workflows.

## Scope

- **Producer**:
  `<REPO_ROOT>/skills/react-reuse-update-new/`
- **Consumers**:
  - `react-implementation-discipline`
  - feature planning workflows that consume revised decision plans

## Source of Truth

Contract artifacts for this feature:

- `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output.schema.json`
- `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output-contract.md`
- `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/spec.md`
- `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/plan.md`

Skill artifacts that must align with this contract:

- `<REPO_ROOT>/skills/react-reuse-update-new/SKILL.md`
- `<REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md`
- `<REPO_ROOT>/skills/react-reuse-update-new/schemas/output.schema.json`
- `<REPO_ROOT>/skills/react-reuse-update-new/examples/output.example.json`

Baseline governance references:

- `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/master_spec.md`
- `<REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md`
- `<REPO_ROOT>/shared/rules/30_architecture_boundaries.md` (dependency direction, canonical endpoint layer, alias-boundary parity, generic fetch-hook exception policy)
- `<REPO_ROOT>/shared/rules/130_access_write_control.md` (read/search assumptions and write-control policy for architecture/spec documents)

## Top-Level Contract

All outputs must include:

- `schema_version` (string)
- `skill` (`react-reuse-update-new`)
- `version` (string)
- `result_type` (`decision_plan` | `validation_error` | `dependency_error`)
- `validation_status` object (`is_valid`, `stage`, `errors`, optional `warnings`)
- optional `scope_expansion_needed[]` (`why`, `would_touch`) when in-cap output
  is delivered with explicit expansion requests

### Result Type: `decision_plan`

Required fields:

- `thresholds_applied`
  - `max_new_props_for_update`
  - `max_flags_allowed_composites`
  - `max_generic_flags_allowed_primitives`
  - `max_abstraction_risk_score`
- `revised_plan`
  - `source_plan_ref`
  - `context_decisions`
    - `feature_owner_domain`
    - `route_page_involvement`
    - `data_sources_summary[]`
    - `state_type`
    - `ui_need_shape`
  - `file_actions[]` (`Create` | `Update` | `Reuse` with concrete path + artifact id)
  - `layer_justifications[]` (layer rationale + adjacent layers not chosen)
  - `decisions[]`
  - `guardrails[]`
  - `notes[]` (max 5)
  - optional `follow_up_scope[]` (max 5 short items when scope expansion is requested)
  - optional `move_actions[]` (`from_path`, `to_path`, `import_update_targets[]`)

Each `decisions[]` entry must include:

- `needed_artifact_id` (stable, required)
- `decision` (`reuse` | `update` | `new` | `decision_blocked`)
- `decision_mark` (`reuse as-is` | `updated` | `new` | `decision_blocked`)
- `discovery_status` (`found` | `not_found`)
- `discovery_paths[]` (required when `discovery_status=found`)
- `target_path` (required for `reuse`/`update`/`new`, omitted for `decision_blocked`)
- `chosen_candidate_id` (optional)
- `reasons[]` (min 1)
- `override_required` (boolean)
- `score_profile` for `reuse`/`update`/`new` (`fit`, `complexity_cost`, `coupling_risk`, `divergence_risk`, `locality_benefit`)
- optional `tie_break` with ordered criteria
- optional `constraint_blockers[]`

Decision constraints:

- `decision_blocked` requires `override_required=true`.
- All `needed_artifact_id` values must be unique per output.
- `decision_mark` must match the final decision:
  - `reuse` -> `reuse as-is`
  - `update` -> `updated`
  - `new` -> `new`
  - `decision_blocked` -> `decision_blocked`
- `reuse` and `update` decisions require `discovery_status=found`.
- `new` decisions require a concrete `target_path` for planned creation scope.
- If any move/rename is present, include explicit `from_path -> to_path` plus
  import update targets before execution.
- If tie-break is present and applied, criteria order must be:
  `authoritative_home`, `coupling_risk`, `divergence_risk`,
  `complexity_cost`, `lexical_path`.

### Result Type: `validation_error`

Required fields:

- `notes[]` (max 5)
- no `revised_plan`
- `validation_status.is_valid=false`

### Result Type: `dependency_error`

Required fields:

- `dependency_issue` (string)
- `fallback_context_bundle_requirements[]` (required checklist for offline/no-direct-access runs)
- `notes[]` (max 5)
- no `revised_plan`
- `validation_status.is_valid=false`

## Behavioral Guarantees

- Output is JSON only and machine-consumable.
- Output must remain deterministic for threshold defaults and tie-break ordering.
- `revised_plan.notes[]` remains concise (max 5) and limited to high-leverage
  tradeoffs, uncertainties, constraints, or risks.
- Output guardrails must explicitly prohibit domain-mode leakage in shared
  abstractions.
- Output guardrails must include constraints against new shared/common
  dumping-ground abstractions, endpoint bypass in hooks/UI, inline utility
  leakage in pages/sections, mega mode/flag component growth, forced multi-mode
  shared composites where section-level duplication is safer, refactor-only scope
  creep, and mixed migration plus feature-behavior churn unless explicitly
  requested.
- Missing/incomplete discovery evidence yields `dependency_error` and no
  decision package, plus explicit fallback context bundle requirements.
- Missing/invalid required inputs yield `validation_error` and no decision
  package.
- Decisions preserve `needed_artifact_id` continuity from input to output.
- Decisions must preserve discovery evidence (`found` paths or explicit `not_found`) for each artifact.
- Safe-update defaults are explicit when not overridden.
- Constraint dead-ends must emit `decision_blocked` with blocker context and
  `override_required=true`.
- Scope expansion requests, when present, must remain bounded and include
  concrete file-touch estimates, plus a short follow-up scope list.
- Import-boundary and write-control behavior is inherited from shared policy
  baseline rules and remains normative even when not duplicated in this
  contract body.

## Example Outcome Types

- Deterministic successful run with mixed `reuse`/`update`/`new`.
- Successful run with per-artifact `decision_blocked`.
- Validation failure before evaluation.
- Dependency failure before evaluation.
