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
  - `output_mode`
  - `presentation`
  - `result_type`
  - `validation_status`
- `output_mode` must be `human` or `agent`.
- `presentation` must include:
  - `user_markdown` (prettified markdown summary of the payload)
- Restrict `result_type` to:
  - `refactor_plan`
  - `clarification_request`
  - `validation_error`
  - `dependency_error`
- Restrict `validation_status` to:
  - `accepted`
  - `blocked`
  - `needs_clarification`
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
- `clarification_request` output must include:
  - `clarification_questions[]` (1-4 items)
  - each item includes:
    - `question_id`
    - `question`
    - `options[]` with keys `A`/`B`/`C` (optional `D`)
    - `recommended_option`
  - no `plan` payload
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
- `plan.test_file_touches[]` should be included only when at least one is true:
  - test updates are required by implementation-focused active steps, or
  - no meaningful implementation-focused improvements are available and
    test-only improvement is used as fallback value.
- The full JSON payload is always produced for both `output_mode` values.
- If `output_mode=human`, print/display only `presentation.user_markdown` to the human.
- If `output_mode=human`, do not print/display raw JSON, envelope fields, or any payload field other than `presentation.user_markdown`.
- If `output_mode=agent`, print/display the full JSON payload.

### Forbidden

- Emitting prose outside the JSON payload when `output_mode=agent`.
- Displaying raw JSON to humans when `output_mode=human`.
- Selecting `output_mode=agent` by habit/default when a human explicitly asked
  to run this skill and no machine-readable output was requested.
- Emitting test-only active steps while meaningful implementation-focused
  improvements remain in scope.
- Returning partial `refactor_plan` output when required context is missing.
- Returning `clarification_request` without structured options.
- Emitting non-enum status strings.

### Notes

- All output examples must validate against the schema.
