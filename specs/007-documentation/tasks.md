# Tasks: Root Changelog

**Input**: Design documents from `<REPO_ROOT>/specs/007-documentation/`  
**Prerequisites**: `<REPO_ROOT>/specs/007-documentation/plan.md`, `<REPO_ROOT>/specs/007-documentation/spec.md`, `<REPO_ROOT>/specs/007-documentation/research.md`, `<REPO_ROOT>/specs/007-documentation/data-model.md`, `<REPO_ROOT>/specs/007-documentation/contracts/changelog-document-contract.md`, `<REPO_ROOT>/specs/007-documentation/quickstart.md`

**Tests**: No explicit TDD-first requirement was requested in the specification; tasks include story-level independent verification and repository validation.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize execution artifacts and changelog workspace.

- [X] T001 Create execution tracker in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md
- [X] T002 Create root changelog scaffold with placeholder sections in <REPO_ROOT>/CHANGELOG.md
- [X] T003 [P] Create milestone inventory worksheet in <REPO_ROOT>/specs/007-documentation/milestone-inventory.md
- [X] T004 [P] Create changelog coverage audit worksheet in <REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build canonical milestone/source references required by all user stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T005 Populate merged pre-`007` milestone list from specs history in <REPO_ROOT>/specs/007-documentation/milestone-inventory.md
- [X] T006 Assign milestone classifications (`major`, `context`, `supplemental_minor`) in <REPO_ROOT>/specs/007-documentation/milestone-inventory.md
- [X] T007 Map milestone inventory rows to required acceptance checks in <REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md
- [X] T008 Record foundational completion checkpoint in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md

**Checkpoint**: Foundation complete; user story phases can begin.

---

## Phase 3: User Story 1 - View Project Change History Quickly (Priority: P1) 🎯 MVP

**Goal**: Make major completed milestones immediately visible to repository visitors.

**Independent Test**: A reviewer can identify completed major milestones by reading only `<REPO_ROOT>/CHANGELOG.md`.

### Implementation for User Story 1

- [X] T009 [P] [US1] Draft major milestone section structure in <REPO_ROOT>/CHANGELOG.md
- [X] T010 [P] [US1] Create 60-second discovery check procedure in <REPO_ROOT>/specs/007-documentation/us1-discovery-check.md
- [X] T011 [US1] Add major entries for `react-architecture-detection`, `react-placement-and-layering`, `react-reuse-update-new`, and `react-implementation-discipline` in <REPO_ROOT>/CHANGELOG.md
- [X] T012 [US1] Add "what changed" and "why it matters" summaries for major entries in <REPO_ROOT>/CHANGELOG.md
- [X] T013 [US1] Execute US1 independent test and record results in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md

**Checkpoint**: User Story 1 is independently functional and reviewable.

---

## Phase 4: User Story 2 - Keep Documentation of Past Work Accurate (Priority: P2)

**Goal**: Ensure changelog coverage is complete and factually aligned with default-branch milestone history.

**Independent Test**: Maintainers can sample completed milestones and find accurate corresponding entries in `<REPO_ROOT>/CHANGELOG.md`.

### Implementation for User Story 2

- [X] T014 [P] [US2] Build required milestone-to-entry coverage matrix in <REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md
- [X] T015 [P] [US2] Capture default-branch source evidence links per required milestone in <REPO_ROOT>/specs/007-documentation/us2-source-evidence.md
- [X] T016 [US2] Add any missing pre-`007` milestone entries in <REPO_ROOT>/CHANGELOG.md
- [X] T017 [US2] Label non-production/supporting pre-`007` entries as context in <REPO_ROOT>/CHANGELOG.md
- [X] T018 [US2] Reconcile changelog claims against default-branch sources and fix conflicts in <REPO_ROOT>/CHANGELOG.md
- [X] T019 [US2] Update coverage totals and conflict counts in <REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md
- [X] T020 [US2] Execute US2 independent test and record results in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md

**Checkpoint**: User Story 2 is independently functional and auditable.

---

## Phase 5: User Story 3 - Track Changes in a Readable Structure (Priority: P3)

**Goal**: Improve readability so contributors can quickly locate specific historical changes.

**Independent Test**: Contributors can locate a known historical change quickly from `<REPO_ROOT>/CHANGELOG.md` without commit-level investigation.

### Implementation for User Story 3

- [X] T021 [P] [US3] Draft readability conventions for changelog entries in <REPO_ROOT>/specs/007-documentation/changelog-readability-guide.md
- [X] T022 [US3] Apply readability conventions to entries in <REPO_ROOT>/CHANGELOG.md
- [X] T023 [P] [US3] Add readability/findability validation steps in <REPO_ROOT>/specs/007-documentation/quickstart.md
- [X] T024 [US3] Run contributor findability spot-check and record outcomes in <REPO_ROOT>/specs/007-documentation/us3-findability-check.md
- [X] T025 [US3] Execute US3 independent test and record results in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md

**Checkpoint**: User Story 3 is independently functional and reviewable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment, validation, and delivery sign-off.

- [X] T026 Reconcile final changelog against contract requirements in <REPO_ROOT>/specs/007-documentation/contracts/changelog-document-contract.md
- [X] T027 [P] Run repository validation (`npm run check`) and log summary in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md
- [X] T028 [P] Refresh Codex context via `<REPO_ROOT>/.specify/scripts/bash/update-agent-context.sh codex` and review <REPO_ROOT>/AGENTS.md
- [X] T029 Finalize FR/SC traceability sign-off in <REPO_ROOT>/specs/007-documentation/implementation-tracker.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user story work.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP changelog value.
- **Phase 4 (US2)**: Depends on US1 baseline to audit and complete required milestone coverage.
- **Phase 5 (US3)**: Depends on US2 so readability improvements apply to final complete milestone set.
- **Phase 6 (Polish)**: Depends on all implemented user stories.

### User Story Dependency Graph

```text
US1 (P1) -> US2 (P2) -> US3 (P3)
```

### Parallel Opportunities

- **Setup**: T003 and T004 can run in parallel.
- **US1**: T009 and T010 can run in parallel.
- **US2**: T014 and T015 can run in parallel.
- **US3**: T021 and T023 can run in parallel.
- **Polish**: T027 and T028 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Draft major milestone section structure in <REPO_ROOT>/CHANGELOG.md"
Task: "Create 60-second discovery check procedure in <REPO_ROOT>/specs/007-documentation/us1-discovery-check.md"
```

## Parallel Example: User Story 2

```bash
Task: "Build required milestone-to-entry coverage matrix in <REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md"
Task: "Capture default-branch source evidence links per required milestone in <REPO_ROOT>/specs/007-documentation/us2-source-evidence.md"
```

## Parallel Example: User Story 3

```bash
Task: "Draft readability conventions for changelog entries in <REPO_ROOT>/specs/007-documentation/changelog-readability-guide.md"
Task: "Add readability/findability validation steps in <REPO_ROOT>/specs/007-documentation/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently before expanding scope.

### Incremental Delivery

1. Deliver US1 (MVP) for immediate changelog visibility.
2. Deliver US2 for completeness and factual accuracy.
3. Deliver US3 for readability and fast retrieval.
4. Run Phase 6 polish and validation.

### Parallel Team Strategy

1. Contributor A: Root changelog drafting in `<REPO_ROOT>/CHANGELOG.md`.
2. Contributor B: Coverage/evidence artifacts in `<REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md` and `<REPO_ROOT>/specs/007-documentation/us2-source-evidence.md`.
3. Contributor C: Readability and verification artifacts in `<REPO_ROOT>/specs/007-documentation/changelog-readability-guide.md` and `<REPO_ROOT>/specs/007-documentation/us3-findability-check.md`.

---

## Notes

- `[P]` tasks are parallelizable when listed dependencies are satisfied and file conflicts are avoided.
- `[US1]`, `[US2]`, and `[US3]` labels map directly to prioritized user stories in the feature spec.
- Each user story has an explicit independent test checkpoint task.
