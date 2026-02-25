# Output Contract

## Summary

Defines strict result types and payload constraints.

---

## Rule: Structured Refactor Output
**Rule ID:** rrp-output  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps outputs machine-consumable and deterministic.

### Requirement

- Emit one JSON object with required envelope fields:
  - `schema_version`
  - `skill`
  - `version`
  - `result_type`
  - `validation_status`
- Restrict `result_type` to:
  - `refactor_plan`
  - `validation_error`
  - `dependency_error`
- Restrict `validation_status` to:
  - `accepted`
  - `blocked`
  - `validation_error`
  - `dependency_error`
- `refactor_plan` output must include:
  - `refactor_mode`
  - `plan.touch_budget`
  - `plan.steps[]`
- `refactor_plan` may include:
  - `plan.follow_up_findings[]` for non-blocking out-of-mode items
  - `plan.test_file_touches[]` for opportunistic test updates
- Opportunistic `refactor_plan` outputs must:
  - include only Tier A/B steps
  - include no more than 5 steps
  - keep Tier C/D items in `plan.follow_up_findings[]` only
- `validation_error` output must include notes and no `plan` payload.
- `dependency_error` output must include:
  - `dependency_issue`
  - `fallback_context_bundle_requirements[]` (min 5)
  - `notes[]`
  - no `plan` payload
- Include `scope_expansion_needed[]` when completeness exceeds caps but an in-cap
  plan is still returned.
- Represent Tier C/D opportunistic findings as follow-up metadata, not blocking
  step execution.
- If `plan.test_file_touches[]` is present, keep it directly relevant, bounded
  (default <=2 files), and dependency-neutral.

### Forbidden

- Emitting prose outside the JSON payload.
- Returning partial `refactor_plan` output when required context is missing.
- Emitting non-enum status strings.

### Notes

- All output examples must validate against the schema.
