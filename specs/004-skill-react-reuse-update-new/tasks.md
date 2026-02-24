# Tasks: React Reuse vs Update vs New Skill

**Input**: Design documents from `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/`  
**Prerequisites**: `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/plan.md`, `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/spec.md`, `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/research.md`, `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/data-model.md`, `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output-contract.md`, `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output.schema.json`

**Tests**: No explicit TDD or new automated test suite was requested in the feature specification. Validation tasks rely on existing repository checks and per-story independent test criteria.

**Organization**: Tasks are grouped by user story to keep each story independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create execution scaffolding and implementation evidence paths.

- [X] T001 Create implementation tracker with phase and user-story checkpoints in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md
- [X] T002 Align execution checklist and requirement-trace references in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish baseline scope, contract framing, and shared constraints required by all user stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T003 Update scope boundaries and shared-baseline inheritance constraints in <REPO_ROOT>/skills/react-reuse-update-new/rules/00_overview.md
- [X] T004 [P] Update skill-level output envelope and result-type summary in <REPO_ROOT>/skills/react-reuse-update-new/SKILL.md
- [X] T005 [P] Sync contract narrative and source-of-truth references in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output-contract.md
- [X] T006 Establish base schema envelope fields (`schema_version`, `result_type`, `validation_status`) in <REPO_ROOT>/skills/react-reuse-update-new/schemas/output.schema.json
- [X] T007 Add base output envelope example aligned with schema envelope in <REPO_ROOT>/skills/react-reuse-update-new/examples/output.example.json
- [X] T008 Record foundational completion evidence in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md

**Checkpoint**: Foundation complete; user story phases can begin.

---

## Phase 3: User Story 1 - Make Deterministic Reuse Decisions (Priority: P1) 🎯 MVP

**Goal**: Produce deterministic per-artifact decisions with explicit thresholds, scoring, and tie-break behavior.

**Independent Test**: Provide one placement plan with multiple required artifacts and verify the output returns one explicit decision per artifact, a concrete target, and concise rationale.

### Implementation for User Story 1

- [X] T009 [P] [US1] Add deterministic decision ladder, candidate scoring, and threshold defaults in <REPO_ROOT>/skills/react-reuse-update-new/rules/10_process.md
- [X] T010 [P] [US1] Add decision output requirements for per-artifact reasoning and tie-break metadata in <REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md
- [X] T011 [US1] Implement `decision_plan` schema sections for thresholds, score profile, tie-break, and decision records in <REPO_ROOT>/skills/react-reuse-update-new/schemas/output.schema.json
- [X] T012 [US1] Update successful output example with deterministic `reuse`/`update`/`new` decisions in <REPO_ROOT>/skills/react-reuse-update-new/examples/output.example.json
- [X] T013 [US1] Sync skill contract summary with deterministic `decision_plan` requirements in <REPO_ROOT>/skills/react-reuse-update-new/SKILL.md
- [X] T014 [US1] Record US1 independent-test evidence in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md

**Checkpoint**: User Story 1 should be independently functional and verifiable.

---

## Phase 4: User Story 2 - Prevent Leaky Generalization (Priority: P2)

**Goal**: Enforce anti-leakage guardrails and safe handling of constraint conflicts.

**Independent Test**: Evaluate decisions for a mixed-domain request and verify outputs reject domain-specific mode flags in shared UI abstractions and prefer domain-owned sections where needed.

### Implementation for User Story 2

- [X] T015 [P] [US2] Add anti-leakage process rules for shared UI (no domain mode flags, no domain naming leakage) in <REPO_ROOT>/skills/react-reuse-update-new/rules/10_process.md
- [X] T016 [P] [US2] Add output guardrail requirements and blocked-decision rationale rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md
- [X] T017 [US2] Add schema constraints for `decision_blocked`, `override_required`, and `constraint_blockers` in <REPO_ROOT>/skills/react-reuse-update-new/schemas/output.schema.json
- [X] T018 [US2] Update example payload to demonstrate blocked decisions and guardrail messaging in <REPO_ROOT>/skills/react-reuse-update-new/examples/output.example.json
- [X] T019 [US2] Update contract behavior section for anti-leakage and `decision_blocked` semantics in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output-contract.md
- [X] T020 [US2] Record US2 independent-test evidence in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md

**Checkpoint**: User Story 2 should be independently functional and verifiable.

---

## Phase 5: User Story 3 - Produce Downstream-Ready Decision Output (Priority: P3)

**Goal**: Deliver strict output variants for success and fail-closed error paths with stable artifact identity continuity.

**Independent Test**: Run the skill on one realistic planning input and verify the revised plan can be consumed directly, with no missing decision fields or contradictory artifacts.

### Implementation for User Story 3

- [X] T021 [P] [US3] Add fail-closed process rules for missing/incomplete repository evidence and invalid inputs in <REPO_ROOT>/skills/react-reuse-update-new/rules/10_process.md
- [X] T022 [P] [US3] Add output requirements for `validation_error`, `dependency_error`, and `needed_artifact_id` continuity in <REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md
- [X] T023 [US3] Implement conditional schema branches for `decision_plan`, `validation_error`, and `dependency_error` in <REPO_ROOT>/skills/react-reuse-update-new/schemas/output.schema.json
- [X] T024 [US3] Update output examples to include successful plan plus both error result types in <REPO_ROOT>/skills/react-reuse-update-new/examples/output.example.json
- [X] T025 [US3] Update skill-level output contract example to reflect stable `needed_artifact_id` and result-type variants in <REPO_ROOT>/skills/react-reuse-update-new/SKILL.md
- [X] T026 [US3] Record US3 independent-test evidence in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md

**Checkpoint**: User Story 3 should be independently functional and verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regenerate derived docs, run validations, and finalize handoff evidence.

- [X] T027 Regenerate <REPO_ROOT>/skills/react-reuse-update-new/AGENTS.md via `npm run build:agents`
- [X] T028 Run repository validation via `npm run check` and record outcomes in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md
- [X] T029 [P] Refresh Codex agent context via `.specify/scripts/bash/update-agent-context.sh codex` and review <REPO_ROOT>/AGENTS.md
- [X] T030 Finalize execution checklist and validation notes in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/quickstart.md
- [X] T031 Perform final cross-file consistency review and capture sign-off evidence in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md
- [X] T032 [P] Add discovery coverage and convention-fit rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/30_discovery_conventions.md
- [X] T033 [P] Add deterministic default-bias and pause-discipline rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/40_default_bias.md
- [X] T034 [P] Add upstream-alignment and migration-safety rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/50_upstream_alignment.md
- [X] T035 [P] Add explicit outcome-threshold interpretation rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/60_decision_thresholds.md
- [X] T036 [P] Add scope-governor cap and expansion-signaling rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/70_scope_governor.md
- [X] T037 [P] Add access-control fallback-context requirements in <REPO_ROOT>/skills/react-reuse-update-new/rules/80_access_control.md
- [X] T038 [P] Add fixed-skill-model alignment constraints in <REPO_ROOT>/skills/react-reuse-update-new/rules/90_skill_model_alignment.md
- [X] T039 Sync expanded decision output schema fields (`decision_mark`, fallback requirements, scope expansion, structured revised plan) in <REPO_ROOT>/skills/react-reuse-update-new/schemas/output.schema.json
- [X] T040 [P] Sync contract schema mirror with implementation schema in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output.schema.json
- [X] T041 [P] Sync contract narrative with expanded output semantics in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/contracts/reuse-decision-output-contract.md
- [X] T042 [P] Update successful decision output example with structured revised-plan fields in <REPO_ROOT>/skills/react-reuse-update-new/examples/output.example.json
- [X] T043 [P] Update dependency-error example with fallback context-bundle requirements in <REPO_ROOT>/skills/react-reuse-update-new/examples/dependency-error.example.json
- [X] T044 [P] Update skill-level rule index and output constraints in <REPO_ROOT>/skills/react-reuse-update-new/SKILL.md
- [X] T045 Record expanded cross-cutting completion evidence in <REPO_ROOT>/specs/004-skill-react-reuse-update-new/implementation-tracker.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user-story work.
- **Phase 3 (US1)**: Depends on Phase 2; establishes MVP deterministic decision baseline.
- **Phase 4 (US2)**: Depends on US1 completion.
- **Phase 5 (US3)**: Depends on US1 completion (execute after US2 to reduce shared-file conflicts).
- **Phase 6 (Polish)**: Depends on all selected user stories.

### User Story Dependency Graph

- **US1 (P1)** -> enables **US2 (P2)** and **US3 (P3)**
- **US2 (P2)** and **US3 (P3)** are functionally independent after US1 but both modify shared rule/schema files.

```text
US1 (P1)
├──> US2 (P2)
└──> US3 (P3)

US2 + US3
└──> Phase 6 Polish
```

### Parallel Opportunities

- **Foundational**: T004 and T005 can run in parallel.
- **US1**: T009 and T010 can run in parallel.
- **US2**: T015 and T016 can run in parallel.
- **US3**: T021 and T022 can run in parallel.
- **Polish**: T029 can run in parallel with T028 after T027 starts.
- **Expanded rule hardening**: T032 through T038 can run in parallel.
- **Expanded contract sync**: T040 through T044 can run in parallel after T039.

---

## Parallel Example: User Story 1

```bash
Task: "Add deterministic decision ladder, candidate scoring, and threshold defaults in <REPO_ROOT>/skills/react-reuse-update-new/rules/10_process.md"
Task: "Add decision output requirements for per-artifact reasoning and tie-break metadata in <REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md"
```

## Parallel Example: User Story 2

```bash
Task: "Add anti-leakage process rules for shared UI in <REPO_ROOT>/skills/react-reuse-update-new/rules/10_process.md"
Task: "Add output guardrail requirements and blocked-decision rationale rules in <REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md"
```

## Parallel Example: User Story 3

```bash
Task: "Add fail-closed process rules for missing/incomplete repository evidence in <REPO_ROOT>/skills/react-reuse-update-new/rules/10_process.md"
Task: "Add output requirements for `validation_error`, `dependency_error`, and `needed_artifact_id` continuity in <REPO_ROOT>/skills/react-reuse-update-new/rules/20_output.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently against the story checkpoint.
4. Review MVP outputs before expanding to guardrails and error variants.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Deliver US1 deterministic decision baseline.
3. Deliver US2 anti-leakage and blocked-decision behavior.
4. Deliver US3 downstream-ready error/result variants and ID continuity.
5. Execute Polish phase validation and handoff.

### Parallel Team Strategy

1. Contributor A: process-rule updates in `rules/10_process.md`.
2. Contributor B: output and schema updates in `rules/20_output.md` and `schemas/output.schema.json`.
3. Contributor C: contract/example/tracker updates in spec artifacts and `examples/output.example.json`.

---

## Notes

- `[P]` tasks are parallelizable only when they touch different files with no unresolved dependencies.
- `[US1]`, `[US2]`, and `[US3]` labels provide direct traceability to user stories in `spec.md`.
- Each user story has an independent test criterion and can be validated before moving to later phases.
