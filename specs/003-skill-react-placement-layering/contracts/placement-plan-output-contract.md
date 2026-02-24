# Contract: React Placement and Layering Output

## Purpose

Define the normative output interface emitted by `react_placement_and_layering`
for downstream planning and implementation workflows.

## Contract Scope

- **Producer**: `<REPO_ROOT>/skills/react_placement_and_layering/`
- **Consumers**:
  - `react_reuse_update_new`
  - `react_implementation_discipline`
  - feature-level planning/review flows
- **Contract Type**: Internal machine-consumable JSON output contract.

## Normative Schema

- Source of truth for this phase:
  - `<REPO_ROOT>/specs/003-skill-react-placement-layering/contracts/placement-plan-output.schema.json`

## Required Payload Shapes

### 1. Successful Placement Plan (`result_type=plan`)

```json
{
  "schema_version": "1.0.0",
  "skill": "react_placement_and_layering",
  "version": "1.0.0",
  "result_type": "plan",
  "strategy_used": "follow-existing",
  "feature_owner": "projects",
  "canonical_endpoint_layer": "src/api/endpoints",
  "authoritative_home_map": {
    "ui": "src/ui/composites",
    "api": "src/api/endpoints",
    "domain": "src/features/projects",
    "routing": "src/pages"
  },
  "artifacts": [
    {
      "purpose": "route entry",
      "action": "create",
      "action_rationale": "No existing route entry handles this flow.",
      "layer": "pages",
      "path": "src/pages/ProjectsPage.tsx",
      "depends_on": [
        "src/features/projects/sections/ProjectsListSection.tsx"
      ]
    }
  ],
  "layer_justifications": [
    {
      "layer": "pages",
      "rationale": "Route entry remains orchestration-only and avoids direct transport calls."
    }
  ],
  "decision_explanation": {
    "detected_signals": [
      "Routing is page-oriented in existing structure.",
      "API gravity is in src/api/endpoints."
    ],
    "chosen_direction": "Follow existing homes and avoid creating duplicate concern locations."
  },
  "import_guardrails": [
    "ui/* must not import from features/*",
    "api/* must not import React",
    "lib/* must not import React",
    "pages/* must not call endpoints directly"
  ],
  "source_of_truth_resolutions": [
    {
      "concern": "ui",
      "default_source": "architecture_detection",
      "architecture_confidence": 0.82,
      "override_threshold": 0.7,
      "effective_source": "architecture_detection",
      "resolution_mode": "inherited",
      "resolution_reason": "Confidence is at or above threshold."
    }
  ],
  "validation_status": {
    "is_valid": true,
    "stage": "finalized",
    "errors": [],
    "warnings": []
  },
  "scope_expansion_needed": [
    {
      "why": "Shared table-shell extraction would improve long-term reuse.",
      "would_touch": 2
    }
  ],
  "notes": [
    "Reused existing FilterBar composite."
  ]
}
```

### 2. Validation Error (`result_type=validation_error`)

```json
{
  "schema_version": "1.0.0",
  "skill": "react_placement_and_layering",
  "version": "1.0.0",
  "result_type": "validation_error",
  "validation_status": {
    "is_valid": false,
    "stage": "input-validation",
    "errors": [
      "Missing required input: detection_result_ref"
    ],
    "warnings": []
  },
  "notes": [
    "No placement plan emitted due to invalid required inputs."
  ]
}
```

## Contract Rules

1. **Versioned Contract Rule**
   - `schema_version` is mandatory for every output payload.
   - Contract changes require explicit schema/version updates.

2. **Strict Plan Fields Rule**
- For `result_type=plan`, output MUST include:
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
- Each artifact entry in `artifacts` MUST include `action_rationale`.
- Each source-of-truth resolution entry MUST include `resolution_mode`.
- `layer_justifications` MUST include one rationale per touched layer.
- If move/rename operations are present, `move_operations` MUST include:
  `old_path`, `new_path`, and `import_update_targets`.
- If move/rename operations are present, `move_concern` MUST be provided.
- `move_operations` MUST contain three items or fewer.
- If `scope_expansion_needed` is present, each item MUST include `why` and
  integer `would_touch`.

3. **Fail-Fast Validation Rule**
   - Missing/invalid required inputs MUST produce `result_type=validation_error`.
   - Validation-error payloads MUST NOT include placement artifacts.

4. **Source-of-Truth Precedence Rule**
   - In architecture/repository conflicts, architecture detection is default.
   - If architecture confidence is below `0.7` for structural conflicts,
     repository evidence is selected only after explicit pause resolution.
   - Resolutions MUST be captured in `source_of_truth_resolutions` for plan outputs.

5. **Guardrail Rule**
   - Plan outputs MUST include deterministic import guardrails used for validation.
   - Unresolved guardrail failures MUST prevent finalized plan output.

6. **Sensitive Output Rule**
   - Raw source snippets and secret-like values are forbidden in all output fields.
   - Output is structural metadata and references only.

7. **Notes Determinism Rule**
   - `notes` maximum is 5 entries.
   - Notes should be concise and tied to placement decisions only.

8. **Scope Expansion Escape Hatch Rule**
   - If extra out-of-cap scope would materially improve completeness, plan
     output may include `scope_expansion_needed`.
   - `scope_expansion_needed` is plan-only and must stay structured
     (`why`, `would_touch`).
   - Presence of `scope_expansion_needed` does not replace the requirement to
     return the smallest viable in-cap plan.

## Compatibility Expectations

- Consumers must handle both contract shapes (`plan` and `validation_error`).
- Consumers must not proceed to implementation when `result_type=validation_error`.
- Contract changes require coordinated updates to:
  - `<REPO_ROOT>/skills/react_placement_and_layering/schemas/output.schema.json`
  - `<REPO_ROOT>/skills/react_placement_and_layering/examples/output.example.json`
  - `<REPO_ROOT>/skills/react_placement_and_layering/rules/20_output.md`

## Failure Modes

- Missing mandatory plan fields for `result_type=plan` -> reject payload as invalid.
- Missing `validation_status` or `schema_version` -> reject payload as invalid.
- `result_type=validation_error` with plan artifacts present -> reject payload as invalid.
- `result_type=validation_error` with `scope_expansion_needed` present ->
  reject payload as invalid.
- Required inputs missing/invalid without `result_type=validation_error` -> reject payload as invalid.
- Conflict resolution below `0.7` without `resolution_mode=pause_resolved` -> reject payload as invalid.
- Move-enabled payload with more than 3 operations -> reject payload as invalid.
- Raw source snippets or secret-like values in payload text -> reject payload as policy violation.
