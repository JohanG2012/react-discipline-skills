# Output Contract

## Summary
Defines the expected output structure for placement decisions.

---

## Rule: Structured Placement Output
**Rule ID:** rpl-output  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Ensures decisions are traceable and actionable.

### Requirement

- Output must be one JSON object that follows a strict versioned contract.
- Successful placement results must use `result_type=placement_plan`.
- Invalid or missing required inputs must use `result_type=validation_error`.
- Missing repository evidence must use `result_type=dependency_error`.
- `result_type=placement_plan` output must include:
  - `schema_version`
  - `skill`
  - `version`
  - `strategy_used`
  - `feature_owner`
  - `canonical_endpoint_layer`
  - `authoritative_home_map`
  - `artifacts`
  - `layer_justifications`
  - `decision_explanation`
  - `import_guardrails`
  - `source_of_truth_resolutions`
  - `validation_status`
  - `notes`
- `result_type=placement_plan` may include `scope_expansion_needed` when
  out-of-cap
  follow-up work would materially improve completeness.
- Each artifact must include:
  - `purpose`
  - `action` (`reuse | update | create`)
  - `action_rationale`
  - `layer`
  - `path`
  - `depends_on` (when relevant)
- `source_of_truth_resolutions` entries must include:
  - `concern`
  - `default_source`
  - `architecture_confidence`
  - `override_threshold`
  - `effective_source`
  - `resolution_mode` (`inherited | pause_resolved`)
  - `resolution_reason`
- `layer_justifications` must provide at least one concise rationale per touched
  layer.
- `decision_explanation` must summarize detected architecture signals and the
  chosen direction.
- `authoritative_home_map` must provide a concise map of current authoritative
  homes for relevant concerns (for example `ui`, `api`, `domain`, `routing`).
- If move/rename operations are present, output must include
  `move_operations[]` with `old_path`, `new_path`, and `import_update_targets`,
  plus `move_concern`.
- `move_operations[]` must contain three items or fewer.
- `notes` must remain concise with maximum 5 items.
- `notes` and artifact rationales must be structural (planning metadata only).
- If `scope_expansion_needed` is present, each item must include:
  - `why`
  - `would_touch` (integer count of additional files)
- `result_type=validation_error` output must include:
  - `schema_version`
  - `skill`
  - `version`
  - `result_type`
  - `validation_status` (`is_valid=false`, `stage=input_validation`, and at
    least one error)
  - `notes`
- `result_type=validation_error` must not include plan fields (`strategy_used`,
  `feature_owner`, `canonical_endpoint_layer`, `authoritative_home_map`,
  `artifacts`,
  `layer_justifications`, `decision_explanation`, `import_guardrails`,
  `source_of_truth_resolutions`, `move_operations`, `move_concern`,
  `scope_expansion_needed`).
- `result_type=dependency_error` output must include:
  - `schema_version`
  - `skill`
  - `version`
  - `result_type`
  - `validation_status` (`is_valid=false`, `stage=planning`, and at least one
    error)
  - `dependency_issue`
  - `fallback_context_bundle_requirements` (minimum 5 entries)
  - `notes`
- `result_type=dependency_error` must not include plan fields (`strategy_used`,
  `feature_owner`, `canonical_endpoint_layer`, `authoritative_home_map`,
  `artifacts`, `layer_justifications`, `decision_explanation`,
  `import_guardrails`, `source_of_truth_resolutions`, `move_operations`,
  `move_concern`, `scope_expansion_needed`).

### Forbidden

- Vague placement guidance without concrete paths.
- Omitting justification for layer selection.
- Returning free-form prose outside JSON output.
- Returning placement-plan output that omits mandatory contract fields.
- Returning validation-error output without explicit input_validation errors.
- Returning dependency-error output without fallback context requirements.
- Returning output fields with raw source snippets or secret-like values.
- Using `effective_source=repository_evidence` for structural conflicts without
  `resolution_mode=pause_resolved`.

### Notes

- Keep notes concise and tied to the request.
