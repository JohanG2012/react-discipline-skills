---
name: react-refactoring-progression
description: Plan deterministic, behavior-preserving React refactors using canonical Tier A-D progression. Use after implementation planning to produce a strict JSON refactor_plan (or validation/dependency error) with scope-governor enforcement, anti-pattern findings, and semantic-duplication guidance. This optional extension must not emit implementation patches or override architecture, placement, or reuse decisions.
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: react, refactoring, planning, progression
---

# React Refactoring Progression

## Purpose

Provide deterministic refactor planning guidance that improves code quality while
preserving behavior and respecting strict scope limits.

Default usage is an opportunistic consult at the end of
`react-implementation-discipline` execution (micro or standard mode), with
scope limited to already-touched files.

## When to apply

Use this skill when:

- You need a structured refactor plan with explicit risk ordering.
- You need bounded opportunistic cleanup for files already touched by
  implementation work.
- You need dedicated refactor planning with explicit scope governance.
- You want anti-pattern and semantic-duplication findings represented with
  scored, actionable follow-up guidance.

Do not use this skill when:

- You need implementation patches or direct code editing output.
- You need architecture detection, placement decisions, or reuse/update/new
  artifact decisions (use upstream skills first).

## Inputs

The skill expects:

- **Task request:** refactor intent and context.
- **Mode:** `opportunistic` or `dedicated`.
- **Upstream context references:** architecture detection, placement, reuse, and
  implementation context.
- **Touched file set:** required in opportunistic mode.
- **Optional scope overrides:** explicit, approved governor changes.
- **Baseline policy inheritance:** shared baseline rules remain mandatory.

## How to use

Follow this sequence:

1. Validate required inputs and mode prerequisites.
2. Apply mode constraints and scope-governor budget.
3. Detect low-risk opportunities first (Tier A/B), then escalate only when
   justified.
4. Validate behavior-preservation constraints for every step.
5. Add anti-pattern and semantic-duplication findings with scored metadata.
6. Emit exactly one structured result object.

## Output contract

Return a **single JSON object** with this envelope:

```json
{
  "schema_version": "1.0.0",
  "skill": "react-refactoring-progression",
  "version": "1.0.0",
  "result_type": "refactor_plan|validation_error|dependency_error",
  "validation_status": "accepted|blocked|validation_error|dependency_error"
}
```

`refactor_plan` excerpt:

```json
{
  "result_type": "refactor_plan",
  "refactor_mode": "opportunistic",
  "plan": {
    "touch_budget": {
      "max_files_touched": 8,
      "max_new_files": 4,
      "max_moved_or_renamed": 0,
      "max_new_dependencies": 0,
      "max_new_top_level_folders": 0,
      "plan_step_cap": 5
    },
    "steps": [
      {
        "tier": "A",
        "title": "Remove unused imports",
        "files": ["src/features/tasks/TaskList.tsx"],
        "change_type": "safety",
        "risk": "low",
        "behavior_change": "none",
        "why_now": "Reduces noise and keeps scope local.",
        "standard_alignment": "Matches implementation-discipline hygiene defaults."
      }
    ]
  }
}
```

Constraints:

- Output must be JSON only.
- Tier labels are canonical `A|B|C|D` only.
- Opportunistic mode allows only Tier A/B active steps and max 5 steps.
- Tier C/D findings in opportunistic mode are non-blocking follow-up guidance
  only.
- Opportunistic mode may include up to 2 directly related test-file updates
  without counting them against touched-file budget when no new dependencies are
  introduced.
- `dependency_error` must include actionable
  `fallback_context_bundle_requirements[]`.
- `validation_error` and `dependency_error` must include no `plan` payload.
- No extra prose outside JSON.

## Quick reference rules

- rrp-overview-scope
- rrp-process
- rrp-output
- rrp-validation-gates
- rrp-scope-governor
- rrp-detection
- rrp-semantic-duplication
- rrp-interactions
- rrp-progression-model
- rrp-dup-pattern-types
- rrp-dup-two-signals
- rrp-dup-evidence
- rrp-dup-home-alignment
- rrp-dup-slots-over-props
- rrp-dup-one-level-up
- rrp-dup-keep-separate
- rrp-dup-locality
- rrp-dup-cognitive-load
- rrp-dup-refactor-radius
- rrp-dup-micro-before-mega
- rrp-dup-output
- rrp-dup-next-actions
- rrp-dup-keep-separate-output

## Files

- `AGENTS.md` contains generated full rules.
- `rules/` contains source-of-truth modular rules.
- `schemas/output.schema.json` defines strict machine validation.

## Examples

- `examples/refactor-plan.example.json`
- `examples/blocked-plan.example.json`
- `examples/validation-error.example.json`
- `examples/dependency-error.example.json`
