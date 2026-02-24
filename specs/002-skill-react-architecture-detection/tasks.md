# Tasks: React Architecture Detection Skill

**Input**: Design documents from `<REPO_ROOT>/specs/002-skill-react-architecture-detection/`  
**Prerequisites**: `<REPO_ROOT>/specs/002-skill-react-architecture-detection/plan.md`, `<REPO_ROOT>/specs/002-skill-react-architecture-detection/spec.md`, `<REPO_ROOT>/specs/002-skill-react-architecture-detection/research.md`, `<REPO_ROOT>/specs/002-skill-react-architecture-detection/data-model.md`, `<REPO_ROOT>/specs/002-skill-react-architecture-detection/contracts/architecture-detection-output-contract.md`, `<REPO_ROOT>/specs/002-skill-react-architecture-detection/contracts/architecture-detection-output.schema.json`

**Tests**: No explicit TDD or new automated test suite was requested in the feature spec. Validation tasks use existing repository checks and per-story independent test criteria.

**Organization**: Tasks are grouped by user story to ensure each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create execution scaffolding and align implementation references.

- [X] T001 Create implementation tracker with phase and story checkpoints in <REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md
- [X] T002 Align execution checklist and validation steps with planned contract changes in <REPO_ROOT>/specs/002-skill-react-architecture-detection/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish cross-story contract and scope constraints before user-story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Update scope boundaries (detection-only, no refactor, no direct edits) in <REPO_ROOT>/skills/react-architecture-detection/rules/00_overview.md
- [X] T004 [P] Update skill-level output contract summary and baseline inheritance notes in <REPO_ROOT>/skills/react-architecture-detection/SKILL.md
- [X] T005 [P] Confirm canonical contract rules and failure modes in <REPO_ROOT>/specs/002-skill-react-architecture-detection/contracts/architecture-detection-output-contract.md
- [X] T006 Record foundational completion evidence in <REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md

**Checkpoint**: Foundation complete; user story phases can begin.

---

## Phase 3: User Story 1 - Classify Repository Architecture (Priority: P1) 🎯 MVP

**Goal**: Produce reliable architecture classification and gravity mapping output for downstream reuse.

**Independent Test**: Run architecture detection on one repository and verify output includes routing, UI home, domain organization, data-access home, state ownership, and one gravity map.

### Implementation for User Story 1

- [X] T007 [P] [US1] Expand detection scan workflow for routing/UI/domain/data/state signals in <REPO_ROOT>/skills/react-architecture-detection/rules/10_process.md
- [X] T008 [P] [US1] Define required classification and gravity-map output fields in <REPO_ROOT>/skills/react-architecture-detection/rules/20_output.md
- [X] T009 [US1] Implement classification, concern-assessment, and gravity-map schema fields in <REPO_ROOT>/skills/react-architecture-detection/schemas/output.schema.json
- [X] T010 [US1] Update example payload with complete classification and gravity-map output in <REPO_ROOT>/skills/react-architecture-detection/examples/output.example.json
- [X] T011 [US1] Sync skill contract narrative with US1 output requirements in <REPO_ROOT>/skills/react-architecture-detection/SKILL.md
- [X] T012 [US1] Record US1 independent validation evidence in <REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Select Safe Migration Strategy (Priority: P2)

**Goal**: Ensure output always includes one explicit strategy with rationale and anti-parallel-home safeguards.

**Independent Test**: Evaluate one repository and task scope; verify output contains exactly one strategy (`follow-existing`, `introduce-boundaries`, or `migrate-as-you-touch`) with rationale and no duplicate concern homes.

### Implementation for User Story 2

- [X] T013 [P] [US2] Add strategy-selection criteria and anti-parallel-home guardrails in <REPO_ROOT>/skills/react-architecture-detection/rules/10_process.md
- [X] T014 [P] [US2] Add strategy output constraints and rationale requirements in <REPO_ROOT>/skills/react-architecture-detection/rules/20_output.md
- [X] T015 [US2] Add single-strategy enum and alignment/notes constraints in <REPO_ROOT>/skills/react-architecture-detection/schemas/output.schema.json
- [X] T016 [US2] Update example payload with strategy and rationale-compatible fields in <REPO_ROOT>/skills/react-architecture-detection/examples/output.example.json
- [X] T017 [US2] Align downstream-consumption expectations with strategy behavior in <REPO_ROOT>/specs/002-skill-react-architecture-detection/contracts/architecture-detection-output-contract.md
- [X] T018 [US2] Record US2 independent validation evidence in <REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Handle Ambiguity With Confidence Rules (Priority: P3)

**Goal**: Enforce deterministic low-confidence behavior (`< 0.7`), pause decisions, and metadata-only output.

**Independent Test**: Run detection on ambiguous and non-ambiguous repositories; verify high-confidence runs do not pause, while low-confidence structural runs set `home=unknown` and produce required `pause_decision` metadata.

### Implementation for User Story 3

- [X] T019 [P] [US3] Add confidence-threshold and pause-trigger rules (`<0.7 => unknown`) in <REPO_ROOT>/skills/react-architecture-detection/rules/10_process.md
- [X] T020 [P] [US3] Add mandatory `schema_version` plus metadata-only/no-snippet output rules in <REPO_ROOT>/skills/react-architecture-detection/rules/20_output.md
- [X] T021 [US3] Implement threshold-conditional concern rules and required `pause_decision` structure in <REPO_ROOT>/skills/react-architecture-detection/schemas/output.schema.json
- [X] T022 [US3] Update example payload to include `schema_version`, compliant confidence handling, and `pause_decision` shape in <REPO_ROOT>/skills/react-architecture-detection/examples/output.example.json
- [X] T023 [US3] Update output contract block to prohibit raw snippets in standard output in <REPO_ROOT>/skills/react-architecture-detection/SKILL.md
- [X] T024 [US3] Record US3 independent validation evidence in <REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md

**Checkpoint**: User Story 3 is independently functional and verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regenerate derived artifacts, run validations, and finalize handoff evidence.

- [X] T025 Regenerate <REPO_ROOT>/skills/react-architecture-detection/AGENTS.md via `npm run build:agents`
- [X] T026 Run repository validation via `npm run check` and record results in <REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md
- [X] T027 [P] Refresh agent context via `.specify/scripts/bash/update-agent-context.sh codex` and review <REPO_ROOT>/AGENTS.md
- [X] T028 Finalize quickstart handoff checklist and validation notes in <REPO_ROOT>/specs/002-skill-react-architecture-detection/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; establishes MVP contract baseline.
- **Phase 4 (US2)**: Depends on US1 completion.
- **Phase 5 (US3)**: Depends on US1 completion (execute after US2 to minimize shared-file merge conflicts).
- **Phase 6 (Polish)**: Depends on all selected user stories.

### User Story Dependency Graph

- **US1 (P1)** -> enables **US2 (P2)** and **US3 (P3)**
- **US2 (P2)** -> no functional dependency on US3, but both edit shared rule/schema files
- **US3 (P3)** -> final ambiguity hardening before polish

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
- **US2**: T013 and T014 can run in parallel.
- **US3**: T019 and T020 can run in parallel.
- **Polish**: T027 can run in parallel with T026 after T025 starts.

---

## Parallel Example: User Story 1

```bash
Task: "Expand detection scan workflow for routing/UI/domain/data/state signals in <REPO_ROOT>/skills/react-architecture-detection/rules/10_process.md"
Task: "Define required classification and gravity-map output fields in <REPO_ROOT>/skills/react-architecture-detection/rules/20_output.md"
```

## Parallel Example: User Story 2

```bash
Task: "Add strategy-selection criteria and anti-parallel-home guardrails in <REPO_ROOT>/skills/react-architecture-detection/rules/10_process.md"
Task: "Add strategy output constraints and rationale requirements in <REPO_ROOT>/skills/react-architecture-detection/rules/20_output.md"
```

## Parallel Example: User Story 3

```bash
Task: "Add confidence-threshold and pause-trigger rules (`<0.7 => unknown`) in <REPO_ROOT>/skills/react-architecture-detection/rules/10_process.md"
Task: "Add mandatory `schema_version` plus metadata-only/no-snippet output rules in <REPO_ROOT>/skills/react-architecture-detection/rules/20_output.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently against the story checkpoint.
4. Review MVP output contract before expanding to strategy/ambiguity hardening.

### Incremental Delivery

1. Setup + Foundational -> contract baseline ready.
2. Deliver US1 classification/gravity map.
3. Deliver US2 strategy selection.
4. Deliver US3 confidence/pause hardening.
5. Run polish validation and handoff checks.

### Parallel Team Strategy

1. One contributor updates process rules (`rules/10_process.md`) while another updates output rules (`rules/20_output.md`) in each story phase.
2. A third contributor updates spec-side contract/tracker files concurrently when marked `[P]`.
3. Merge on schema/example synchronization and complete per-story validation checkpoints.

---

## Notes

- `[P]` tasks are parallelizable only when they target different files and have no unfinished dependencies.
- `[US1]`, `[US2]`, and `[US3]` labels provide traceability to the prioritized user stories.
- Each story includes an independent test checkpoint and can be validated without waiting for later phases.
