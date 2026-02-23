# Implementation Tracker: Shared Agent Policy Baseline

## Purpose

Track execution evidence for tasks in `<REPO_ROOT>/specs/001-agent-policy-v1/tasks.md`.

## Execution Log

### Setup

- T001: Created implementation tracker file.
- T002: Updated quickstart execution checklist.

### Foundational

- T003: Updated constitution production-scope principle to four execution skills.
- T004: Updated README production-scope statement and skill list.
- T005: Updated AGENTS manual project intent scope to four production skills.
- T006: Updated SPEC product scope and skill model to include `react_implementation_discipline`.
- T007: Updated POLICY scope wording to align four-skill production coverage.
- T008: Completed cross-document scope-alignment audit across constitution, README, AGENTS, SPEC, and POLICY.

### User Story 1 (P1)

- T009: Updated shared baseline purpose/applicability and document-precedence inputs in `skills/.shared/policy/SKILL.md`.
- T010: Added four-skill coverage and precedence rules in `skills/.shared/policy/rules/00_overview.md`.
- T011: Added deterministic-default and scope-governor constraints in `skills/.shared/policy/rules/10_constraints.md`.
- T012: Added baseline coverage and precedence verification clauses in `contracts/policy-governance-contract.md`.
- T013: Regenerated agent bundles with `npm run build:agents`.
- T014: Verified US1 independently by reviewing shared policy artifacts only (`SKILL.md`, `rules/`, contract) and confirming precedence, constraints, and scope controls are explicit.

### User Story 2 (P2)

- T015-T018: Added explicit baseline-inheritance requirements to all four
  downstream `SKILL.md` files.
- T019-T022: Added baseline-conformance requirements to each downstream
  `rules/00_overview.md` module.
- T023: Added four-skill baseline-reference compliance matrix in governance contract.
- T024: Regenerated downstream agent bundles with `npm run build:agents`.
- T025: Verified downstream inheritance language is explicit and non-contradictory.

### User Story 3 (P3)

- T026: Added maintainer-only, no-expiry exception workflow in `skills/.shared/policy/rules/20_governance.md`.
- T027: Extended policy schema for exception records and policy version records in `skills/.shared/policy/schemas/policy.schema.json`.
- T028: Updated policy usage example with compliant exception/version payload in `skills/.shared/policy/examples/policy_usage.example.md`.
- T029: Added maintainer-approval and no-expiry validation checks in governance contract.
- T030: Updated `SPEC.md` with maintainer-only/no-expiry shared-policy exception language.
- T031: Updated `POLICY.md` evolution section with exception governance language.
- T032: Verified US3 independently by tracing a conflicting-rule scenario through contract checks and policy/rules updates.

### Polish

- T033: Ran `npm run check` successfully after fixing check-mode newline comparison in `tools/build/compile_agents.mjs`.
- T034: Refreshed agent context with `.specify/scripts/bash/update-agent-context.sh codex`; root `AGENTS.md` updated.
- T035: Added final verification and handoff checklist in `quickstart.md`.
- T036: Completed terminology/cross-reference consistency pass in `spec.md`.
- Post-completion action: moved template files from repository root into `skills/.shared/templates/`, including adding `00_OVERVIEW_TEMPLATE.md` there and removing root template duplicates.
- Post-completion action: moved shared policy bundle into `skills/.shared/policy/` from its prior top-level location, renamed baseline identifier in headers/content to `agent-policy-v1`, and aligned feature references to `001-agent-policy-v1`.
- Post-completion action: expanded shared baseline rule coverage from `SPEC.md` into numbered rule modules (`30_architecture_boundaries.md`, `40_ownership_naming.md`, `50_decision_defaults.md`, `60_output_discipline.md`, `70_quality_baseline.md`) and synced spec contract/quickstart checks.
- Post-completion action: after a second full `SPEC.md` coverage review, added additional numbered shared-rule modules (`80_planning_reuse_workflow.md`, `90_migration_placement.md`, `100_fallback_defaults.md`, `110_implementation_defaults.md`, `120_layer_contracts.md`, `130_access_write_control.md`, `140_file_size_guidance.md`) and refreshed shared-rule coverage checks in contract/quickstart artifacts.
- Post-completion action: final precautionary `SPEC.md` pass added shared rules for architecture-detection output/bootstrap contract and enforcement heuristics (`150_architecture_detection_contract.md`, `160_enforcement_heuristics.md`) and synchronized SKILL quick-reference plus contract/quickstart coverage criteria.
- Post-completion action: explicit skill-model guardrails were added so production execution scope remains fixed to the four downstream skills and shared policy/config updates are not treated as new execution skills.

## Validation Evidence

- `npm run build:agents`: Completed during T013.
- `npm run check`: Completed during T033.
- Agent context refresh (`update-agent-context.sh codex`): Completed during T034.
