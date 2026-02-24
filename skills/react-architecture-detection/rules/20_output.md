# Output Contract

## Summary
Defines the expected output structure for architecture detection.

---

## Rule: Structured Output
**Rule ID:** rad-output  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Ensures downstream skills can consume outputs reliably.

### Requirement

- Output must be a single machine-readable JSON object.
- Output must include envelope fields:
  - `schema_version`
  - `skill`
  - `version`
  - `result_type`
  - `validation_status`
- `result_type` must be one of:
  - `detection_result`
  - `validation_error`
  - `dependency_error`
- Output with `result_type=detection_result` must include required
  architecture fields:
  - `routing.type`
  - `ui.home`
  - `api.home`
  - `domain.organization`
  - `gravity_map`
  - `alignment_score`
  - `strategy`
  - `notes[]`
- Output must include one `gravity_map` for downstream reuse.
- Output must include one `strategy` and supporting rationale.
- Output must include one `alignment_score` from `0` to `100`.
- Output must include alignment blockers and one recommended migration step.
- Output must include any assumptions or uncertainties in `notes`.
- Output must include `state` classification (use `unknown` values when
  detection is inconclusive).
- Output must include `pause_decision` for every run:
  - `pause_required: false` when no structural ambiguity pause is needed.
  - `pause_required: true` plus bounded options when structural low-confidence
    ambiguity is present.
- Output must include pause-evaluation metadata for every run:
  - `pause_decision.pause_mode`
  - `pause_decision.decision_safety_confidence`
  - `pause_decision.impact`
- Output should include `bootstrap` metadata when bootstrap trigger conditions
  are detected (`flat/ad-hoc` and no clear routing/UI/API/domain homes).
- `result_type=validation_error` must include `notes` and must not include
  detection fields.
- `result_type=dependency_error` must include:
  - `dependency_issue`
  - `fallback_context_bundle_requirements`
  - `notes`
  and must not include detection fields.

### Required fields

- Root fields for every result:
  - `schema_version`
  - `skill`
  - `version`
  - `result_type`
  - `validation_status`
- Additional required fields for `result_type=detection_result`:
  - `routing`
  - `ui`
  - `api`
  - `domain`
  - `gravity_map`
  - `alignment_score`
  - `alignment`
  - `strategy`
  - `strategy_rationale`
  - `notes`
  - `state`
  - `pause_decision`

### Forbidden

- Omitting any required contract field.
- Returning unstructured prose instead of structured output.
- Producing multiple gravity maps for one task.
- Returning more than one strategy for one task.
- Returning a strategy without rationale.
- Omitting alignment blockers or recommended next migration step.
- Omitting `pause_decision` from output.
- Omitting required pause-evaluation metadata from `pause_decision`.
- Omitting `api.home` from output.
- Emitting raw code snippets in standard output fields.
- Returning error result types with detection payload fields.

### Notes

- Keep notes concise and limited to high-impact uncertainties.
- Gravity map values should reflect one authoritative home per concern.
- Strategy output should preserve the no-parallel-homes constraint.
- `schema_version` is mandatory for every output payload revision.
- `api.home` is the canonical endpoint layer consumed by downstream boundary checks.
- `alignment.blockers` can be empty only when no active blockers are detected.
- `pause_mode` defaults to `balanced` when not explicitly configured by the
  user or task context.
