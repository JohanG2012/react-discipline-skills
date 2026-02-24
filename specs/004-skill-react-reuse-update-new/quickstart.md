# Quickstart: React Reuse vs Update vs New Skill

## Goal

Implement and validate `react_reuse_update_new` updates defined in
`<REPO_ROOT>/specs/004-skill-react-reuse-update-new/spec.md`
with deterministic decision outputs, explicit thresholds, stable artifact IDs,
tie-break determinism, explicit decision marks, blocked-decision behavior,
structured revised-plan outputs, scope-expansion signaling, and fail-closed
dependency error handling with fallback context-bundle requirements.

## Prerequisites

- Working branch: `004-skill-react-reuse-update-new`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Steps

1. Review planning artifacts
   - Read `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/plan.md`.
   - Read `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/tasks.md`.
   - Read `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/research.md`.
   - Read `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/data-model.md`.
   - Read `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output-contract.md`.
   - Read `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md`.

2. Update skill policy and process artifacts
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/SKILL.md` for strict output-result handling (`decision_plan`, `validation_error`, `dependency_error`).
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/rules/00_overview.md` with bounded scope and deterministic behavior guarantees.
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/rules/10_process.md` to include:
     - stable `needed_artifact_id` handling
     - default safe-update thresholds
     - deterministic tie-break order
     - `decision_blocked` behavior when constraints block all safe options
     - fail-closed dependency handling when repository evidence is unavailable
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/rules/20_output.md` with strict contract fields and result-type behavior.
   - Add and align cross-cutting rules:
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/30_discovery_conventions.md`
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/40_default_bias.md`
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/50_upstream_alignment.md`
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/60_decision_thresholds.md`
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/70_scope_governor.md`
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/80_access_control.md`
     - `<REPO_ROOT>/skills/react_reuse_update_new/rules/90_skill_model_alignment.md`

3. Align schema and examples
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/schemas/output.schema.json` to match the contract.
   - Mirror schema updates into `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output.schema.json` (only `$id` differs).
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/examples/output.example.json` to include:
     - `decision_mark`
     - `discovery_status`/`discovery_paths`
     - `max_abstraction_risk_score`
     - structured `revised_plan.context_decisions`, `file_actions`, and `layer_justifications`
   - Update `<REPO_ROOT>/skills/react_reuse_update_new/examples/dependency-error.example.json` to include `fallback_context_bundle_requirements`.

4. Regenerate derived agent docs

```bash
cd <REPO_ROOT>
npm run build:agents
```

5. Run repository validation

```bash
cd <REPO_ROOT>
npm run check
```

6. Confirm requirement coverage
   - Verify threshold enforcement (`FR-007`, `FR-021`, `SC-009`).
   - Verify deterministic tie-break behavior (`FR-022`, `SC-010`).
   - Verify `decision_blocked` behavior for constraint conflicts (`FR-023`, `SC-011`).
   - Verify dependency fail-closed behavior (`FR-024`, `SC-012`).
   - Verify stable identity propagation via `needed_artifact_id` (`FR-025`, `SC-013`).
   - Verify decision-mark consistency (`FR-026`, `SC-014`).
   - Verify dependency-error fallback bundle requirements (`FR-027`, `SC-015`).
   - Verify scope-expansion signaling and follow-up scope linkage (`FR-028`, `FR-030`, `SC-016`).
   - Verify structured revised-plan sections are always present for `decision_plan` (`FR-029`).

## Execution Checklist

- [x] Output contract defines `decision_plan`, `validation_error`, and `dependency_error`.
- [x] Each decision record includes stable `needed_artifact_id`.
- [x] Default safe-update thresholds are explicit and testable.
- [x] Tie-break ordering is deterministic and documented.
- [x] Constraint dead-ends produce `decision_blocked` and require explicit override.
- [x] Missing/incomplete repository evidence returns dependency error with no decision package.
- [x] Dependency-error output includes `fallback_context_bundle_requirements[]`.
- [x] Each decision includes a valid `decision_mark`.
- [x] `decision_plan.revised_plan` includes `context_decisions`, `file_actions`, and `layer_justifications`.
- [x] Scope expansion requests, when present, include bounded `scope_expansion_needed[]` and `revised_plan.follow_up_scope[]`.
- [x] Rules `30` through `90` are present and aligned with schema/contract behavior.
- [x] Updated examples validate against updated schema.
- [x] Generated `AGENTS.md` remains up to date.
- [x] `npm run check` passes.

## Tracker Checkpoints

- After Setup + Foundational: update phase status and baseline evidence in
  `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md`.
- After each user story (US1, US2, US3): record independent-test evidence and
  set story status to complete in
  `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md`.
- After Polish: capture `npm run build:agents`, `npm run check`, and
  agent-context update outcomes in
  `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md`.

## Validation Notes

- `npm run build:agents`: passed.
- `npm run check`: passed (`check:agents`, `check:frontmatter`, `check:examples`).
- `.specify/scripts/bash/update-agent-context.sh codex`: passed.
- Schema and examples were aligned to repository validator behavior before final
  successful check run.

## Exit Criteria

- Contract, schema, and examples are consistent.
- Validation checks pass with no stale generated outputs.
- 004 planning artifacts mirror implemented skill behavior and rule modules.
- Feature is ready for final review and merge workflow.
