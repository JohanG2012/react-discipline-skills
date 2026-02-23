# Contract: React Architecture Detection Output

## Purpose

Define the normative interface emitted by `react_architecture_detection` and consumed by downstream planning/implementation skills.

## Contract Scope

- **Producer**: `<REPO_ROOT>/skills/react_architecture_detection/`
- **Consumers**:
  - `react_placement_and_layering`
  - `react_reuse_update_new`
  - `react_implementation_discipline`
- **Contract Type**: Internal machine-consumable JSON output contract.

## Normative Schema

- Source of contract truth for this feature phase:
  - `<REPO_ROOT>/specs/002-skill-react-architecture-detection/contracts/architecture-detection-output.schema.json`

## Required Payload Shape

```json
{
  "schema_version": "1.1.0",
  "routing": {"type": "react-router", "entry_points": ["src/main.tsx"]},
  "ui": {"home": "src/components", "confidence": 0.92, "status": "resolved", "evidence_paths": ["src/components"]},
  "api": {"home": "src/services/api", "pattern": "services", "confidence": 0.9, "status": "resolved", "evidence_paths": ["src/services/api"]},
  "domain": {"organization": "features", "home": "src/features", "confidence": 0.9, "status": "resolved", "evidence_paths": ["src/features"]},
  "state": {"server": "react-query", "client": "zustand", "home": "src/store", "confidence": 0.8, "status": "resolved", "evidence_paths": ["src/store"]},
  "gravity_map": {
    "pages_or_routes": "src/pages",
    "domain_modules": "src/features",
    "ui_primitives": "src/components/ui",
    "ui_composites": "src/components/composites",
    "api": "src/services/api",
    "store": "src/store",
    "pure_utils": "src/lib",
    "generic_hooks": "src/hooks",
    "app_setup": "src/core"
  },
  "alignment_score": 82,
  "alignment": {
    "blockers": [
      "Competing API homes reduce confidence."
    ],
    "next_migration_step": "Adopt one canonical API home for this task."
  },
  "strategy": "follow-existing",
  "strategy_rationale": [
    "Existing repository gravity is stable for this task scope."
  ],
  "notes": [],
  "pause_decision": {
    "pause_required": false
  }
}
```

## Contract Rules

1. **Master Contract Field Rule**
   - Output MUST include:
     - `routing.type`
     - `ui.home`
     - `api.home`
     - `domain.organization`
     - `gravity_map`
     - `alignment_score`
     - `alignment.blockers`
     - `alignment.next_migration_step`
     - `strategy`
     - `strategy_rationale`
     - `notes[]`

2. **Canonical Endpoint Rule**
   - `api.home` is the canonical endpoint layer for downstream boundary checks in the task.

3. **Schema Version Rule**
   - `schema_version` is mandatory on every output payload.

4. **Metadata-Only Rule**
   - Output must contain structural metadata only.
   - Raw code snippets are disallowed in standard output.

5. **Low-Confidence Rule**
   - If a structural concern confidence is below `0.7`, concern `home` must be `unknown` and concern `status` must be `ambiguous`.
   - In this case, `pause_decision.pause_required` must be `true` and include bounded options with one recommended option.
   - `pause_decision` is mandatory in all runs; use `pause_required=false` when no structural pause is required.

6. **Single Strategy Rule**
   - Exactly one strategy is allowed: `follow-existing`, `introduce-boundaries`, or `migrate-as-you-touch`.
   - `strategy_rationale` must include at least one concrete reason.

7. **Deterministic Notes Rule**
   - `notes` must be an array with at most 5 items.

## Compatibility Expectations

- Downstream skills must treat this payload as canonical per task and must not recompute gravity unless an explicit clarification pause resolves a conflict.
- Downstream skills must consume `api.home` as the canonical endpoint layer for boundary checks.
- Downstream skills must consume the selected strategy as authoritative for the task and must not output competing strategy recommendations in the same execution flow.
- Contract changes require a coordinated update to:
  - `<REPO_ROOT>/skills/react_architecture_detection/schemas/output.schema.json`
  - `<REPO_ROOT>/skills/react_architecture_detection/examples/output.example.json`
  - `<REPO_ROOT>/skills/react_architecture_detection/rules/20_output.md`

## Failure Modes

- Missing required master contract fields -> reject payload as invalid.
- Missing `api.home` -> reject payload as invalid.
- `confidence < 0.7` with non-`unknown` home -> reject payload as invalid.
- `pause_required=true` without options/recommendation -> reject payload as invalid.
- Raw code snippets in output fields -> reject payload as policy violation.
