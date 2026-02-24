# Data Model: React Reuse vs Update vs New Skill

## Overview

This feature models deterministic reuse decision outputs consumed after
architecture detection and placement planning. The model captures stable artifact
identity, discovery evidence, scoring thresholds, tie-break behavior, blocked
outcomes, scope-governor expansion signaling, and fallback dependency behavior
when repository evidence is unavailable.

## Entities

### 1. ReuseDecisionRequest

- **Description**: Input payload for one reuse/update/new evaluation run.
- **Fields**:
  - `request_id` (string, required): unique run identifier.
  - `task_request` (string, required): request summary for the decision run.
  - `detection_result_ref` (string, required): reference to architecture-detection output.
  - `placement_plan_ref` (string, required): reference to placement-plan output.
  - `needed_artifacts` (array[NeededArtifact], required): artifacts to evaluate.
  - `thresholds` (ThresholdProfile, optional): explicit threshold overrides.
  - `constraints` (ConstraintProfile, optional): run-level constraints.
- **Validation rules**:
  - Missing required fields return `validation_error`.
  - Empty `needed_artifacts` is invalid.

### 2. ThresholdProfile

- **Description**: Policy limits that define safe update vs new/blocked behavior.
- **Fields**:
  - `max_new_props_for_update` (integer, required, default `2`)
  - `max_flags_allowed_composites` (integer, required, default `0` for domain modes)
  - `max_generic_flags_allowed_primitives` (integer, required, default `1`)
  - `max_abstraction_risk_score` (number, required, default `6`)
- **Validation rules**:
  - All fields must be non-negative.
  - Missing override fields fall back to defaults.

### 3. ConstraintProfile

- **Description**: Run-level constraints that can restrict allowed decisions.
- **Fields**:
  - `avoid_new_artifacts` (boolean, optional)
  - `max_updates` (integer, optional)
  - `restricted_paths` (array[string], optional)
  - `policy_notes` (array[string], optional)
- **Validation rules**:
  - Constraint conflicts that eliminate all safe paths produce
    `decision_blocked` per affected artifact.

### 4. NeededArtifact

- **Description**: One required capability needing a final decision.
- **Fields**:
  - `needed_artifact_id` (string, required): stable identity key.
  - `artifact_label` (string, required): human-readable label.
  - `layer_hint` (string, optional)
  - `purpose` (string, required)
  - `constraints` (array[string], optional)
- **Validation rules**:
  - `needed_artifact_id` must be unique within a run.
  - Identity remains unchanged through scoring and output.

### 5. CandidateArtifact

- **Description**: Existing repository candidate considered for reuse/update.
- **Fields**:
  - `candidate_id` (string, required)
  - `path` (string, required)
  - `owner_home` (string, required)
  - `artifact_type` (enum, required): `primitive | composite | section | domain | api | hook | other`
  - `discovery_source` (enum, required): `exact_name | pattern_match | underlying_primitive | endpoint_dto_hook`
  - `notes` (array[string], optional)
- **Validation rules**:
  - `path` must be repository-relative and non-empty.
  - Candidate absence is valid and may lead to `new` or `decision_blocked`.

### 6. ScoreProfile

- **Description**: Deterministic score record for one chosen or compared path.
- **Fields**:
  - `fit` (number, required, `0..10`)
  - `complexity_cost` (number, required, `0..10`)
  - `coupling_risk` (number, required, `0..10`)
  - `divergence_risk` (number, required, `0..10`)
  - `locality_benefit` (number, required, `0..10`)
- **Validation rules**:
  - All five fields are required when score profile is present.
  - Out-of-range values are invalid.

### 7. TieBreakRecord

- **Description**: Tie-break trace for equal-score candidates.
- **Fields**:
  - `applied` (boolean, required)
  - `ordered_criteria` (array[string], required)
  - `selected_candidate_id` (string, optional)
- **Validation rules**:
  - Criteria order must be:
    `authoritative_home`, `coupling_risk`, `divergence_risk`,
    `complexity_cost`, `lexical_path`.

### 8. DecisionRecord

- **Description**: Final decision for one needed artifact.
- **Fields**:
  - `needed_artifact_id` (string, required)
  - `decision` (enum, required): `reuse | update | new | decision_blocked`
  - `decision_mark` (enum, required): `reuse as-is | updated | new | decision_blocked`
  - `discovery_status` (enum, required): `found | not_found`
  - `discovery_paths` (array[string], required when `discovery_status=found`)
  - `target_path` (string, required for `reuse|update|new`)
  - `chosen_candidate_id` (string, optional)
  - `score_profile` (ScoreProfile, required for `reuse|update|new`)
  - `tie_break` (TieBreakRecord, optional)
  - `reasons` (array[string], required, min 1)
  - `constraint_blockers` (array[string], required for `decision_blocked`)
  - `override_required` (boolean, required)
- **Validation rules**:
  - `decision_mark` must align with `decision`.
  - `decision_blocked` requires `override_required=true`.
  - `reuse|update` require `discovery_status=found`.

### 9. ContextDecisions

- **Description**: Required upstream-minimum context carried in the revised plan.
- **Fields**:
  - `feature_owner_domain` (string, required)
  - `route_page_involvement` (enum, required): `route | page | none`
  - `data_sources_summary` (array[string], required)
  - `state_type` (enum, required): `server-state | local-state | global-store | mixed`
  - `ui_need_shape` (string, required)

### 10. FileAction

- **Description**: Planned file touch action emitted by reuse planning.
- **Fields**:
  - `action` (enum, required): `Create | Update | Reuse`
  - `path` (string, required)
  - `needed_artifact_id` (string, required)

### 11. LayerJustification

- **Description**: Concise layer-choice explanation.
- **Fields**:
  - `layer` (string, required)
  - `justification` (string, required)
  - `adjacent_layers_not_chosen` (string, required)

### 12. MoveAction

- **Description**: Optional explicit move/rename action for migration-scoped plans.
- **Fields**:
  - `from_path` (string, required)
  - `to_path` (string, required)
  - `import_update_targets` (array[string], required)

### 13. GuardrailSet

- **Description**: Non-negotiable constraints attached to the run.
- **Fields**:
  - `rules` (array[string], required)
- **Validation rules**:
  - Must include anti-leakage and anti-chaotic-change constraints.

### 14. ScopeExpansionItem

- **Description**: Structured expansion request when cap-bound output is insufficient.
- **Fields**:
  - `why` (string, required)
  - `would_touch` (integer, required, `>=1`)

### 15. RevisedPlan

- **Description**: Downstream-ready plan with finalized decisions.
- **Fields**:
  - `source_plan_ref` (string, required)
  - `context_decisions` (ContextDecisions, required)
  - `file_actions` (array[FileAction], required)
  - `layer_justifications` (array[LayerJustification], required)
  - `decisions` (array[DecisionRecord], required)
  - `guardrails` (array[string], required)
  - `notes` (array[string], required, max 5)
  - `follow_up_scope` (array[string], optional, max 5; required when scope expansion is present)
  - `move_actions` (array[MoveAction], optional)
- **Validation rules**:
  - One decision per `needed_artifact_id`.
  - No contradictory decisions for same artifact ID.

### 16. ValidationStatus

- **Description**: Structured run validity state.
- **Fields**:
  - `is_valid` (boolean, required)
  - `stage` (enum, required): `input_validation | discovery | decisioning | finalized`
  - `errors` (array[string], required)
  - `warnings` (array[string], optional)

### 17. DecisionPlanOutput

- **Description**: Strict success output.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (string, required; `react_reuse_update_new`)
  - `version` (string, required)
  - `result_type` (enum, required): `decision_plan`
  - `validation_status` (ValidationStatus, required; `is_valid=true`)
  - `thresholds_applied` (ThresholdProfile, required)
  - `revised_plan` (RevisedPlan, required)
  - `scope_expansion_needed` (array[ScopeExpansionItem], optional)

### 18. ValidationErrorOutput

- **Description**: Strict invalid-input output.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (string, required)
  - `version` (string, required)
  - `result_type` (enum, required): `validation_error`
  - `validation_status` (ValidationStatus, required; `is_valid=false`)
  - `notes` (array[string], required, max 5)

### 19. DependencyErrorOutput

- **Description**: Strict no-repo-evidence output.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (string, required)
  - `version` (string, required)
  - `result_type` (enum, required): `dependency_error`
  - `validation_status` (ValidationStatus, required; `is_valid=false`)
  - `dependency_issue` (string, required)
  - `fallback_context_bundle_requirements` (array[string], required, min 5)
  - `notes` (array[string], required, max 5)

## Relationships

- `ReuseDecisionRequest (1) -> (many) NeededArtifact`
- `ReuseDecisionRequest (1) -> (0..1) ConstraintProfile`
- `ReuseDecisionRequest (1) -> (1) ThresholdProfile (applied defaults/overrides)`
- `NeededArtifact (1) -> (many) CandidateArtifact`
- `NeededArtifact (1) -> (1) DecisionRecord`
- `DecisionRecord (many) -> (1) RevisedPlan`
- `RevisedPlan (1) -> (0..many) MoveAction`
- `DecisionPlanOutput (0..1) -> (0..many) ScopeExpansionItem`
- `ValidationStatus (1) -> (1) DecisionPlanOutput | ValidationErrorOutput | DependencyErrorOutput`

## State Transitions

### ValidationStatus

- `input_validation -> validation_error` (required input missing/invalid)
- `input_validation -> discovery` (required input valid)
- `discovery -> dependency_error` (no/incomplete discovery evidence)
- `discovery -> decisioning` (evidence available)
- `decisioning -> finalized` (decision package completed)

### DecisionRecord

- `candidate -> reuse` (reuse thresholds and leakage constraints pass)
- `candidate -> update` (safe-update thresholds and compatibility pass)
- `candidate -> new` (no safe reuse/update candidate)
- `candidate -> decision_blocked` (constraints remove all safe options)

## Traceability to Requirements

- `FR-002`, `FR-015`, `FR-024`, `FR-027`: input/dependency validation entities
- `FR-003` to `FR-005`, `FR-017`, `FR-026`: ladder + final decision records
- `FR-006`, `FR-022`, `FR-030`: scoring + tie-break entities
- `FR-007`, `FR-018`, `FR-021`: threshold profile and defaults
- `FR-008`, `FR-009`, `FR-013`: guardrail constraints
- `FR-010`, `FR-023`: `decision_blocked` semantics
- `FR-011`, `FR-019`, `FR-025`: reasoning/evidence/identity continuity
- `FR-012`, `FR-029`, `FR-030`: revised plan structure and follow-up scope behavior
- `FR-028`: scope expansion structures
- `FR-014`, `FR-016`, `FR-020`: bounded planning scope + upstream/policy alignment
