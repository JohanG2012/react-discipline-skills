# Output Contract

## Summary

Defines strict output envelopes for accepted, blocked, validation-error, and
dependency-error outcomes.

---

## Rule: Structured Implementation Output
**Rule ID:** rid-output  
**Priority:** MUST  
**Applies to:** react_implementation_discipline  
**Rationale:** Ensure implementation outcomes are machine-consumable,
review-ready, and policy-verifiable.

### Requirement

- Output must be JSON only.
- Output must include:
  - `schema_version`
  - `skill`
  - `version`
  - `result_type`
  - `validation_summary`
- `validation_summary` must report:
  - `is_valid`
  - `stage`
  - `quality_check_status`
  - `boundary_status`
  - `scope_deviation_status`
  - `final_state`
  - `errors`
  - optional `warnings`
- Supported `result_type` values:
  - `implementation_package`
  - `validation_error`
  - `dependency_error`
- `implementation_package` must include `output_package` with:
  - `changed_files`
  - optional `updated_patches`
  - optional `new_files`
  - `quality_checks`
  - `boundary_audit`
  - `scope_deviations`
  - optional `required_fixes` (required when `final_state=blocked`)
  - optional `recommended_follow_up_scope`
  - optional `notes`
- If `scope_expansion_needed` is present, include
  `output_package.recommended_follow_up_scope`.
- `validation_error` output must include `notes` and must not include
  `output_package`.
- `dependency_error` output must include:
  - `dependency_issue`
  - `fallback_context_bundle_requirements`
  - `notes`
  and must not include `output_package`.

### Forbidden

- Returning unstructured prose.
- Omitting validation summary fields.
- Returning `blocked` without `required_fixes`.
- Returning error outputs with implementation payload.

### Notes

- Keep notes concise (max 5 items where applicable).
- Prefer deterministic field population for downstream consumers.
