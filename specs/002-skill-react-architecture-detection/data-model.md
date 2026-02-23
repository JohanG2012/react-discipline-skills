# Data Model: React Architecture Detection Skill

## Overview

This feature models the architecture-detection contract consumed by downstream
skills. The model captures repository classification, concern confidence,
gravity ownership, migration strategy, and pause behavior.

## Entities

### 1. ArchitectureDetectionRequest

- **Description**: Input payload for one detection run.
- **Fields**:
  - `request_id` (string, required): unique identifier for a single detection run.
  - `repo_root` (string, required): absolute path of the repository under analysis.
  - `task_scope` (enum, required): `small_change | feature_change | new_route | refactor`.
  - `target_architecture_ref` (string, required): reference to active architecture guidance.
  - `framework_hint` (enum, optional): `next | vite | cra | remix | unknown`.
  - `router_hint` (enum, optional): `react-router | tanstack-router | next-app-router | unknown`.
  - `state_hint` (enum, optional): `react-query | redux | zustand | unknown`.
- **Validation rules**:
  - `request_id` must be unique per run.
  - `repo_root` must resolve to an accessible repository path.

### 2. ConcernAssessment

- **Description**: Per-concern classification result used to build gravity output.
- **Fields**:
  - `concern_type` (enum, required): `routing | ui | domain | data_access | state`.
  - `home` (string, required): detected concern home path or `unknown`.
  - `confidence` (number, required): normalized score in `[0.0, 1.0]`.
  - `status` (enum, required): `resolved | ambiguous`.
  - `evidence_paths` (array[string], required): paths/signals supporting classification.
- **Validation rules**:
  - For `confidence >= 0.7`, `status` must be `resolved`.
  - For `confidence < 0.7`, `home` must be `unknown` and `status` must be `ambiguous`.
  - One assessment per `concern_type` is required per run.

### 3. GravityMap

- **Description**: Canonical ownership map reused by downstream skills.
- **Fields**:
  - `pages_or_routes` (string, required)
  - `domain_modules` (string, required)
  - `ui_primitives` (string, required)
  - `ui_composites` (string, required)
  - `api` (string, required)
  - `store` (string, required)
  - `pure_utils` (string, required)
  - `generic_hooks` (string, required)
  - `app_setup` (string, required)
- **Validation rules**:
  - Each field stores exactly one authoritative home for the task.
  - Concern homes must not represent parallel active homes for the same concern.

### 4. StrategyDecision

- **Description**: Single migration strategy chosen for the run.
- **Fields**:
  - `strategy` (enum, required): `follow-existing | introduce-boundaries | migrate-as-you-touch`.
  - `rationale` (array[string], required): concise reasons supporting strategy.
  - `prevents_parallel_homes` (boolean, required): always `true`.
- **Validation rules**:
  - Exactly one `strategy` value is allowed per run.
  - Rationale must describe why alternatives were not selected.

### 5. AlignmentAssessment

- **Description**: Closeness to target architecture plus blockers.
- **Fields**:
  - `alignment_score` (integer, required): value in `[0, 100]`.
  - `blockers` (array[string], required): top issues reducing alignment.
  - `next_migration_step` (string, required): one recommended next step.
- **Validation rules**:
  - `alignment_score` must remain within `0-100`.
  - `next_migration_step` must describe one concrete step only.

### 6. PauseDecisionRecord

- **Description**: Structured pause artifact for high-impact low-confidence ambiguity.
- **Fields**:
  - `pause_required` (boolean, required)
  - `trigger` (string, required when pause required): structural ambiguity cause.
  - `options` (array[string], required when pause required): 2-3 bounded options.
  - `recommended_option` (string, required when pause required)
  - `resolution` (string, optional): accepted option/answer.
- **Validation rules**:
  - If any structural concern has `confidence < 0.7`, `pause_required` must be `true`.
  - If `pause_required=true`, `trigger`, `options`, and `recommended_option` are mandatory.

### 7. ArchitectureDetectionOutput

- **Description**: Machine-consumable output payload produced by the skill.
- **Fields**:
  - `schema_version` (string, required): contract schema identifier.
  - `routing` (object, required): includes routing type and entry points.
  - `ui` (object, required): concern assessment for UI home.
  - `api` (object, required): concern assessment for canonical endpoint home.
  - `domain` (object, required): concern assessment for domain organization home.
  - `state` (object, required): concern assessment for state ownership home.
  - `gravity_map` (object, required): canonical ownership map.
  - `alignment_score` (integer, required): score in `[0, 100]`.
  - `alignment` (object, required): blockers and one recommended next migration step.
  - `strategy` (enum, required): single strategy for the run.
  - `strategy_rationale` (array[string], required): at least one rationale entry.
  - `pause_decision` (object, required): pause metadata for this run.
  - `notes` (array[string], required): metadata notes, maximum 5 entries.
  - `skill` (string, optional): `react_architecture_detection`.
  - `version` (string, optional): skill version identifier.
- **Validation rules**:
  - Output must contain structural metadata only.
  - Raw code snippets are not allowed in standard output.
  - If any structural concern has `confidence < 0.7`, `pause_decision.pause_required` must be `true`.

## Relationships

- `ArchitectureDetectionRequest (1) -> (many) ConcernAssessment`
- `ConcernAssessment (many) -> (1) GravityMap`
- `ArchitectureDetectionRequest (1) -> (1) StrategyDecision`
- `ArchitectureDetectionRequest (1) -> (1) AlignmentAssessment`
- `ArchitectureDetectionRequest (1) -> (1) PauseDecisionRecord`
- `ArchitectureDetectionRequest (1) -> (1) ArchitectureDetectionOutput`

## State Transitions

### ConcernAssessment

- `collecting -> resolved` (confidence `>= 0.7`)
- `collecting -> ambiguous` (confidence `< 0.7`, home forced to `unknown`)

### PauseDecisionRecord

- `not-required -> required` (low-confidence structural ambiguity detected)
- `required -> resolved` (option selected and recorded)

### StrategyDecision

- `unselected -> selected -> confirmed`

## Traceability to Requirements

- `FR-002`, `FR-003`, `FR-004`, `FR-005`, `FR-006`, `FR-007`: input and concern classification entities.
- `FR-008`: `GravityMap`.
- `FR-009`: `AlignmentAssessment`.
- `FR-010`, `FR-014`: `StrategyDecision`.
- `FR-012`, `FR-017`: `PauseDecisionRecord` and low-confidence rules.
- `FR-013`, `FR-016`: `ArchitectureDetectionOutput` schema versioning and metadata-only output.
- `SC-004`, `SC-007`, `SC-008`: pause, snippet exclusion, and `unknown` handling constraints.
