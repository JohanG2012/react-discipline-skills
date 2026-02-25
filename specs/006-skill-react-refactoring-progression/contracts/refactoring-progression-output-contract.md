# Refactoring Progression Output Contract

## Purpose

Define the normative output interface produced by
`react-refactoring-progression` and consumed by planning/execution workflows.

## Scope

- **Producer**:
  `<REPO_ROOT>/skills/react-refactoring-progression/`
- **Consumers**:
  - `<REPO_ROOT>/skills/react-implementation-discipline/`
  - review and validation workflows consuming refactor plans
  - schema-driven automation checking output conformance

## Source of Truth

Contract artifacts for this feature:

- `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json`
- `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md`
- `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/spec.md`
- `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/plan.md`

Skill artifacts that must align with this contract:

- `<REPO_ROOT>/skills/react-refactoring-progression/SKILL.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/00_overview.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/10_process.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/30_validation_gates.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/40_scope_governor.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/50_detection.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/60_semantic_duplication.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/70_interactions.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/80_progression_model.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/90_duplicate_classification.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/100_duplicate_guardrails.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/rules/110_duplicate_output.md`
- `<REPO_ROOT>/skills/react-refactoring-progression/schemas/output.schema.json`

## Top-Level Contract

All outputs must include:

- `schema_version` (string)
- `skill` (`react-refactoring-progression`)
- `version` (string)
- `result_type` (`refactor_plan` | `validation_error` | `dependency_error`)
- `validation_status` (`accepted` | `blocked` | `validation_error` | `dependency_error`)

### Result Type: `refactor_plan`

Required fields:

- `refactor_mode` (`opportunistic` | `dedicated`)
- `plan`
  - `touch_budget`
    - `max_files_touched`
    - `max_new_files`
    - `max_moved_or_renamed`
    - `max_new_dependencies`
    - `max_new_top_level_folders`
    - optional `plan_step_cap`
  - `steps[]`
    - `tier` (`A` | `B` | `C` | `D`)
    - `title`
    - `files[]`
    - `change_type` (`safety` | `boundary` | `structure` | `abstraction` | `migration`)
    - `risk` (`low` | `medium` | `high`)
    - `behavior_change` (`none` | `requires_approval`)
    - `why_now`
    - at least one of `unblocks`, `reduces_future_cost`, `standard_alignment`
  - optional `behavior_preservation[]`
  - optional `anti_pattern_findings[]`
  - optional `semantic_duplication_clusters[]`
    - each cluster includes:
      - `pattern_type` and optional `type_explanation` when `pattern_type=other`
      - `candidate_files[]`, `signals[]` (at least 2 independent structural
        signals)
      - `evidence` (`shared_responsibility`, `structural_similarity[]`,
        `variation_surface`, `target_layer_rationale`)
      - `recommended_target`
      - `abstraction_cost` (`new_props_count`, `needs_mode_flags`,
        `needs_slots`, `touch_count_estimate`, `breaking_change_risk`)
      - `leakage_risk`, `divergence_risk`, `refactor_radius`
      - `why_now` and one of `unblocks` | `reduces_future_cost` |
        `standard_alignment`
      - `recommended_next_step`, `variation_points[]`, `candidate_api`,
        `non_goals[]`
      - `keep_separate_reason` when `recommended_target=keep_separate`
  - optional `scope_expansion_needed[]` (`why`, `would_touch`)
  - optional `follow_up_findings[]` for non-blocking out-of-mode findings
  - optional `test_file_touches[]` (default max 2)
  - optional `notes[]` (max 5)

Behavioral constraints:

- `validation_status` must be `accepted` or `blocked` when
  `result_type=refactor_plan`.
- Opportunistic mode must include only Tier A/B active steps and max 5 steps.
- Tier C/D opportunistic findings can be represented as non-blocking follow-up
  metadata.
- Opportunistic test-file updates are allowed only for directly related behavior
  validation, no new dependencies, and default max 2 files.
- If opportunistic test-file updates exceed default max 2 files, include
  explicit `scope_expansion_needed[]`.
- Dedicated-mode move/rename planning remains capped at 3 unless migration mode
  is explicitly enabled by approved scope.
- Step ordering is deterministic by tier then risk only.

### Result Type: `validation_error`

Required fields:

- `notes[]` (max 5)
- no `plan`
- `validation_status=validation_error`

### Result Type: `dependency_error`

Required fields:

- `dependency_issue`
- `fallback_context_bundle_requirements[]` (minimum 5 actionable items)
- `notes[]` (max 5)
- no `plan`
- `validation_status=dependency_error`

## Behavioral Guarantees

- Output is JSON only and machine-consumable.
- Envelope fields are mandatory for every result type.
- Missing required repository/discovery context yields `dependency_error` with
  no `plan` payload.
- Invalid/missing required request inputs yield `validation_error` with no
  `plan` payload.
- Step-level rationale and scope bounds remain explicit and deterministic.
- Behavior-preservation hard invariants cover backend contract compatibility,
  UI/UX stability, and external behavioral contract continuity.

## Example Outcome Types

- accepted refactor plan (opportunistic)
- blocked refactor plan (dedicated approval-gated step)
- validation error (missing required inputs)
- dependency error (missing repository/discovery context)
