# Output Contract

## Summary
Defines the expected deterministic output structure for reuse decisions.

---

## Rule: Structured Decision Output
**Rule ID:** rru-output  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Ensures decisions are actionable and traceable.
**Covers:** Structured Decision Output.
**Index mode:** inline

### Requirement

- Output must be one JSON object with `schema_version`, `skill`, `version`,
  `output_mode`, `presentation`, `result_type`, and `validation_status`.
- `output_mode` must be `human` or `agent`.
- `presentation.user_markdown` must be a prettified markdown summary of the
  payload.
- `result_type=decision_plan` outputs must include:
  - `thresholds_applied`
  - `revised_plan.source_plan_ref`
  - `revised_plan.context_decisions`
  - `revised_plan.file_actions[]`
  - `revised_plan.layer_justifications[]`
  - per-artifact `decisions[]` entries
- Each decision entry must include:
  - `needed_artifact_id`
  - `decision` (`reuse|update|new|decision_blocked`)
  - `decision_mark` (`reuse as-is|updated|new|decision_blocked`)
  - `discovery_status` (`found|not_found`)
  - concise `reasons[]`
  - `override_required`
- If `discovery_status=found`, output must include concrete `discovery_paths[]`.
- If `decision` is `reuse`, `update`, or `new`, `target_path` must be present.
- If `decision` is `reuse` or `update`, `discovery_status` must be `found`.
- If score details are included, they must use `fit`, `complexity_cost`,
  `coupling_risk`, `divergence_risk`, and `locality_benefit`.
- `reuse`, `update`, and `new` decisions must include `score_profile`.
- If tie-break logic is applied, output must include `tie_break` metadata with
  ordered criteria and selected candidate information.
- Output must include explicit guardrails describing anti-leakage constraints.
- `revised_plan.guardrails[]` must also include concise constraints against:
  - new shared/common dumping-ground abstractions
  - endpoint bypass patterns in hooks/UI layers
  - casual shared API client surface expansion when endpoint behavior is not
    stable and cross-domain
  - inline utility placement in pages/sections when the utility belongs in
    domain/lib boundaries
  - mega component expansion through excessive mode/flag props
  - forcing multi-mode shared composites when section-level duplication is safer
  - "refactor for future" scope creep without immediate value
  - mixed migration + feature-behavior churn in one decision package unless explicitly requested
- `revised_plan.file_actions[]` must map each planned touch to `create`,
  `update`, or `reuse` and include `needed_artifact_id`, `layer`, and concrete
  `path`.
- `revised_plan.file_actions[]` and `revised_plan.decisions[]` must match
  one-to-one by `needed_artifact_id` (no missing or extra ids in either list).
- `revised_plan.file_actions[]` must preserve `placement_plan` layer/path
  decisions by default.
- If a file action intentionally deviates from upstream `placement_plan`
  layer/path, output must include `revised_plan.placement_overrides[]` with:
  - `needed_artifact_id`
  - `upstream_path`
  - `upstream_layer`
  - `revised_path`
  - `revised_layer`
  - `resolution_mode` (`pause_resolved`)
  - `resolution_reason`
- If any move/rename is planned, output must include `revised_plan.move_actions[]`
  entries with `from_path`, `to_path`, and `import_update_targets[]`.
- `revised_plan.move_actions[]` must contain at most 3 entries unless
  `revised_plan.migration_scope_enabled=true`.
- `revised_plan.layer_justifications[]` must provide concise layer rationale and
  why adjacent layers were not chosen (1-2 sentences per touched layer).
- `decision_blocked` entries must include:
  - `constraint_blockers[]`
  - `override_required=true`
  - concise rationale describing why all safe paths were blocked
- `result_type=validation_error` outputs must include:
  - `validation_status.is_valid=false`
  - `notes[]` (max 5)
  - no decision payload
- `result_type=dependency_error` outputs must include:
  - `validation_status.is_valid=false`
  - `dependency_issue`
  - `fallback_context_bundle_requirements[]`
  - `notes[]` (max 5)
  - no decision payload
- `decision_plan` outputs must include concise `revised_plan.notes[]` (max 5)
  containing only high-leverage tradeoffs, uncertainties, constraints, or risks.
- `thresholds_applied` must always include:
  - `max_new_props_for_update`
  - `max_flags_allowed_composites`
  - `max_generic_flags_allowed_primitives`
  - `max_abstraction_risk_score`
- If scope caps would be exceeded for materially improved completeness, output
  may include `scope_expansion_needed[]` with bounded `why` and `would_touch`
  entries while still providing an in-cap minimal decision package.
- When `scope_expansion_needed[]` is present, include
  `revised_plan.follow_up_scope[]` as a short, concrete post-approval scope
  list.
- `needed_artifact_id` values must remain stable from request artifacts to
  final decision records.
- `needed_artifact_id` values must be unique within one `decision_plan` output.
- Resolve payload/display behavior for `output_mode` via
  `sr-output-discipline` and `sr-output-mode-resolution`.

### Forbidden

- Output that hides decision rationale.
- Ambiguous decisions without a single final action per artifact.
- Extra prose outside JSON output when `output_mode=agent`.
- Displaying raw JSON to humans when `output_mode=human`.
- `decision_blocked` outputs without actionable blocker context.

### Notes

- Keep reasoning concise and focused on material tradeoffs.
