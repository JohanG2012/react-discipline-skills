# Data Model: React Placement and Layering Skill

## Overview

This feature models the placement-planning contract used after architecture
detection and before implementation planning. The model captures input
validation, source-of-truth precedence, planned artifacts, and output safety.

## Entities

### 1. PlacementPlanningRequest

- **Description**: Input payload for a single placement-planning run.
- **Fields**:
  - `request_id` (string, required): unique identifier for one run.
  - `request_text` (string, required): implementation request in natural language.
  - `target_architecture_ref` (string, required): reference to active architecture guidance.
  - `detection_result_ref` (string, required): reference to architecture-detection output.
  - `existing_artifacts` (array[string], optional): user-provided artifact hints.
  - `constraints` (object, optional): explicit run constraints.
- **Validation rules**:
  - `request_id`, `request_text`, `target_architecture_ref`, and `detection_result_ref` are required for valid planning.
  - Missing required fields trigger a validation error output with no plan.

### 2. ConstraintProfile

- **Description**: Optional planning limits and policy preferences.
- **Fields**:
  - `avoid_new_folders` (boolean, optional)
  - `max_files_touched` (integer, optional)
  - `prefer_api_root` (boolean, optional)
  - `prefer_react_query` (boolean, optional)
- **Validation rules**:
  - If set, `max_files_touched` must be greater than `0`.
  - Constraint violations must be surfaced in `validation_status.errors`.

### 3. DetectionSignal

- **Description**: Upstream architecture signal used during placement.
- **Fields**:
  - `strategy_hint` (enum, required): `follow-existing | introduce-boundaries | migrate-as-you-touch`.
  - `gravity_map` (object, required): concern-home map from detection.
  - `concern_confidence` (object, required): confidence by concern.
  - `notes` (array[string], optional)
- **Validation rules**:
  - `gravity_map` must include one home per required concern.
  - `concern_confidence` values are normalized to `[0.0, 1.0]`.

### 4. SourceOfTruthResolution

- **Description**: Deterministic conflict-resolution result per conflicting concern.
- **Fields**:
  - `concern` (string, required)
  - `default_source` (enum, required): `architecture_detection`
  - `architecture_confidence` (number, required)
  - `override_threshold` (number, required): fixed at `0.7`
  - `effective_source` (enum, required): `architecture_detection | repository_evidence`
  - `resolution_mode` (enum, required): `inherited | pause_resolved`
  - `resolution_reason` (string, required)
- **Validation rules**:
  - If `architecture_confidence < 0.7`, `effective_source` must be `repository_evidence`.
  - If `effective_source=repository_evidence`, `resolution_mode` must be `pause_resolved`.
  - If `architecture_confidence >= 0.7`, `effective_source` must be `architecture_detection`.

### 5a. LayerJustification

- **Description**: One concise rationale for why a touched layer is correct.
- **Fields**:
  - `layer` (string, required)
  - `rationale` (string, required)
- **Validation rules**:
  - At least one layer justification must be present for successful plans.

### 5b. DecisionExplanation

- **Description**: Short explanation that ties detected signals to chosen
  placement direction.
- **Fields**:
  - `detected_signals` (array[string], required)
  - `chosen_direction` (string, required)
- **Validation rules**:
  - `detected_signals` must contain at least one non-empty signal.
  - `chosen_direction` must be concise and deterministic.

### 5c. MoveOperation

- **Description**: Explicit move/rename metadata for migration-enabled plans.
- **Fields**:
  - `old_path` (string, required)
  - `new_path` (string, required)
  - `import_update_targets` (array[string], required)
- **Validation rules**:
  - Move operations are allowed only in explicit migration scope.
  - Move operations are limited to three files or fewer per run.
  - Each move must include explicit import-update targets.

### 5d. AuthoritativeHomeMap

- **Description**: Concise map of authoritative homes used consistently for the
  current run.
- **Fields**:
  - `ui` (string, optional)
  - `api` (string, optional)
  - `domain` (string, optional)
  - `routing` (string, optional)
  - `store` (string, optional)
  - `core` (string, optional)
- **Validation rules**:
  - At least one concern home must be present in successful plans.
  - Homes must reflect detected gravity or explicitly pause-resolved overrides.

### 5e. ScopeExpansionNeed

- **Description**: Structured record for additional out-of-cap follow-up work
  that would materially improve completeness.
- **Fields**:
  - `why` (string, required): concise reason extra scope is beneficial.
  - `would_touch` (integer, required): additional file touches expected.
- **Validation rules**:
  - `would_touch` must be greater than `0`.
  - Entries are plan-only and do not replace required in-cap output.

### 6. PlannedArtifact

- **Description**: A single planned file touch in the output plan.
- **Fields**:
  - `purpose` (string, required)
  - `action` (enum, required): `reuse | update | create`
  - `action_rationale` (string, required): concise reason for selected action.
  - `layer` (string, required)
  - `path` (string, required): repository-relative target path.
  - `depends_on` (array[string], optional)
- **Validation rules**:
  - Each artifact must map to one layer only.
  - `action_rationale` must be present and non-empty.
  - `path` must be non-empty and deterministic.

### 7. GuardrailEvaluation

- **Description**: Boundary-check result for planned artifact dependencies.
- **Fields**:
  - `rule_id` (string, required)
  - `status` (enum, required): `pass | fail`
  - `message` (string, required)
  - `affected_paths` (array[string], optional)
- **Validation rules**:
  - Any `fail` status must be represented in `validation_status.errors`.
  - Plan finalization requires no unresolved guardrail failures.

### 8. ValidationStatus

- **Description**: Structured validity state for the current run.
- **Fields**:
  - `is_valid` (boolean, required)
  - `stage` (enum, required): `input_validation | planning | finalized`
  - `errors` (array[string], required)
  - `warnings` (array[string], optional)
- **Validation rules**:
  - `is_valid=false` requires at least one error entry.
  - `is_valid=true` requires an empty `errors` array.

### 9. PlacementPlanOutput

- **Description**: Strict versioned output payload for successful planning runs.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (string, required): `react_placement_and_layering`
  - `version` (string, required): skill version.
  - `result_type` (enum, required): `plan`
  - `strategy_used` (enum, required): `follow-existing | introduce-boundaries | migrate-as-you-touch`
  - `feature_owner` (string, required)
  - `canonical_endpoint_layer` (string, required)
  - `authoritative_home_map` (AuthoritativeHomeMap, required)
  - `artifacts` (array[PlannedArtifact], required)
  - `layer_justifications` (array[LayerJustification], required)
  - `decision_explanation` (DecisionExplanation, required)
  - `import_guardrails` (array[string], required)
  - `source_of_truth_resolutions` (array[SourceOfTruthResolution], required)
  - `move_operations` (array[MoveOperation], optional)
  - `move_concern` (string, optional): required when `move_operations` is present.
  - `scope_expansion_needed` (array[ScopeExpansionNeed], optional)
  - `validation_status` (ValidationStatus, required)
  - `notes` (array[string], required, max 5)
- **Validation rules**:
  - `validation_status.is_valid` must be `true`.
  - `notes` and all text fields must remain structural and must not include raw source snippets or secret-like values.
  - If `move_operations` is present, strategy must be `migrate-as-you-touch`.
  - If `move_operations` is present, `move_concern` must be present.
  - If `scope_expansion_needed` is present, it must include only structured
    `why`/`would_touch` entries and still accompany an in-cap plan.

### 10. ValidationErrorOutput

- **Description**: Strict versioned output payload for failed input validation.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (string, required): `react_placement_and_layering`
  - `version` (string, required)
  - `result_type` (enum, required): `validation_error`
  - `validation_status` (ValidationStatus, required)
  - `notes` (array[string], required, max 5)
- **Validation rules**:
  - `validation_status.is_valid` must be `false`.
  - No placement artifacts are present in validation-error output.

## Relationships

- `PlacementPlanningRequest (1) -> (0..1) ConstraintProfile`
- `PlacementPlanningRequest (1) -> (1) DetectionSignal`
- `PlacementPlanningRequest (1) -> (many) SourceOfTruthResolution`
- `PlacementPlanningRequest (1) -> (many) PlannedArtifact` (for successful runs)
- `PlacementPlanningRequest (1) -> (many) GuardrailEvaluation`
- `PlacementPlanningRequest (1) -> (0..many) ScopeExpansionNeed`
- `PlacementPlanningRequest (1) -> (1) ValidationStatus`
- `ValidationStatus (1) -> (1) PlacementPlanOutput | ValidationErrorOutput`

## State Transitions

### ValidationStatus

- `input_validation -> validation_error` (required input missing/invalid)
- `input_validation -> planning` (all required inputs valid)
- `planning -> finalized` (guardrails pass and plan output emitted)

### SourceOfTruthResolution

- `unresolved -> architecture_detection_selected` (confidence `>= 0.7`)
- `unresolved -> repository_evidence_selected` (confidence `< 0.7`)

### PlannedArtifact

- `candidate -> accepted` (layer, path, and guardrails validated)
- `candidate -> rejected` (guardrail failure or duplicate-home conflict)

## Traceability to Requirements

- `FR-002`, `FR-003`, `FR-020`, `FR-021`: `PlacementPlanningRequest` and `ValidationStatus`.
- `FR-004`, `FR-005`, `FR-012`: `DetectionSignal` and `SourceOfTruthResolution`.
- `FR-006`, `FR-007`, `FR-008`, `FR-011`: `PlannedArtifact` and `PlacementPlanOutput`.
- `FR-009`, `FR-014`, `FR-016`: `GuardrailEvaluation` and planning-scope limits.
- `FR-018`, `FR-019`: strict versioned contract fields and mandatory-field validation.
- `FR-022`, `FR-023`: precedence and `0.7` confidence-threshold behavior.
- `FR-024`: structural-only output and sensitive-content exclusion.
- `FR-029`: request classification before artifact planning.
- `FR-030`, `FR-031`: cross-layer error ownership and state-persistence policy constraints.
- `FR-032`: structured scope expansion escape hatch (`ScopeExpansionNeed`).
- `FR-033`, `FR-034`: documentation write-control and implementation handoff format alignment.
- `SC-007`, `SC-008`, `SC-009`, `SC-010`, `SC-012`, `SC-013`: contract conformance, fail-fast validation, precedence consistency, sensitive-output exclusion, scope-expansion structure, and persistence-policy adherence.
