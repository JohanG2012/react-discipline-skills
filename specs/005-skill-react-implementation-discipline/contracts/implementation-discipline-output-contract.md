# Implementation Discipline Output Contract

## Purpose

Define the normative output interface produced by
`react-implementation-discipline` and consumed by reviewers and downstream
automation.

## Scope

- **Producer**:
  `<REPO_ROOT>/skills/react-implementation-discipline/`
- **Consumers**:
  - review workflows validating implementation discipline behavior
  - automation that checks boundary/quality/scope outcomes
  - execution flows handling blocked and error states

## Source of Truth

Contract artifacts for this feature:

- `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json`
- `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md`
- `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/spec.md`
- `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/plan.md`

Skill artifacts that must align with this contract:

- `<REPO_ROOT>/skills/react-implementation-discipline/SKILL.md`
- `<REPO_ROOT>/skills/react-implementation-discipline/rules/10_process.md`
- `<REPO_ROOT>/skills/react-implementation-discipline/rules/20_output.md`
- `<REPO_ROOT>/skills/react-implementation-discipline/rules/30_validation_gates.md`
- `<REPO_ROOT>/skills/react-implementation-discipline/rules/40_scope_governor.md`
- `<REPO_ROOT>/skills/react-implementation-discipline/rules/50_access_control.md`
- `<REPO_ROOT>/skills/react-implementation-discipline/schemas/output.schema.json`

Baseline governance references:

- `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/master_spec.md`
- `<REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md`
- `<REPO_ROOT>/.specify/memory/constitution.md`

## Top-Level Contract

All outputs must include:

- `schema_version` (string)
- `skill` (`react-implementation-discipline`)
- `version` (string)
- `result_type` (`implementation_package` | `validation_error` | `dependency_error`)
- `validation_status`
  - `is_valid`
  - `stage`
  - `quality_check_status`
  - `boundary_status`
  - `scope_deviation_status`
  - `final_state`
  - `errors[]`
  - optional `warnings[]`
- optional `scope_expansion_needed[]` (`why`, `would_touch`)

Execution modes:

- `standard`: consumes upstream `detection_result` + `revised_plan`.
- `micro`: allowed only for behavior-preserving in-place refactors that satisfy
  shared `sr-micro-change-bypass` constraints (small touched-file count, no
  new files, no moves/renames, no new endpoint/hook/composite homes, no routing
  changes).

### Result Type: `implementation_package`

Required fields:

- `output_package`
  - `changed_files[]`
  - optional `updated_patches[]` (`path`, `patch`)
  - optional `new_files[]` (`path`, `content`)
  - `quality_checks[]` (`check_id`, `status`, `summary`, optional `required_fix`)
  - `boundary_audit[]` (`file_path`, `status`, optional `issues[]`)
  - `scope_deviations[]` (`path`, `type`, `reason`)
  - optional `required_fixes[]` (required when `final_state=blocked`)
  - optional `recommended_follow_up_scope[]` (required when `scope_expansion_needed[]` is present)
  - optional `notes[]`

Behavioral constraints:

- `validation_status.final_state` must be `accepted` or `blocked`.
- `result_type=implementation_package` requires
  `validation_status.final_state` in (`accepted`, `blocked`).
- If final state is `blocked`, include failed checks and `required_fixes[]`.
- Out-of-scope requests without explicit approval must be excluded from the
  implementation payload and represented as scope deviations.
- Micro mode must still include complete boundary/quality evidence and
  deterministic validation state reporting.

### Result Type: `validation_error`

Required fields:

- `notes[]`
- no `output_package`
- `validation_status.is_valid=false`
- `validation_status.final_state=validation_error`

### Result Type: `dependency_error`

Required fields:

- `dependency_issue`
- `fallback_context_bundle_requirements[]` (minimum 5 actionable items)
- `notes[]`
- no `output_package`
- `validation_status.is_valid=false`
- `validation_status.final_state=dependency_error`

## Behavioral Guarantees

- Output is JSON only and machine-consumable.
- Mandatory final gates are reflected in output state:
  - pass -> `accepted`
  - fail -> `blocked`
- Missing required repository context returns `dependency_error` with no
  implementation payload.
- Missing/invalid required inputs return `validation_error` with no
  implementation payload.
- File-size discipline and scope-governor outcomes are represented in checks and
  deviations.
- No unapproved architecture migration, dependency additions, unrelated cleanup,
  or policy/spec edits are included in implementation output.

## Example Outcome Types

- accepted implementation package with complete validation summary
- blocked implementation package with required remediation actions
- validation error due to missing required inputs
- dependency error due to unavailable repository context
