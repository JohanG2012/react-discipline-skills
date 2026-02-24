---
name: react-placement-and-layering
description: Decide where new or modified code should live within a React repository using detected architecture and shared policy constraints. Use after architecture detection and before reuse analysis or implementation to produce a placement_plan that defines touched layers and rationale. Apply gravity rules, migration strategy, and boundary constraints to prevent duplicate homes and architectural drift. Do not use for code generation, reuse complexity analysis, or implementation discipline.
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: react, architecture, placement, layering
---

# React Placement and Layering

## Purpose
Determines the correct layer and folder placement for new work based on the
architecture detection outputs and boundary rules.

## When to apply
Use this skill when:
- You need to place new files in the correct layer
- You must validate boundary rules between layers
- You need to justify placement decisions

Do not use this skill when:
- Placement is explicitly dictated in the request
- The change is limited to existing files with no new placement

## Inputs
The skill expects:
- **Task request:** `task_request`
- **Architecture context:** upstream `detection_result`
- **Repository context:** file tree and local conventions
- **Policy:** `agent-policy-v1` (must be available)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record
- **Pause defaults:** default `pause_mode` is taken from shared policy

## How to use
Follow this workflow in order:
1. Confirm architecture detection results and gravity.
2. Map the change to the correct layer.
3. Validate placement output against shared baseline constraints.
4. Produce a placement decision with justification.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "schema_version": "1.0.0",
  "skill": "react-placement-and-layering",
  "version": "1.0.0",
  "result_type": "placement_plan|validation_error|dependency_error",
  "validation_status": {
    "is_valid": true,
    "stage": "input_validation|planning|finalized",
    "errors": [],
    "warnings": []
  },
  "notes": []
}
```

Constraints:

- Output must be JSON only.
- Output must follow strict versioned contract fields.
- Required-input validation happens before plan generation.
- Missing or invalid required inputs return `result_type=validation_error` with
  no plan artifacts.
- Missing repository evidence returns `result_type=dependency_error` with
  `dependency_issue` and `fallback_context_bundle_requirements[]`.
- Successful outputs return `result_type=placement_plan` and include planning
  fields defined in `rules/20_output.md`.
- Plan outputs include canonical endpoint layer, per-layer justifications, and
  a short decision explanation tied to detected architecture signals.
- Plan outputs include an authoritative-home map for active concerns.
- Repository-evidence overrides for structural conflicts require explicit
  pause-resolved metadata.
- If move/rename operations are present, they are limited to small scope and
  require explicit move metadata.
- `notes[]` max 5 items.
- If extra out-of-cap work would materially improve completeness, include
  `scope_expansion_needed[]` entries (`why`, `would_touch`) while still
  returning the smallest in-cap plan.
- No raw source snippets or secret-like values in output fields.
- No extra prose outside JSON.

## Quick reference rules

The skill must follow these rule IDs (see `AGENTS.md` for details):

- rpl-overview-scope
- rpl-process
- rpl-output
- rpl-migration-safety
- rpl-default-bias
- rpl-discovery-conventions
- rpl-scope-governor
- rpl-access-control
- rpl-skill-model-alignment
- rpl-implementation-handoff

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
- See `examples/output.example.json` for successful `placement_plan`.
- See `examples/validation-error.example.json` for `validation_error`.
- See `examples/dependency-error.example.json` for `dependency_error`.
