---
name: react-refactoring-progression
description: Plan deterministic, behavior-preserving React refactors using canonical Tier A-D progression. Use after implementation planning to produce a strict JSON refactor_plan (or clarification/dependency/validation error output) with scope-governor enforcement, anti-pattern findings, and semantic-duplication guidance. This optional extension must not emit implementation patches or override architecture, placement, or reuse decisions.
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
- **Optional clarification answers:** when resuming after a prior
  `clarification_request`, provide answers keyed by `question_id`.
- **Output mode:** optional `output_mode` (`human|agent`), default `human`
  when a human explicitly instructs this skill to run, otherwise `agent`
  (unless machine-readable/raw JSON output is explicitly requested)
- **Baseline policy inheritance:** shared baseline rules remain mandatory.

## How to use

Follow this sequence:

1. Validate required inputs and mode prerequisites.
2. Apply mode constraints and scope-governor budget.
3. If critical ambiguity blocks deterministic planning, emit
   `clarification_request` (max 4 questions) and pause.
4. Detect low-risk opportunities first (Tier A/B), then escalate only when
   justified.
5. Validate behavior-preservation constraints for every step.
6. Add anti-pattern and semantic-duplication findings with scored metadata.
7. Emit exactly one structured result object.
8. If home/placement signals are ambiguous, run
   `scripts/scan_home_misplacements.mjs --repo <repo-root> --frontend-root <frontend-source-root> --limit 10 [--home-dir <dir>|<dir>=<canonical>]...`
   (repeat `--frontend-root` for multi-frontend repos) and use returned
   `file_paths[]` as a review queue (or empty list if none likely).
   `--frontend-root` is required and must point to the frontend source root
   (for example `apps/web/src`), not the package root.
   When a trusted architecture-detection result is available, pass detected
   home aliases as `--home-dir` hints (for example
   `--home-dir views=pages --home-dir state=store`) before interpreting
   candidate paths.
   The script output is intentionally path-only candidate data; the LLM/agent
   decides home/placement interpretation.
9. If the agent has low confidence finding duplicate UI/DOM structures on its
   own, run
   `scripts/scan_duplicate_ui_clusters.mjs --repo <repo-root> --frontend-root <frontend-source-root> --limit 10`
   (repeat `--frontend-root` for multi-frontend repos) and use
   `review_groups[]`/`file_paths[]` as side-by-side review candidates only.
   This script only surfaces possible duplicate clusters and does not make
   extraction/refactor decisions.
10. Treat all script outputs as heuristic signals only:
    false positives are expected, unsupported candidates may be dismissed, and
    final placement/reuse/refactor judgment must come from LLM/agent reasoning,
    not script output alone.
11. If all script candidates are dismissed, continue with direct repository
    assessment without helper scripts and rely on skill rules/evidence only.

## Output contract

Return a **single JSON object** with this envelope:

```json
{
  "schema_version": "1.0.0",
  "skill": "react-refactoring-progression",
  "version": "1.0.0",
  "output_mode": "agent|human",
  "presentation": {
    "user_markdown": "### Refactor Progression Summary\n- Result type: refactor_plan"
  },
  "result_type": "refactor_plan|clarification_request|validation_error|dependency_error",
  "validation_status": "accepted|blocked|needs_clarification|validation_error|dependency_error"
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

`clarification_request` excerpt:

```json
{
  "result_type": "clarification_request",
  "validation_status": "needs_clarification",
  "clarification_questions": [
    {
      "question_id": "q1_alias_policy",
      "question": "Deep relative imports detected. Should this plan include alias adoption now?",
      "options": [
        {
          "key": "A",
          "label": "Adopt @/ now",
          "implication": "Includes scoped alias setup plus touched-file import updates."
        },
        {
          "key": "B",
          "label": "Defer alias",
          "implication": "Plan uses existing paths and adds follow-up recommendation only."
        },
        {
          "key": "C",
          "label": "Use existing convention",
          "implication": "Apply repository-specific alias strategy if already documented."
        }
      ],
      "recommended_option": "B"
    }
  ]
}
```

Constraints:

- Machine payload must be a JSON object.
- Output must include `output_mode` and `presentation.user_markdown`.
- `output_mode` must be either `human` or `agent`.
- Resolve `output_mode` with strict precedence:
  1. explicit `output_mode` in request,
  2. explicit machine-readable/raw JSON request -> `agent`,
  3. human explicitly asks to run this skill -> `human`,
  4. otherwise -> `agent`.
- If uncertain between `human` and `agent`, choose `human`.
- The full JSON payload is always produced for both `output_mode` values.
- If `output_mode=human`, print/display only `presentation.user_markdown` to the human.
- If `output_mode=human`, do not print/display raw JSON, envelope fields, or any payload field other than `presentation.user_markdown`.
- If `output_mode=agent`, print/display the full JSON payload.
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
- `clarification_request` must include `clarification_questions[]` with 1 to 4
  questions.
- Each `clarification_question` must include options keyed `A`/`B`/`C` (and may
  include `D` when needed).
- `clarification_request`, `validation_error`, and `dependency_error` must
  include no `plan` payload.
- Dedicated no-op guard:
  - if dedicated mode is requested without specific refactor instructions and no
    meaningful opportunities are found, return accepted `refactor_plan` with
    `plan.steps=[]` and concise guidance to rerun with specific targets.
  - "meaningful opportunities" includes any actionable issue/finding/opportunity
    defined by active shared or skill rules in current scope.
  - in `output_mode=human`, keep `presentation.user_markdown` concise (no full
    findings report) for this case.

## Quick reference rules

- rrp-overview-scope
- rrp-process
- rrp-output
- rrp-validation-gates
- rrp-scope-governor
- rrp-detection
- rrp-detection-assist-scripts
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
- rrp-ui-classname-hygiene
- rrp-a11y-aria-label-hygiene
- rrp-promote-feature-to-composite
- rrp-naming-hygiene
- rrp-test-suggestion-priority

## Files

- `AGENTS.md` contains generated rule lookup index plus inline always-on rules.
- `.shared-rules/` contains generated shared baseline rule sources used by this
  skill at runtime.
- `rules/` contains source-of-truth modular rules.
- `scripts/scan_home_misplacements.mjs` scans repositories for likely
  wrong-home files and returns top candidate paths for review only (no expected
  home recommendations). The scanner requires explicit `--frontend-root` input,
  supports optional repeatable `--home-dir` hints (`<dir>` or
  `<dir>=<canonical>`), and only scans supplied roots.
- `scripts/scan_duplicate_ui_clusters.mjs` scans repositories for repeated
  JSX/DOM and React-component composition clusters across files and returns
  candidate review groups plus deduped `file_paths[]` for side-by-side
  inspection, including atomic interactive-control candidate hints when
  repeated control signatures are detected.
- `schemas/output.schema.json` defines strict machine validation.

## Examples

- `examples/refactor-plan.example.json`
- `examples/blocked-plan.example.json`
- `examples/clarification-request.example.json`
- `examples/validation-error.example.json`
- `examples/dependency-error.example.json`
