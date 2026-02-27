---
name: react-reuse-update-new
description: Decide whether planned artifacts should be reused, safely updated, or created new within the approved placement. Use after placement_plan is defined and before implementation. Evaluate abstraction cost, domain leakage risk, flag explosion, divergence probability, and locality benefit to produce a revised_plan with per-artifact decisions and rationale. Do not use to choose folders, perform architecture detection, or generate implementation patches. If this skill is skipped for a code-changing task, use react-implementation-discipline (standard or micro mode) for enforcement. This skill should be considered when changing, updating, adding, refactoring, or improving React code.
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: react, reuse, update, abstraction-safety
---

# React Reuse vs Update vs New

## Purpose
Guides deterministic planning decisions on whether to reuse existing artifacts,
update them, or create new ones while keeping boundaries clean and scope
constrained.

## When to apply
Use this skill when:
- You need per-artifact reuse/update/new decisions
- Existing components may already cover the request
- You want to avoid unnecessary duplication and abstraction leakage
- You are extracting shared logic for DRY reuse across 2 or more call sites
- You are refactoring and need a decision-only check before creating a tiny shared helper

Do not use this skill when:
- The change is explicitly mandated to create new files
- The work is strictly in-place in existing files and no reuse/update/new decision is needed

## Inputs
The skill expects:
- **Task request:** The requested change or feature
- **Architecture + placement context:** Upstream `detection_result` and
  `placement_plan` references
- **Repository context:** Existing implementations and patterns
- **Needed artifacts:** Stable `needed_artifact_id` values and artifact purpose
- **Optional threshold overrides:** `max_new_props_for_update`,
  `max_flags_allowed_composites`, `max_generic_flags_allowed_primitives`,
  `max_abstraction_risk_score`
- **Policy baseline:** materialized from `shared/rules` into
  `./.shared-rules` at build time (`shared-rules`)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record
- **Pause defaults:** default `pause_mode` is taken from shared policy
- **Output mode:** optional `output_mode` (`human|agent`), default `human`
  when a human explicitly instructs this skill to run, otherwise `agent`

## How to use
Follow this workflow in order:
1. Search for existing implementations in order (exact/near-name, pattern,
   primitive, endpoint/DTO/hook) and record concrete evidence paths or
   `not_found`.
2. For low-overhead helper refactors, run a quick repo search first for existing
   helpers (for example `isRecord`, `getStringField`); if found, prefer
   reuse/update, otherwise allow new helper creation.
3. Score candidates on fit, complexity, coupling risk, divergence risk, and
   locality benefit.
4. Apply default thresholds (or provided overrides) and deterministic tie-break
   ordering.
5. Validate decision constraints against shared baseline policy.
6. Output one strict result type with explicit reasoning and guardrails.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "schema_version": "1.0.0",
  "skill": "react-reuse-update-new",
  "version": "1.0.0",
  "output_mode": "agent|human",
  "presentation": {
    "user_markdown": "### Reuse Decision Summary\n- Result type: decision_plan"
  },
  "result_type": "decision_plan|validation_error|dependency_error",
  "validation_status": {
    "is_valid": true,
    "stage": "input_validation|discovery|decisioning|finalized",
    "errors": []
  }
}
```

`decision_plan` excerpt:

```json
{
  "result_type": "decision_plan",
  "revised_plan": {
    "context_decisions": {
      "feature_owner_domain": "projects",
      "route_page_involvement": "route",
      "data_sources_summary": ["src/api/endpoints/projects.ts"],
      "state_type": "server-state",
      "ui_need_shape": "feature section with shared composite reuse"
    },
    "file_actions": [
      {
        "action": "reuse",
        "layer": "ui/composites",
        "path": "src/ui/composites/FilterBar.tsx",
        "needed_artifact_id": "na-filter-bar"
      }
    ],
    "layer_justifications": [
      {
        "layer": "ui/composites",
        "justification": "Reusable UI concern belongs in composite layer.",
        "adjacent_layers_not_chosen": "Feature section not chosen to avoid domain-specific coupling."
      }
    ],
    "decisions": [
      {
        "needed_artifact_id": "na-filter-bar",
        "decision": "reuse",
        "decision_mark": "reuse as-is",
        "discovery_status": "found",
        "discovery_paths": ["src/ui/composites/FilterBar.tsx"],
        "reasons": ["Existing composite matches required behavior."],
        "override_required": false
      }
    ]
  }
}
```

Constraints:

- Machine payload must be a JSON object.
- Output must include `output_mode` and `presentation.user_markdown`.
- `output_mode` must be either `human` or `agent`.
- The full JSON payload is always produced for both `output_mode` values.
- If `output_mode=human`, print/display only `presentation.user_markdown` to the human.
- If `output_mode=human`, do not print/display raw JSON, envelope fields, or any payload field other than `presentation.user_markdown`.
- If `output_mode=agent`, print/display the full JSON payload.
- `decision_plan` outputs must include threshold values, revised decisions, and
  stable `needed_artifact_id` continuity, plus context decisions, file actions,
  and layer justifications.
- `decision_plan.revised_plan.file_actions[]` and
  `decision_plan.revised_plan.decisions[]` must match one-to-one by
  `needed_artifact_id`.
- `decision_plan.revised_plan.file_actions[]` must preserve upstream
  `placement_plan` layer/path decisions unless explicit pause-resolved override
  metadata is provided in `revised_plan.placement_overrides[]`.
- `decision_plan.revised_plan.decisions[]` entries must include a single final
  decision per artifact plus concise reasons; tie-break metadata is required
  when tie-break logic is used.
- Each decision must include explicit `decision_mark`
  (`reuse as-is|updated|new|decision_blocked`).
- Each decision must include `discovery_status`; when status is `found`,
  concrete `discovery_paths[]` are required.
- `reuse`, `update`, and `new` decisions must include concrete `target_path`.
- `reuse`, `update`, and `new` decisions must include full score profiles
  (`fit`, `complexity_cost`, `coupling_risk`, `divergence_risk`,
  `locality_benefit`).
- If move/rename actions exist, include `from_path -> to_path` plus explicit
  `import_update_targets`.
- `revised_plan.move_actions[]` is capped at 3 entries unless
  `revised_plan.migration_scope_enabled=true`.
- If material completeness needs exceed scope caps, include bounded
  `scope_expansion_needed[]` entries (`why`, `would_touch`) while still
  returning the in-cap minimal decision package.
- `validation_error` outputs are required for missing/invalid required inputs
  and must include no decision payload.
- `dependency_error` outputs are required when repository evidence is
  unavailable/incomplete and must include no decision payload.
- `dependency_error` outputs must include
  `fallback_context_bundle_requirements[]` describing required context inputs.
- `notes[]` max 5 items on error outputs.

## Quick reference rules

The skill must follow these rule IDs (see `AGENTS.md` for details):

- rru-overview-scope
- rru-process
- rru-output
- rru-discovery-conventions
- rru-default-bias
- rru-upstream-alignment
- rru-decision-thresholds
- rru-scope-governor
- rru-access-control
- rru-skill-model-alignment

## Files

- `AGENTS.md` contains the generated rule lookup index and inline always-on rules.
- `.shared-rules/` contains the generated shared baseline rules for standalone
  skill portability.
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/output.example.json` for successful `decision_plan`.
- See `examples/validation-error.example.json` for `validation_error`.
- See `examples/dependency-error.example.json` for `dependency_error`.
