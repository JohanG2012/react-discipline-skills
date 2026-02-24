# Tasks: React Placement and Layering Skill

**Input**: Design documents from `<REPO_ROOT>/specs/003-skill-react-placement-layering/`  
**Prerequisites**: `<REPO_ROOT>/specs/003-skill-react-placement-layering/plan.md`, `<REPO_ROOT>/specs/003-skill-react-placement-layering/spec.md`, `<REPO_ROOT>/specs/003-skill-react-placement-layering/research.md`, `<REPO_ROOT>/specs/003-skill-react-placement-layering/data-model.md`, `<REPO_ROOT>/specs/003-skill-react-placement-layering/contracts/placement-plan-output-contract.md`, `<REPO_ROOT>/specs/003-skill-react-placement-layering/contracts/placement-plan-output.schema.json`

**Tests**: No explicit TDD or new automated test suite was requested in the feature specification. Validation tasks use existing repository checks and per-story independent test criteria.

**Organization**: Tasks are grouped by user story to keep each story independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create execution scaffolding and implementation evidence paths.

- [X] T001 Create feature implementation tracker in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md
- [X] T002 Align execution checklist and evidence references in <REPO_ROOT>/specs/003-skill-react-placement-layering/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish baseline scope and contract scaffolding required by all user stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T003 Update placement scope and shared-baseline inheritance constraints in <REPO_ROOT>/skills/react-placement-and-layering/rules/00_overview.md
- [X] T004 [P] Update strict input/output contract summary in <REPO_ROOT>/skills/react-placement-and-layering/SKILL.md
- [X] T005 [P] Sync implementation-facing contract failure modes in <REPO_ROOT>/specs/003-skill-react-placement-layering/contracts/placement-plan-output-contract.md
- [X] T006 Establish base strict output envelope fields in <REPO_ROOT>/skills/react-placement-and-layering/schemas/output.schema.json

**Checkpoint**: Foundation complete; user story phases can begin.

---

## Phase 3: User Story 1 - Produce a Placement Plan (Priority: P1) 🎯 MVP

**Goal**: Output one complete strict placement plan with required strategy, owner, artifacts, guardrails, and validation metadata.

**Independent Test**: Provide one implementation request with architecture detection output and verify the skill returns one complete placement plan with clear actions for each planned artifact.

### Implementation for User Story 1

- [X] T007 [P] [US1] Define strict plan output field requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md
- [X] T008 [P] [US1] Define artifact-level planning requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md
- [X] T009 [US1] Implement `result_type=plan` required fields and strict shape rules in <REPO_ROOT>/skills/react-placement-and-layering/schemas/output.schema.json
- [X] T010 [US1] Update successful plan example payload in <REPO_ROOT>/skills/react-placement-and-layering/examples/output.example.json
- [X] T011 [US1] Run schema/example validation and record US1 results in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md
- [X] T012 [US1] Record US1 independent-test evidence in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md

**Checkpoint**: User Story 1 should be independently functional and verifiable.

---

## Phase 4: User Story 2 - Enforce Layer Guardrails (Priority: P2)

**Goal**: Enforce boundary guardrails, deterministic precedence behavior, and fail-fast validation for invalid inputs.

**Independent Test**: Evaluate the plan against defined guardrails and verify disallowed cross-layer dependencies are prevented before implementation starts.

### Implementation for User Story 2

- [X] T013 [P] [US2] Add guardrail enforcement rules for layer dependency direction in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md
- [X] T014 [US2] Add architecture-vs-repository precedence rule with pause-resolved structural behavior for `<0.7` conflicts in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md
- [X] T015 [US2] Add `source_of_truth_resolutions` and threshold-conditional source logic in <REPO_ROOT>/skills/react-placement-and-layering/schemas/output.schema.json
- [X] T016 [P] [US2] Add `result_type=validation_error` fail-fast output requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md
- [X] T017 [US2] Update output example with guardrails and source-of-truth resolution fields in <REPO_ROOT>/skills/react-placement-and-layering/examples/output.example.json
- [X] T018 [US2] Record US2 independent-test evidence in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md

**Checkpoint**: User Story 2 should be independently functional and verifiable.

---

## Phase 5: User Story 3 - Prefer Reuse Before New Artifacts (Priority: P3)

**Goal**: Enforce repository lookup and deterministic reuse/update/create decisions with safe ambiguity handling.

**Independent Test**: Run the skill on a repository with existing relevant artifacts and verify the plan marks clear reuse/update actions instead of unnecessary new files.

### Implementation for User Story 3

- [X] T019 [P] [US3] Add required existing-artifact lookup checklist in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md
- [X] T020 [US3] Add deterministic reuse-update-create decision ladder and ambiguity fallback in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md
- [X] T021 [P] [US3] Add explicit action-rationale and structural-note requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md
- [X] T022 [US3] Tighten reuse/action constraints and note limits in <REPO_ROOT>/skills/react-placement-and-layering/schemas/output.schema.json
- [X] T023 [US3] Update output example to demonstrate reuse/update-first behavior in <REPO_ROOT>/skills/react-placement-and-layering/examples/output.example.json
- [X] T024 [US3] Record US3 independent-test evidence in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md

**Checkpoint**: User Story 3 should be independently functional and verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regenerate derived artifacts, run validations, and finalize handoff evidence.

- [X] T025 Regenerate <REPO_ROOT>/skills/react-placement-and-layering/AGENTS.md via `npm run build:agents`
- [X] T026 Run repository validation via `npm run check` and record results in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md
- [X] T027 [P] Refresh Codex agent context and review <REPO_ROOT>/AGENTS.md via `.specify/scripts/bash/update-agent-context.sh codex`
- [X] T028 Finalize execution checklist and validation notes in <REPO_ROOT>/specs/003-skill-react-placement-layering/quickstart.md
- [X] T029 Perform final cross-file consistency review and capture sign-off evidence in <REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user-story work.
- **Phase 3 (US1)**: Depends on Phase 2; establishes MVP contract behavior.
- **Phase 4 (US2)**: Depends on US1 completion.
- **Phase 5 (US3)**: Depends on US1 completion (execute after US2 to reduce shared-file conflicts).
- **Phase 6 (Polish)**: Depends on all selected user stories.

### User Story Dependency Graph

- **US1 (P1)** -> enables **US2 (P2)** and **US3 (P3)**
- **US2 (P2)** and **US3 (P3)** are functionally independent after US1, but both modify shared rule/schema files.

```text
US1 (P1)
├──> US2 (P2)
└──> US3 (P3)

US2 + US3
└──> Phase 6 Polish
```

### Parallel Opportunities

- **Foundational**: T004 and T005 can run in parallel.
- **US1**: T007 and T008 can run in parallel.
- **US2**: T013 and T016 can run in parallel.
- **US3**: T019 and T021 can run in parallel.
- **Polish**: T027 can run in parallel with T026 after T025 starts.

---

## Parallel Example: User Story 1

```bash
Task: "Define strict plan output field requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md"
Task: "Define artifact-level planning requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md"
```

## Parallel Example: User Story 2

```bash
Task: "Add guardrail enforcement rules for layer dependency direction in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md"
Task: "Add `result_type=validation_error` fail-fast output requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md"
```

## Parallel Example: User Story 3

```bash
Task: "Add required existing-artifact lookup checklist in <REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md"
Task: "Add explicit action-rationale and structural-note requirements in <REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently using the story checkpoint.
4. Demo/review strict placement-plan output before expanding scope.

### Incremental Delivery

1. Finish Setup + Foundational -> stable baseline.
2. Deliver US1 placement-plan contract behavior.
3. Deliver US2 guardrail and precedence behavior.
4. Deliver US3 reuse-first decision behavior.
5. Execute Polish phase and handoff.

### Parallel Team Strategy

1. One contributor owns process-rule updates (`rules/10_process.md`).
2. One contributor owns output-contract updates (`rules/20_output.md`, schema/example).
3. One contributor owns validation/handoff artifacts (`implementation-tracker.md`, `quickstart.md`, `AGENTS.md` updates).

---

## Notes

- `[P]` tasks are parallelizable only when they touch different files with no unresolved dependencies.
- `[US1]`, `[US2]`, and `[US3]` labels map tasks directly to prioritized user stories.
- Each story has an explicit independent test criterion and can be validated before moving to later phases.
