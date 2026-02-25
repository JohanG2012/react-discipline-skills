# Tasks: React Refactoring Progression Skill

**Input**: Design documents from `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/`  
**Prerequisites**: `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/plan.md`, `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/spec.md`, `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/research.md`, `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/data-model.md`, `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md`, `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json`

**Tests**: No explicit TDD or standalone test-suite expansion was requested in the feature specification. Validation tasks rely on schema/example checks plus per-story independent test criteria.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare scaffolding and execution tracking for the optional extension skill.

- [X] T001 Create implementation tracker in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md
- [X] T002 Create optional skill directory scaffold in <REPO_ROOT>/skills/react-refactoring-progression/
- [X] T003 [P] Create subdirectories for rules/examples/schemas in <REPO_ROOT>/skills/react-refactoring-progression/rules/, <REPO_ROOT>/skills/react-refactoring-progression/examples/, and <REPO_ROOT>/skills/react-refactoring-progression/schemas/
- [X] T004 [P] Create initial example artifact placeholders in <REPO_ROOT>/skills/react-refactoring-progression/examples/refactor-plan.example.json, <REPO_ROOT>/skills/react-refactoring-progression/examples/blocked-plan.example.json, <REPO_ROOT>/skills/react-refactoring-progression/examples/validation-error.example.json, and <REPO_ROOT>/skills/react-refactoring-progression/examples/dependency-error.example.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish baseline skill contract, rules, and schema envelope required by all user stories.

**⚠️ CRITICAL**: No user story implementation should begin until this phase is complete.

- [X] T005 Implement skill overview and invocation contract in <REPO_ROOT>/skills/react-refactoring-progression/SKILL.md
- [X] T006 [P] Implement optional-extension boundaries and non-production-skill positioning in <REPO_ROOT>/skills/react-refactoring-progression/rules/00_overview.md
- [X] T007 [P] Implement core planning process and canonical Tier A-D progression rules in <REPO_ROOT>/skills/react-refactoring-progression/rules/10_process.md
- [X] T008 [P] Implement strict output-envelope and result-variant rules in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md
- [X] T009 Define base output schema envelope (`schema_version`, `skill`, `version`, `result_type`, `validation_status`) in <REPO_ROOT>/skills/react-refactoring-progression/schemas/output.schema.json
- [X] T010 Mirror foundational schema envelope in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json
- [X] T011 Align foundational contract narrative with skill boundaries in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md
- [X] T012 Record foundational checkpoint evidence in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md

**Checkpoint**: Foundation complete; user story phases can start.

---

## Phase 3: User Story 1 - Produce a Safe Refactor Plan (Priority: P1) 🎯 MVP

**Goal**: Deliver deterministic refactor-plan outputs with strict result variants and clear step rationale.

**Independent Test**: Provide a valid dedicated refactor request and verify output includes ordered steps, Tier A-D labels, risk metadata, and valid `refactor_plan` envelope fields.

### Implementation for User Story 1

- [X] T013 [US1] Implement required step rationale fields (`why_now` + justification category) in <REPO_ROOT>/skills/react-refactoring-progression/rules/10_process.md
- [X] T014 [P] [US1] Implement result-type behavior (`refactor_plan`, `validation_error`, `dependency_error`) in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md
- [X] T015 [US1] Implement `refactor_plan` payload structure (`refactor_mode`, `touch_budget`, `steps`) in <REPO_ROOT>/skills/react-refactoring-progression/schemas/output.schema.json
- [X] T016 [P] [US1] Sync `refactor_plan` and error-variant branches in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json
- [X] T017 [P] [US1] Add accepted refactor-plan example with ordered steps in <REPO_ROOT>/skills/react-refactoring-progression/examples/refactor-plan.example.json
- [X] T018 [US1] Add blocked refactor-plan example with approval-required step metadata in <REPO_ROOT>/skills/react-refactoring-progression/examples/blocked-plan.example.json
- [X] T019 [US1] Update skill workflow narrative for opportunistic and dedicated invocation in <REPO_ROOT>/skills/react-refactoring-progression/SKILL.md
- [X] T020 [US1] Record US1 independent-test evidence in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Keep Refactoring Scope and Behavior Bounded (Priority: P2)

**Goal**: Enforce scope-governor caps, behavior-preservation invariants, and non-blocking higher-tier follow-up handling.

**Independent Test**: Run opportunistic and dedicated mode samples and verify mode-specific limits, behavior-preservation gating, and bounded scope-expansion guidance.

### Implementation for User Story 2

- [X] T021 [US2] Implement scope-governor defaults and escalation boundaries in <REPO_ROOT>/skills/react-refactoring-progression/rules/40_scope_governor.md
- [X] T022 [US2] Implement behavior-preservation invariants and approval gates in <REPO_ROOT>/skills/react-refactoring-progression/rules/30_validation_gates.md
- [X] T023 [P] [US2] Implement output handling for scope-expansion follow-up and non-blocking Tier C/D findings in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md
- [X] T024 [US2] Add schema constraints for opportunistic Tier A/B-only steps and plan step cap in <REPO_ROOT>/skills/react-refactoring-progression/schemas/output.schema.json
- [X] T025 [P] [US2] Sync contract schema mirror for opportunistic restrictions and scope-expansion items in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json
- [X] T026 [P] [US2] Update contract narrative for behavior-preservation and scope-governor guarantees in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md
- [X] T027 [US2] Update blocked-plan example with scope-expansion guidance and preservation records in <REPO_ROOT>/skills/react-refactoring-progression/examples/blocked-plan.example.json
- [X] T028 [US2] Record US2 independent-test evidence in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Detect High-Value Refactor Opportunities (Priority: P3)

**Goal**: Deliver anti-pattern and semantic-duplication recommendations with scored metadata and bounded next-step guidance.

**Independent Test**: Run planning with known anti-pattern and semantic-duplication scenarios; verify findings include tier assignment, extraction target, risk/cost profile, and recommended next step.

### Implementation for User Story 3

- [X] T029 [US3] Implement anti-pattern detection rules for boundary/ownership drift in <REPO_ROOT>/skills/react-refactoring-progression/rules/50_detection.md
- [X] T030 [US3] Implement semantic-duplication qualification and scoring rules in <REPO_ROOT>/skills/react-refactoring-progression/rules/60_semantic_duplication.md
- [X] T031 [P] [US3] Implement output rules for anti-pattern findings and semantic-duplication clusters in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md
- [X] T032 [US3] Extend schema definitions for `anti_pattern_findings` and `semantic_duplication_clusters` in <REPO_ROOT>/skills/react-refactoring-progression/schemas/output.schema.json
- [X] T033 [P] [US3] Sync contract schema mirror for US3 finding/cluster structures in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json
- [X] T034 [P] [US3] Update refactor-plan example with anti-pattern and semantic-duplication metadata in <REPO_ROOT>/skills/react-refactoring-progression/examples/refactor-plan.example.json
- [X] T035 [P] [US3] Add validation-error example payload in <REPO_ROOT>/skills/react-refactoring-progression/examples/validation-error.example.json
- [X] T036 [P] [US3] Add dependency-error example with fallback context-bundle requirements in <REPO_ROOT>/skills/react-refactoring-progression/examples/dependency-error.example.json
- [X] T037 [US3] Record US3 independent-test evidence in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md

**Checkpoint**: User Story 3 is independently functional and verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regenerate derived artifacts, run validation gates, and finalize handoff evidence.

- [X] T038 Regenerate agent summaries including <REPO_ROOT>/skills/react-refactoring-progression/AGENTS.md via `npm run build:agents` from <REPO_ROOT>
- [X] T039 Run repository validation (`npm run check`) and record results in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md
- [X] T040 [P] Refresh Codex context via `.specify/scripts/bash/update-agent-context.sh codex` and review changes in <REPO_ROOT>/AGENTS.md
- [X] T041 Update execution and validation notes in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/quickstart.md
- [X] T042 Perform final schema-contract-skill consistency review and sign-off in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/implementation-tracker.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP contract and plan output baseline.
- **Phase 4 (US2)**: Depends on US1 baseline (shared schema/output rule files).
- **Phase 5 (US3)**: Depends on US1 baseline; can start after Phase 3, but coordinate with Phase 4 due to shared file edits.
- **Phase 6 (Polish)**: Depends on all selected user stories.

### User Story Dependency Graph

- **US1 (P1)** establishes required output and workflow foundation.
- **US2 (P2)** and **US3 (P3)** are independently testable after US1 but both edit shared output/schema artifacts.

```text
US1 (P1)
├──> US2 (P2)
└──> US3 (P3)

US2 + US3
└──> Phase 6 Polish
```

### Parallel Opportunities

- **Setup**: T003 and T004 can run in parallel after T002.
- **Foundational**: T006, T007, and T008 can run in parallel after T005.
- **US1**: T014, T016, and T017 can run in parallel after T013/T015 start.
- **US2**: T023, T025, and T026 can run in parallel after T021/T022.
- **US3**: T031, T033, T034, T035, and T036 can run in parallel after T029/T030.
- **Polish**: T040 can run in parallel with T039 once T038 is underway.

---

## Parallel Example: User Story 1

```bash
Task: "Implement result-type behavior (`refactor_plan`, `validation_error`, `dependency_error`) in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md"
Task: "Sync `refactor_plan` and error-variant branches in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json"
Task: "Add accepted refactor-plan example with ordered steps in <REPO_ROOT>/skills/react-refactoring-progression/examples/refactor-plan.example.json"
```

## Parallel Example: User Story 2

```bash
Task: "Implement output handling for scope-expansion follow-up and non-blocking Tier C/D findings in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md"
Task: "Sync contract schema mirror for opportunistic restrictions and scope-expansion items in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json"
Task: "Update contract narrative for behavior-preservation and scope-governor guarantees in <REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md"
```

## Parallel Example: User Story 3

```bash
Task: "Implement output rules for anti-pattern findings and semantic-duplication clusters in <REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md"
Task: "Add validation-error example payload in <REPO_ROOT>/skills/react-refactoring-progression/examples/validation-error.example.json"
Task: "Add dependency-error example with fallback context-bundle requirements in <REPO_ROOT>/skills/react-refactoring-progression/examples/dependency-error.example.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently using the story checkpoint.
4. Pause for review/demo before additional stories.

### Incremental Delivery

1. Setup + Foundational complete.
2. Deliver US1 and validate independently.
3. Deliver US2 and validate independently.
4. Deliver US3 and validate independently.
5. Run Polish phase validation and finalize handoff.

### Parallel Team Strategy

1. Contributor A: Core process/governor rules in `<REPO_ROOT>/skills/react-refactoring-progression/rules/10_process.md` and `<REPO_ROOT>/skills/react-refactoring-progression/rules/40_scope_governor.md`.
2. Contributor B: Output and schema work in `<REPO_ROOT>/skills/react-refactoring-progression/rules/20_output.md` and `<REPO_ROOT>/skills/react-refactoring-progression/schemas/output.schema.json`.
3. Contributor C: Contract/example/tracker updates in `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/` and `<REPO_ROOT>/skills/react-refactoring-progression/examples/`.

---

## Notes

- `[P]` tasks are parallelizable only when dependencies and file-conflict constraints are satisfied.
- Story labels map directly to prioritized stories in `spec.md`.
- Each user story includes a concrete independent test checkpoint.
- Keep scope within optional-extension boundaries; do not modify the fixed four-skill production set.
