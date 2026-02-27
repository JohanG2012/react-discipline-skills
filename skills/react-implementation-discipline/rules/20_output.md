# Output Contract

## Summary

Defines strict output envelopes for accepted, blocked, validation-error, and
dependency-error outcomes.

---

## Rule: Structured Implementation Output
**Rule ID:** rid-output  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Ensure implementation outcomes are machine-consumable,
review-ready, and policy-verifiable.

### Requirement

- Output machine payload must be JSON.
- Output must include:
  - `schema_version`
  - `skill`
  - `version`
  - `output_mode`
  - `presentation`
  - `result_type`
  - `validation_status`
- `output_mode` must be `human` or `agent`.
- `presentation` must include:
  - `user_markdown` (prettified markdown summary of the payload)
- `validation_status` must report:
  - `is_valid`
  - `stage`
  - `quality_check_status`
  - `boundary_status`
  - `scope_deviation_status`
  - `final_state`
  - `errors`
  - optional `warnings`
- `validation_status.final_state` must be one of:
  - `accepted`
  - `blocked`
  - `validation_error`
  - `dependency_error`
- Supported `result_type` values:
  - `implementation_package`
  - `validation_error`
  - `dependency_error`
- `result_type` and `validation_status.final_state` must align:
  - `implementation_package` -> `accepted` or `blocked`
  - `validation_error` -> `validation_error`
  - `dependency_error` -> `dependency_error`
- `implementation_package` must include `output_package` with:
  - `changed_files`
  - optional `updated_patches`
  - optional `new_files`
  - `quality_checks`
  - `boundary_audit`
  - `scope_deviations`
  - `refactoring_consult`
  - optional `required_fixes` (required when `final_state=blocked`)
  - optional `recommended_follow_up_scope`
  - optional `notes`
- `output_package.refactoring_consult` must include:
  - `consulted_skill=react-refactoring-progression`
  - `mode=opportunistic`
  - consult `status`
  - consult `result_type`
  - concise `summary`
- Micro-mode outputs must still include boundary/quality evidence and keep
  implementation bounded to behavior-preserving in-place refactor scope.
- If `scope_expansion_needed` is present, include
  `output_package.recommended_follow_up_scope`.
- Each `scope_deviations[]` entry must include:
  - `path`
  - `type`
  - `reason`
- `validation_error` output must include `notes` and must not include
  `output_package`.
- `dependency_error` output must include:
  - `dependency_issue`
  - `fallback_context_bundle_requirements[]`
  - `notes`
  and must not include `output_package`.
- Resolve payload/display behavior for `output_mode` via
  `sr-output-discipline` and `sr-output-mode-resolution`.

### Forbidden

- Returning unstructured prose.
- Displaying raw JSON to humans when `output_mode=human`.
- Omitting validation summary fields.
- Returning `blocked` without `required_fixes`.
- Returning error outputs with implementation payload.
- Omitting `output_package.refactoring_consult` in
  `implementation_package` results.

### Notes

- Keep notes concise (max 5 items where applicable).
- Prefer deterministic field population for downstream consumers.
