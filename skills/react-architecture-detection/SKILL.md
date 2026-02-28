---
name: react-architecture-detection
description: Analyze an existing React repository to determine architectural shape, gravity homes (UI, API, domain, routing, i18n/localization), and migration strategy from real repo signals. Use when repository structure may already exist or differ from preferred architecture, or when downstream placement, routing, endpoint-layer, domain-boundary, or localization-home decisions must be evidence-based, especially during React refactoring sessions. Classify the repo, determine canonical endpoint layer, compute gravity confidence, and output a detection_result for downstream reuse without recomputation. Do not use for code generation, placement planning, reuse decisions, or file mutations. If this skill is skipped for a code-changing task, use react-implementation-discipline (standard or micro mode) for enforcement. This skill should be considered when changing, updating, adding, refactoring, or improving React code.
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: react, architecture, detection, migration
---

# React Architecture Detection

## Purpose
Analyzes a repository to determine its current architectural shape and
observed concern homes and boundaries based on existing signals.

## When to apply
Use this skill when:
- You need to classify the current repository structure
- You need to identify the current canonical home for features or APIs
- You need to detect migration strategy signals
- You are in a React refactoring session and existing code is being touched

Do not use this skill when:
- The repository structure is already explicitly documented and fixed
- The task is limited to content updates with no placement decisions

## Inputs
The skill expects:
- **Repository root/context:** File tree and key entry points
- **Target architecture context:** Active architecture policy/spec reference
- **Task scope:** `small_change | feature_change | new_route | refactor`
- **Policy baseline:** materialized from `shared/rules` into
  `./.shared-rules` at build time (`shared-rules`)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record
- **Pause defaults:** default `pause_mode` is taken from shared policy
- **Optional hints:** `framework_hint`, `router_hint`, `state_hint`
- **Optional cache:** previously produced `detection_result` for the same
  repository/session
- **Output mode:** optional `output_mode` (`human|agent`), default `human`
  when a human explicitly instructs this skill to run, otherwise `agent`

## Baseline compliance

- This skill is detection-only and must not modify repository files.
- Shared baseline constraints from `shared-rules` are mandatory.
- If a local convention appears to conflict with baseline policy, the skill must
  report the conflict in output notes rather than override baseline rules.

## How to use
Follow this workflow in order:
1. Scan the repository for routing, UI, domain, API/data-access, state, and i18n/localization signals.
2. Classify the architecture shape and gravity.
3. Validate output constraints against shared baseline policy.
4. Output a structured detection contract for downstream skills.
5. Persist the latest valid `detection_result` in in-memory session cache and
   reuse it for subsequent related turns.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "schema_version": "1.1.0",
  "skill": "react-architecture-detection",
  "version": "1.0.0",
  "output_mode": "agent|human",
  "presentation": {
    "user_markdown": "### Architecture Detection Summary\n- Result type: detection_result"
  },
  "result_type": "detection_result|validation_error|dependency_error",
  "validation_status": {
    "is_valid": true,
    "stage": "input_validation|detection|finalized",
    "errors": []
  },
  "routing": {"type": "react-router", "entry_points": ["src/main.tsx"]},
  "ui": {"home": "src/components", "confidence": 0.9, "status": "resolved", "evidence_paths": ["src/components"]},
  "api": {"home": "src/services/api", "pattern": "services", "confidence": 0.9, "status": "resolved", "evidence_paths": ["src/services/api"]},
  "domain": {"organization": "features", "home": "src/features", "confidence": 0.9, "status": "resolved", "evidence_paths": ["src/features"]},
  "state": {"server": "react-query", "client": "zustand", "home": "src/store", "confidence": 0.8, "status": "resolved", "evidence_paths": ["src/store"]},
  "i18n": {"home": "src/i18n", "confidence": 0.8, "status": "resolved", "evidence_paths": ["src/i18n"]},
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
  "alignment": {"blockers": [], "next_migration_step": "Continue using current architecture homes for this task."},
  "strategy": "follow-existing",
  "strategy_rationale": ["Current concern homes are stable for this scope."],
  "strategy_basis": ["stable-local-gravity", "low-migration-churn"],
  "bootstrap": {"triggered": false},
  "notes": [],
  "pause_decision": {
    "pause_required": false,
    "pause_mode": "balanced",
    "decision_safety_confidence": 0.91,
    "impact": "local"
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
- Output must include `schema_version`, `skill`, `version`, `result_type`, and
  `validation_status`.
- `result_type=detection_result` must include architecture classification fields.
- Missing/invalid required inputs must return `result_type=validation_error`.
- Missing repository evidence must return `result_type=dependency_error` and
  include `dependency_issue`, `fallback_context_bundle_requirements[]`, and
  `notes[]` (max 5).
- `notes[]` max 5 items.
- Output must contain structural metadata only.
- Raw code snippets are prohibited in standard output.
- For `result_type=detection_result`, output must include at minimum:
  `routing.type`, `ui.home`, `api.home`, `domain.organization`, `state.home`,
  `i18n.home`, `gravity_map`, `alignment_score`, `strategy`, and `notes[]`.
- For `result_type=detection_result`, output must include
  `strategy_rationale`, `alignment.blockers`,
  `alignment.next_migration_step`, and `pause_decision`.
- For `result_type=detection_result`, output should include `strategy_basis`
  using explicit strategy criteria
  (for example `stable-local-gravity`, `flat-or-messy-repo`,
  `explicit-migration-scope`).
- For `result_type=detection_result`, output must include
  `pause_decision.pause_mode`, `pause_decision.decision_safety_confidence`, and
  `pause_decision.impact`.
- For `result_type=detection_result`, `api.home` is the canonical endpoint
  layer for downstream boundary checks in the task.
- Fast path is allowed during React refactor sessions when existing code is
  touched and a trusted in-memory cached `detection_result` exists:
  - minimally refresh concern homes (including `i18n.home`) plus `gravity_map`
    from current evidence
  - reuse unchanged fields from cache
  - still emit a full schema-valid `detection_result`

## Quick reference rules

The skill must follow these rule IDs (see `AGENTS.md` for details):

- rad-overview-scope
- rad-process
- rad-output
- rad-migration-safety
- rad-default-bias
- rad-access-control
- rad-skill-model-alignment
- rad-fast-path-cache

## Files

- `AGENTS.md` contains the generated rule lookup index and inline always-on rules.
- `.shared-rules/` contains the generated shared baseline rules for standalone
  skill portability.
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
- See `examples/output.example.json` for successful `detection_result`.
- See `examples/validation-error.example.json` for `validation_error`.
- See `examples/dependency-error.example.json` for `dependency_error`.
- See `fixtures/` for sample repo trees and patterns.
