# Data Model: React Implementation Discipline Skill

## Overview

This feature models disciplined implementation execution output after upstream
planning and reuse decisions are complete. The model captures plan-fidelity
checks, boundary and quality-gate audit outcomes, scope-governor deviations,
blocked-state handling, dependency failures, and structured validation summaries
for deterministic downstream consumption.

## Entities

### 1. ImplementationDisciplineRequest

- **Description**: Input payload for one implementation-discipline execution run.
- **Fields**:
  - `request_id` (string, required): unique run identifier.
  - `task_request` (string, required): requested change summary.
  - `revised_plan_ref` (string, required): reference to upstream revised plan.
  - `detection_result_ref` (string, required): reference to architecture detection output.
  - `reuse_decisions_ref` (string, required): reference to reuse decision output.
  - `planned_actions` (array[RevisedPlanAction], required): planned file actions.
  - `scope_policy` (ScopeGovernorPolicy, optional): explicit scope overrides.
- **Validation rules**:
  - Missing required references return `validation_error`.
  - Empty `planned_actions` is invalid.

### 2. RevisedPlanAction

- **Description**: One planned file touch carried from upstream planning.
- **Fields**:
  - `action` (enum, required): `Create | Update | Reuse`.
  - `path` (string, required): repository-relative target path.
  - `layer` (string, required): architectural layer assignment.
  - `needed_artifact_id` (string, optional): upstream artifact trace key.
- **Validation rules**:
  - `path` must be non-empty and unique per action record.

### 3. ScopeGovernorPolicy

- **Description**: Scope constraints applied during execution.
- **Fields**:
  - `max_files_touched` (integer, required, default `8`)
  - `max_new_files` (integer, required, default `4`)
  - `allow_new_dependencies` (boolean, required, default `false`)
  - `allow_out_of_scope` (boolean, required, default `false`)
- **Validation rules**:
  - Exceeding limits requires explicit `scope_expansion_needed` output.

### 4. QualityCheckResult

- **Description**: One final quality-gate check result.
- **Fields**:
  - `check_id` (string, required)
  - `status` (enum, required): `pass | fail`
  - `summary` (string, required)
  - `required_fix` (string, optional)
- **Validation rules**:
  - Failed checks require non-empty `required_fix` entry in blocked runs.

### 5. BoundaryAuditFinding

- **Description**: One boundary/import-direction audit outcome.
- **Fields**:
  - `file_path` (string, required)
  - `status` (enum, required): `pass | fail`
  - `issues` (array[string], optional)
- **Validation rules**:
  - `issues` is required and non-empty when `status=fail`.

### 6. ScopeDeviation

- **Description**: One scope or churn deviation observed during execution.
- **Fields**:
  - `type` (enum, required): `out_of_plan_touch | out_of_scope_request | scope_limit_exceeded | other`
  - `description` (string, required)
  - `action_taken` (enum, required): `excluded | accepted_exception | scope_expansion`
- **Validation rules**:
  - `accepted_exception` is allowed only when explicitly approved.

### 7. PatchUpdate

- **Description**: Patch-style update payload for a modified existing file.
- **Fields**:
  - `path` (string, required)
  - `patch` (string, required)

### 8. NewFileArtifact

- **Description**: Full content payload for a newly created file.
- **Fields**:
  - `path` (string, required)
  - `content` (string, required)

### 9. ImplementationOutputPackage

- **Description**: Reviewable output package for successful context execution (`accepted` or `blocked`).
- **Fields**:
  - `changed_files` (array[string], required)
  - `updated_patches` (array[PatchUpdate], optional)
  - `new_files` (array[NewFileArtifact], optional)
  - `quality_checks` (array[QualityCheckResult], required)
  - `boundary_audit` (array[BoundaryAuditFinding], required)
  - `scope_deviations` (array[ScopeDeviation], required)
  - `required_fixes` (array[string], required when final state is `blocked`)
  - `recommended_follow_up_scope` (array[string], optional, max 5)
  - `notes` (array[string], optional, max 5)
- **Validation rules**:
  - `required_fixes` must exist when final state is `blocked`.
  - `changed_files` must contain all paths represented in `updated_patches` and `new_files`.

### 10. ValidationSummary

- **Description**: Structured verification summary required in all outputs.
- **Fields**:
  - `is_valid` (boolean, required)
  - `stage` (enum, required): `input_validation | context_validation | boundary_audit | quality_gates | finalized`
  - `quality_check_status` (enum, required): `pass | fail | not_run`
  - `boundary_status` (enum, required): `pass | fail | not_run`
  - `scope_deviation_status` (enum, required): `none | present`
  - `final_state` (enum, required): `accepted | blocked | dependency_error | validation_error`
  - `errors` (array[string], required)
  - `warnings` (array[string], optional)

### 11. ScopeExpansionItem

- **Description**: Structured request to expand scope beyond defaults.
- **Fields**:
  - `why` (string, required)
  - `would_touch` (integer, required, `>=1`)

### 12. ImplementationPackageOutput

- **Description**: Success-path top-level output when context is sufficient.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (const, required): `react_implementation_discipline`
  - `version` (string, required)
  - `result_type` (const, required): `implementation_package`
  - `validation_summary` (ValidationSummary, required, final state `accepted` or `blocked`)
  - `output_package` (ImplementationOutputPackage, required)
  - `scope_expansion_needed` (array[ScopeExpansionItem], optional)

### 13. ValidationErrorOutput

- **Description**: Top-level output for invalid input requests.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (const, required)
  - `version` (string, required)
  - `result_type` (const, required): `validation_error`
  - `validation_summary` (ValidationSummary, required, final state `validation_error`)
  - `notes` (array[string], required, max 5)

### 14. DependencyErrorOutput

- **Description**: Top-level output when required repository context is unavailable.
- **Fields**:
  - `schema_version` (string, required)
  - `skill` (const, required)
  - `version` (string, required)
  - `result_type` (const, required): `dependency_error`
  - `validation_summary` (ValidationSummary, required, final state `dependency_error`)
  - `dependency_issue` (string, required)
  - `fallback_context_bundle_requirements` (array[string], required, min 5)
  - `notes` (array[string], required, max 5)

## Relationships

- `ImplementationDisciplineRequest (1) -> (many) RevisedPlanAction`
- `ImplementationDisciplineRequest (1) -> (0..1) ScopeGovernorPolicy`
- `ImplementationPackageOutput (1) -> (1) ImplementationOutputPackage`
- `ImplementationOutputPackage (1) -> (many) QualityCheckResult`
- `ImplementationOutputPackage (1) -> (many) BoundaryAuditFinding`
- `ImplementationOutputPackage (1) -> (many) ScopeDeviation`
- `ImplementationPackageOutput (0..1) -> (0..many) ScopeExpansionItem`
- `ValidationSummary (1) -> (1) ImplementationPackageOutput | ValidationErrorOutput | DependencyErrorOutput`

## State Transitions

### ValidationSummary

- `input_validation -> validation_error` (required input missing/invalid)
- `input_validation -> context_validation` (required input valid)
- `context_validation -> dependency_error` (required repository context unavailable)
- `context_validation -> boundary_audit` (context available)
- `boundary_audit -> quality_gates` (boundary checks complete)
- `quality_gates -> finalized` (output state determined)

### Final Output State

- `accepted`: all mandatory quality and boundary checks pass.
- `blocked`: implementation package present but one or more mandatory checks fail.
- `dependency_error`: no implementation package, missing required context.
- `validation_error`: no implementation package, invalid request payload.

### QualityCheckResult

- `pending -> pass`
- `pending -> fail`
- `fail -> required_fix_recorded` (blocked output readiness)

## Invariants

- Every output must include `validation_summary`.
- `blocked` outputs must include at least one `required_fixes` entry.
- `dependency_error` and `validation_error` outputs must not include `output_package`.
- `scope_expansion_needed` entries must be bounded and concrete (`why`, `would_touch`).
