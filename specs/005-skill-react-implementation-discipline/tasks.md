# Tasks: React Implementation Discipline Skill

**Input**: Design documents from `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/`  
**Prerequisites**: `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/plan.md`, `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/spec.md`, `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/research.md`, `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/data-model.md`, `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md`, `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json`

**Tests**: No explicit TDD or new automated test suite was requested in the feature specification. Validation tasks use existing repository checks and per-story independent test criteria.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish execution tracking and artifact scaffolding for this feature.

- [X] T001 Create implementation tracker with phase and user-story checkpoints in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md
- [X] T002 Align execution checklist and requirement-trace references in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/quickstart.md
- [X] T003 [P] Create JSON example scaffold files in <REPO_ROOT>/skills/react_implementation_discipline/examples/output.example.json, <REPO_ROOT>/skills/react_implementation_discipline/examples/blocked-output.example.json, and <REPO_ROOT>/skills/react_implementation_discipline/examples/dependency-error.example.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish baseline rules and contract envelope required by all user stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T004 Update scope boundaries and shared-policy inheritance constraints in <REPO_ROOT>/skills/react_implementation_discipline/rules/00_overview.md
- [X] T005 [P] Expand skill-level inputs, workflow steps, and result-type summary in <REPO_ROOT>/skills/react_implementation_discipline/SKILL.md
- [X] T006 [P] Define process prerequisites for required upstream inputs and repository-context availability in <REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md
- [X] T007 [P] Define mandatory validation-summary and output-envelope requirements in <REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md
- [X] T008 Implement top-level schema envelope (`schema_version`, `result_type`, `validation_summary`) in <REPO_ROOT>/skills/react_implementation_discipline/schemas/output.schema.json
- [X] T009 Mirror foundational schema envelope in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json
- [X] T010 Record foundational completion evidence in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md

**Checkpoint**: Foundation complete; user story phases can begin.

---

## Phase 3: User Story 1 - Implement Planned Changes with Discipline (Priority: P1) 🎯 MVP

**Goal**: Enforce plan fidelity and boundary-safe implementation behavior with reviewable output artifacts.

**Independent Test**: Run the skill with a valid revised plan and verify output touches only planned files (or explicitly justified exceptions) with boundary-compliant updates.

### Implementation for User Story 1

- [X] T011 [US1] Add plan-fidelity execution rules (planned file actions, minimal exception handling, concise exception rationale) in <REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md
- [X] T012 [US1] Add boundary-audit process rules covering forbidden import-direction violations in <REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md
- [X] T013 [P] [US1] Add output requirements for changed-file traceability and boundary audit findings in <REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md
- [X] T014 [US1] Extend output schema with `output_package.changed_files` and `output_package.boundary_audit` constraints in <REPO_ROOT>/skills/react_implementation_discipline/schemas/output.schema.json
- [X] T015 [P] [US1] Sync contract narrative for plan-fidelity and boundary-audit guarantees in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md
- [X] T016 [US1] Create accepted implementation-package example payload in <REPO_ROOT>/skills/react_implementation_discipline/examples/output.example.json
- [X] T017 [US1] Record US1 independent-test evidence in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Preserve Repository Conventions and Stability (Priority: P2)

**Goal**: Enforce convention matching, minimal churn, out-of-scope exclusion, and explicit file-size discipline.

**Independent Test**: Compare generated outputs with nearby analog modules and verify conventions are preserved, unrelated refactors are excluded, and file-size thresholds are enforced.

### Implementation for User Story 2

- [X] T018 [US2] Add convention-matching and minimal-churn process rules in <REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md
- [X] T019 [US2] Add explicit file-size threshold rules (layer soft caps, split >400, hard stop >600) in <REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md
- [X] T020 [P] [US2] Add output rules for blocked state, failed checks, required fixes, and scope deviations in <REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md
- [X] T021 [US2] Extend output schema with `quality_checks`, `required_fixes`, `scope_deviations`, and `scope_expansion_needed` in <REPO_ROOT>/skills/react_implementation_discipline/schemas/output.schema.json
- [X] T022 [P] [US2] Sync contract schema mirror for US2 fields in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json
- [X] T023 [US2] Create blocked implementation-package example with failed mandatory checks and required fixes in <REPO_ROOT>/skills/react_implementation_discipline/examples/blocked-output.example.json
- [X] T024 [US2] Record US2 independent-test evidence in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Deliver Downstream-Ready Implementation Output (Priority: P3)

**Goal**: Deliver strict result variants with mandatory validation summary and deterministic dependency/validation error handling.

**Independent Test**: Review one output package for each final state and verify changed-file coverage, scoped patch/new-file payloads, and structured validation summary fields are complete and consistent.

### Implementation for User Story 3

- [X] T025 [US3] Add process rules for fail-closed dependency handling and fallback context-bundle requirements in <REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md
- [X] T026 [US3] Add output rules for `implementation_package`, `validation_error`, and `dependency_error` with required `validation_summary.final_state` behavior in <REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md
- [X] T027 [US3] Implement conditional schema branches for all result types and final-state constraints in <REPO_ROOT>/skills/react_implementation_discipline/schemas/output.schema.json
- [X] T028 [P] [US3] Sync contract schema mirror with result-type branches and blocked-state requirements in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json
- [X] T029 [P] [US3] Add validation-error example payload in <REPO_ROOT>/skills/react_implementation_discipline/examples/validation-error.example.json
- [X] T030 [P] [US3] Add dependency-error example payload with fallback bundle requirements in <REPO_ROOT>/skills/react_implementation_discipline/examples/dependency-error.example.json
- [X] T031 [US3] Update skill-level output contract snippet and example references in <REPO_ROOT>/skills/react_implementation_discipline/SKILL.md
- [X] T032 [US3] Update contract narrative for result-type semantics and validation-summary guarantees in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md
- [X] T033 [US3] Record US3 independent-test evidence in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md

**Checkpoint**: User Story 3 is independently functional and verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regenerate derived docs, run validations, and finalize handoff evidence.

- [X] T034 Regenerate <REPO_ROOT>/skills/react_implementation_discipline/AGENTS.md via `npm run build:agents`
- [X] T035 Run repository validation via `npm run check` and record outcomes in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md
- [X] T036 [P] Refresh Codex context via `.specify/scripts/bash/update-agent-context.sh codex` and review <REPO_ROOT>/AGENTS.md
- [X] T037 Finalize execution checklist and validation notes in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/quickstart.md
- [X] T038 Perform final cross-file consistency review and sign-off in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/implementation-tracker.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; establishes MVP implementation discipline baseline.
- **Phase 4 (US2)**: Depends on US1 completion.
- **Phase 5 (US3)**: Depends on US1 completion; schedule after US2 to reduce shared-file merge conflicts.
- **Phase 6 (Polish)**: Depends on all selected user stories.

### User Story Dependency Graph

- **US1 (P1)** enables the baseline process and output structure.
- **US2 (P2)** and **US3 (P3)** are independently testable after US1 but both edit shared rule/schema files.

```text
US1 (P1)
├──> US2 (P2)
└──> US3 (P3)

US2 + US3
└──> Phase 6 Polish
```

### Parallel Opportunities

- **Foundational**: T005, T006, and T007 can run in parallel.
- **US1**: T013 and T015 can run in parallel after T012.
- **US2**: T020 and T022 can run in parallel after T021 starts.
- **US3**: T028, T029, and T030 can run in parallel after T027.
- **Polish**: T036 can run in parallel with T035 once T034 starts.

---

## Parallel Example: User Story 1

```bash
Task: "Add output requirements for changed-file traceability and boundary audit findings in <REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md"
Task: "Sync contract narrative for plan-fidelity and boundary-audit guarantees in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md"
```

## Parallel Example: User Story 2

```bash
Task: "Add output rules for blocked state, failed checks, required fixes, and scope deviations in <REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md"
Task: "Sync contract schema mirror for US2 fields in <REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json"
```

## Parallel Example: User Story 3

```bash
Task: "Add validation-error example payload in <REPO_ROOT>/skills/react_implementation_discipline/examples/validation-error.example.json"
Task: "Add dependency-error example payload with fallback bundle requirements in <REPO_ROOT>/skills/react_implementation_discipline/examples/dependency-error.example.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently against its checkpoint.
4. Review MVP outputs before expanding to additional stories.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Deliver US1 and validate independently.
3. Deliver US2 and validate independently.
4. Deliver US3 and validate independently.
5. Execute Polish validations and finalize handoff evidence.

### Parallel Team Strategy

1. Contributor A: process-rule updates in `<REPO_ROOT>/skills/react_implementation_discipline/rules/10_process.md`.
2. Contributor B: output and schema updates in `<REPO_ROOT>/skills/react_implementation_discipline/rules/20_output.md` and `<REPO_ROOT>/skills/react_implementation_discipline/schemas/output.schema.json`.
3. Contributor C: contract/example/tracker updates in `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/` and `<REPO_ROOT>/skills/react_implementation_discipline/examples/`.

---

## Notes

- `[P]` tasks are parallelizable only when they touch different files and have no unresolved dependencies.
- `[US1]`, `[US2]`, and `[US3]` labels map directly to story phases in `spec.md`.
- Each user story phase includes an independent validation checkpoint.
- Keep implementation scope within the approved four-skill product boundary.
