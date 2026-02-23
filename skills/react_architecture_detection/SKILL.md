---
name: react_architecture_detection
description: Detects repository architecture and gravity signals
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - react
    - architecture
---

# React Architecture Detection

## Purpose
Analyzes a repository to determine its current architectural shape and
preferred file placement based on existing signals.

## When to apply
Use this skill when:
- You need to classify the current repository structure
- You must decide the canonical home for features or APIs
- You need to detect migration strategy signals

Do not use this skill when:
- The repository structure is already explicitly documented and fixed
- The task is limited to content updates with no placement decisions

## Inputs
The skill expects:
- **Repository root/context:** File tree and key entry points
- **Target architecture context:** Active architecture policy/spec reference
- **Task scope:** `small_change | feature_change | new_route | refactor`
- **Policy:** `agent-policy-v1` (must be available)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record
- **Optional hints:** `framework_hint`, `router_hint`, `state_hint`

## Baseline compliance

- This skill is detection-only and must not modify repository files.
- Shared baseline constraints from `agent-policy-v1` are mandatory.
- If a local convention appears to conflict with baseline policy, the skill must
  report the conflict in output notes rather than override baseline rules.

## How to use
Follow this workflow in order:
1. Scan the repository for routing, UI, domain, API/data-access, and state signals.
2. Classify the architecture shape and gravity.
3. Validate output constraints against shared baseline policy.
4. Output a structured detection contract for downstream skills.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "schema_version": "1.1.0",
  "routing": {"type": "react-router", "entry_points": ["src/main.tsx"]},
  "ui": {"home": "src/components", "confidence": 0.9, "status": "resolved", "evidence_paths": ["src/components"]},
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
  "alignment": {"blockers": [], "next_migration_step": "Continue using current architecture homes for this task."},
  "strategy": "follow-existing",
  "strategy_rationale": ["Current concern homes are stable for this scope."],
  "notes": [],
  "pause_decision": {"pause_required": false}
}
```

Constraints:

- Output must be JSON only.
- `notes[]` max 5 items.
- Output must contain structural metadata only.
- Raw code snippets are prohibited in standard output.
- Output must include at minimum: `routing.type`, `ui.home`, `api.home`,
  `domain.organization`, `gravity_map`, `alignment_score`, `strategy`, and
  `notes[]`.
- Output must include `strategy_rationale`, `alignment.blockers`,
  `alignment.next_migration_step`, and `pause_decision`.
- `api.home` is the canonical endpoint layer for downstream boundary checks in
  the task.
- If any structural concern confidence is below `0.7`, output must set
  `pause_decision.pause_required` to `true`.
- No extra prose outside JSON.

## Quick reference rules

The skill must follow these rule IDs (see `AGENTS.md` for details):

- rad-overview-scope
- rad-process
- rad-output

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
- See `fixtures/` for sample repo trees and patterns.
