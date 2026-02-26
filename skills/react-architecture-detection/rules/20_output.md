# Output Contract

## Summary
Defines strict result envelopes and field requirements for architecture
detection outputs.

---

## Rule: Structured Output
**Rule ID:** rad-output  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Ensures downstream skills can consume architecture output without
reinterpretation.

### Requirement

- Output must be one machine-readable JSON object only.
- Root fields are mandatory for every result:
  - `schema_version`
  - `skill`
  - `version`
  - `output_mode`
  - `presentation`
  - `result_type`
  - `validation_status`
- `output_mode` must be exactly one of:
  - `human`
  - `agent`
- `presentation` must include:
  - `user_markdown` (prettified markdown summary of the payload)
- `result_type` must be exactly one of:
  - `detection_result`
  - `validation_error`
  - `dependency_error`
- `detection_result` must include at minimum:
  - `routing`
  - `ui`
  - `api`
  - `domain`
  - `state`
  - `gravity_map`
  - `alignment_score`
  - `alignment`
  - `strategy`
  - `strategy_rationale`
  - `pause_decision`
  - `notes`
- `detection_result` must include one canonical `api.home` and one
  authoritative `gravity_map`.
- `detection_result` must include alignment blockers and one
  next-migration step.
- `detection_result` may include `strategy_basis` and `bootstrap` metadata when
  applicable.
- `validation_error` must include `notes` and must not include detection fields.
- `dependency_error` must include:
  - `dependency_issue`
  - `fallback_context_bundle_requirements`
  - `notes`
  and must not include detection fields.
- `notes[]` must remain concise (maximum 5 items).
- Output fields must contain structural metadata only (no raw source snippets).
- The full JSON payload is always produced for both `output_mode` values.
- If `output_mode=human`, print/display only `presentation.user_markdown` to the human.
- If `output_mode=human`, do not print/display raw JSON, envelope fields, or any payload field other than `presentation.user_markdown`.
- If `output_mode=agent`, print/display the full JSON payload.

### Required fields

- `pause_decision` must be emitted for every `detection_result`.
- `pause_decision` must include:
  - `pause_required`
  - `pause_mode`
  - `decision_safety_confidence`
  - `impact`
- When `pause_required=true`, output must also include:
  - `trigger`
  - `options` (2-3 bounded options)
  - `recommended_option`

### Forbidden

- Returning free-form prose outside JSON output when `output_mode=agent`.
- Displaying raw JSON to humans when `output_mode=human`.
- Returning more than one strategy for one task.
- Omitting required fields for selected `result_type`.
- Returning error result types with detection payload fields.
- Omitting canonical endpoint-layer metadata (`api.home`) in
  `detection_result`.

### Notes

- `schema_version` is required on every payload revision.
- Keep output deterministic so downstream skills can reuse it without
  recomputation.
