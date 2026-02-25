# Data Model: React Refactoring Progression Skill

## Overview

This feature models deterministic, plan-only refactor guidance for an optional
extension skill. The model captures mode-specific scope boundaries,
behavior-preservation checks, ordered tier progression (`A-D`), anti-pattern and
semantic-duplication findings, and strict output envelopes for downstream
consumers.

## Entities

### 1. RefactorPlanningRequest

- **Description**: Input payload for one refactor-planning run.
- **Fields**:
  - `request_id` (string, required): unique run identifier.
  - `task_request` (string, required): user/task refactor intent summary.
  - `refactor_mode` (enum, required): `opportunistic | dedicated`.
  - `input_refs` (object, required): references to upstream context (`detection_result_ref`, `placement_result_ref`, `reuse_decisions_ref`, `implementation_context_ref`).
  - `touched_file_set` (array[string], required for opportunistic mode): files already touched by primary implementation.
  - `scope_policy` (ScopeBudget, optional): explicit scope overrides.
  - `migration_scope_enabled` (boolean, optional, default `false`).
- **Validation rules**:
  - Missing required refs yields `validation_error`.
  - `opportunistic` mode requires non-empty `touched_file_set`.
  - `migration_scope_enabled` may only affect higher-tier eligibility in dedicated mode.

### 2. ScopeBudget

- **Description**: Scope governor constraints active for the run.
- **Fields**:
  - `max_files_touched` (integer, required, default `8`)
  - `max_new_files` (integer, required, default `4`)
  - `max_moved_or_renamed` (integer, required, default `0`)
  - `max_new_dependencies` (integer, required, default `0`)
  - `max_new_top_level_folders` (integer, required, default `0`)
  - `plan_step_cap` (integer, required, default `5` in opportunistic mode)
- **Validation rules**:
  - Values must be non-negative integers.
  - Opportunistic mode must not exceed current touched-file set size.

### 3. RefactorStep

- **Description**: One ordered refactor recommendation.
- **Fields**:
  - `step_id` (string, required)
  - `tier` (enum, required): `A | B | C | D`
  - `title` (string, required)
  - `files` (array[string], required)
  - `change_type` (enum, required): `safety | boundary | structure | abstraction | migration`
  - `risk` (enum, required): `low | medium | high`
  - `behavior_change` (enum, required): `none | requires_approval`
  - `why_now` (string, required)
  - `unblocks` (string, optional)
  - `reduces_future_cost` (string, optional)
  - `standard_alignment` (string, optional)
- **Validation rules**:
  - At least one of `unblocks`, `reduces_future_cost`, or `standard_alignment` is required.
  - `tier` order must be non-decreasing across the step list.
  - `behavior_change=requires_approval` requires explicit approval gating metadata in notes.

### 4. BehaviorPreservationRecord

- **Description**: Per-step behavior-safety verification outcome.
- **Fields**:
  - `step_id` (string, required)
  - `invariants_checked` (array[string], required)
  - `status` (enum, required): `pass | fail | needs_approval`
  - `details` (string, optional)
- **Validation rules**:
  - `fail` status cannot be emitted in `accepted` final state.

### 5. AntiPatternFinding

- **Description**: One anti-pattern detection and planned remediation.
- **Fields**:
  - `finding_id` (string, required)
  - `type` (enum, required): `implicit_visibility`, `fetch_outside_endpoint_layer`, `domain_leakage_shared_ui`, `redundant_server_state_mirror`, `other`
  - `tier` (enum, required): `A | B | C | D`
  - `affected_files` (array[string], required)
  - `recommended_step_id` (string, required)
- **Validation rules**:
  - Findings in out-of-mode tiers are represented as non-blocking follow-up only.

### 6. SemanticDuplicationCluster

- **Description**: Structurally similar responsibility group with one extraction recommendation.
- **Fields**:
  - `cluster_id` (string, required)
  - `candidate_files` (array[string], required, min 2)
  - `signals` (array[string], required, min 2)
  - `recommended_target` (enum, required): `keep_separate | extract_ui_primitive | extract_ui_composite | extract_feature_section | extract_feature_hook | extract_lib_utility`
  - `abstraction_cost` (integer, required, min 0)
  - `leakage_risk` (enum, required): `low | medium | high`
  - `divergence_risk` (enum, required): `low | medium | high`
  - `refactor_radius` (enum, required): `local | medium | large`
  - `recommended_next_step` (string, required)
  - `variation_points` (array[string], required)
- **Validation rules**:
  - Clusters require at least two independent similarity signals.
  - `extract_ui_composite` is invalid when domain-mode flags would be required.

### 7. ScopeExpansionItem

- **Description**: Bounded out-of-cap follow-up guidance.
- **Fields**:
  - `why` (string, required)
  - `would_touch` (integer, required, minimum `1`)
- **Validation rules**:
  - Must reference concrete scope pressure and estimated impact.

### 8. RefactorPlanPayload

- **Description**: Success-path planning payload.
- **Fields**:
  - `touch_budget` (ScopeBudget, required)
  - `steps` (array[RefactorStep], required)
  - `behavior_preservation` (array[BehaviorPreservationRecord], required)
  - `anti_pattern_findings` (array[AntiPatternFinding], optional)
  - `semantic_duplication_clusters` (array[SemanticDuplicationCluster], optional)
  - `scope_expansion_needed` (array[ScopeExpansionItem], optional)
  - `notes` (array[string], optional, max 5)
- **Validation rules**:
  - `steps` length in opportunistic mode must be `<=5`.
  - Tier C/D steps in opportunistic mode must not be included as active steps.

### 9. ValidationStatus

- **Description**: Required final-state status in every top-level output.
- **Fields**:
  - `value` (enum, required): `accepted | blocked | validation_error | dependency_error`
- **Validation rules**:
  - `result_type=refactor_plan` requires `value` in `accepted | blocked`.
  - `result_type=validation_error` requires `value=validation_error`.
  - `result_type=dependency_error` requires `value=dependency_error`.

### 10. RefactorPlanOutput

- **Description**: Successful top-level output.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (const, required): `react-refactoring-progression`
  - `version` (string, required)
  - `result_type` (const, required): `refactor_plan`
  - `validation_status` (ValidationStatus, required)
  - `refactor_mode` (enum, required): `opportunistic | dedicated`
  - `plan` (RefactorPlanPayload, required)

### 11. ValidationErrorOutput

- **Description**: Top-level output for invalid/missing inputs.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (const, required)
  - `version` (string, required)
  - `result_type` (const, required): `validation_error`
  - `validation_status` (ValidationStatus, required)
  - `notes` (array[string], required, max 5)
- **Validation rules**:
  - Must not include `plan`.

### 12. DependencyErrorOutput

- **Description**: Top-level output for missing repository/discovery context.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (const, required)
  - `version` (string, required)
  - `result_type` (const, required): `dependency_error`
  - `validation_status` (ValidationStatus, required)
  - `dependency_issue` (string, required)
  - `fallback_context_bundle_requirements` (array[string], required, min 5)
  - `notes` (array[string], required, max 5)
- **Validation rules**:
  - Must not include `plan`.

## Relationships

- `RefactorPlanningRequest (1) -> (0..1) ScopeBudget`
- `RefactorPlanOutput (1) -> (1) RefactorPlanPayload`
- `RefactorPlanPayload (1) -> (many) RefactorStep`
- `RefactorPlanPayload (1) -> (many) BehaviorPreservationRecord`
- `RefactorPlanPayload (1) -> (0..many) AntiPatternFinding`
- `RefactorPlanPayload (1) -> (0..many) SemanticDuplicationCluster`
- `RefactorPlanPayload (1) -> (0..many) ScopeExpansionItem`

## State Transitions

### Output State Flow

- `input_received -> validation_error` (required inputs invalid or incomplete)
- `input_received -> dependency_error` (repository/discovery context unavailable)
- `input_received -> accepted` (valid plan output produced)
- `input_received -> blocked` (plan produced but includes gated/non-auto-approvable steps)

### Step Escalation Flow

- `Tier A -> Tier B -> Tier C -> Tier D` (non-decreasing risk order)
- Opportunistic mode is limited to Tier A/B active steps; Tier C/D are follow-up only.
- Dedicated mode may include Tier C/D when escalation conditions are met.

## Invariants

- Every output includes strict envelope fields and `validation_status`.
- `validation_status` values are limited to `accepted | blocked | validation_error | dependency_error`.
- `dependency_error` always includes actionable fallback context-bundle requirements.
- `validation_error` and `dependency_error` never include `plan` payloads.
- `scope_expansion_needed` entries remain bounded (`why`, `would_touch`).
