# Tasks: Shared Agent Policy Baseline

**Input**: Design documents from `<REPO_ROOT>/specs/001-agent-policy-v1/`
**Prerequisites**: `<REPO_ROOT>/specs/001-agent-policy-v1/plan.md`, `<REPO_ROOT>/specs/001-agent-policy-v1/spec.md`, `<REPO_ROOT>/specs/001-agent-policy-v1/research.md`, `<REPO_ROOT>/specs/001-agent-policy-v1/data-model.md`, `<REPO_ROOT>/specs/001-agent-policy-v1/contracts/policy-governance-contract.md`

**Tests**: No explicit TDD or automated test creation was requested in the feature specification. Validation tasks focus on governance conformance and existing repository checks.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create implementation tracking artifacts and execution scaffolding.

- [X] T001 Create implementation tracker document in <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md
- [X] T002 Update execution checklist section in <REPO_ROOT>/specs/001-agent-policy-v1/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Align top-level governance and product-scope documents before user-story implementation.

**⚠️ CRITICAL**: No user story work starts until this phase is complete.

- [X] T003 Update production-scope principle and repository constraints in <REPO_ROOT>/.specify/memory/constitution.md
- [X] T004 [P] Update project direction to four production skills in <REPO_ROOT>/README.md
- [X] T005 [P] Update manual Project Intent scope wording in <REPO_ROOT>/AGENTS.md
- [X] T006 Update Product Scope and Skill Model sections in <REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md
- [X] T007 [P] Update governance scope wording in <REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md
- [X] T008 Record cross-document scope-alignment audit results in <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md

**Checkpoint**: Foundation complete; user story phases can begin.

---

## Phase 3: User Story 1 - Define One Shared Policy Baseline (Priority: P1) 🎯 MVP

**Goal**: Define a single authoritative shared baseline (`agent-policy-v1`) with precedence, constraints, defaults, and scope controls.

**Independent Test**: Review only shared-policy artifacts and verify the baseline fully defines constraints, defaults, escalation behavior, and precedence without relying on downstream skill docs.

### Implementation for User Story 1

- [X] T009 [P] [US1] Update baseline purpose, applicability, and precedence wording in <REPO_ROOT>/skills/.shared/policy/SKILL.md
- [X] T010 [P] [US1] Add authoritative scope and document-precedence rules in <REPO_ROOT>/skills/.shared/policy/rules/00_overview.md
- [X] T011 [P] [US1] Add deterministic defaults and scope-governor constraints in <REPO_ROOT>/skills/.shared/policy/rules/10_constraints.md
- [X] T012 [US1] Add baseline coverage and precedence verification clauses in <REPO_ROOT>/specs/001-agent-policy-v1/contracts/policy-governance-contract.md
- [X] T013 [US1] Regenerate baseline skill bundle in <REPO_ROOT>/skills/.shared/policy/AGENTS.md via `npm run build:agents`
- [X] T014 [US1] Record US1 independent validation evidence in <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md

**Checkpoint**: Shared baseline is independently complete and verifiable.

---

## Phase 4: User Story 2 - Apply Baseline Consistently in Skill Specs (Priority: P2)

**Goal**: Ensure all four downstream production skill specs inherit the shared baseline consistently.

**Independent Test**: For any one downstream skill spec, verify baseline reference, inheritance rules, and conflict-handling expectations are explicit and non-contradictory.

### Implementation for User Story 2

- [X] T015 [P] [US2] Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_architecture_detection/SKILL.md
- [X] T016 [P] [US2] Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_placement_and_layering/SKILL.md
- [X] T017 [P] [US2] Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_reuse_update_new/SKILL.md
- [X] T018 [P] [US2] Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_implementation_discipline/SKILL.md
- [X] T019 [P] [US2] Add baseline conformance rule to overview module in <REPO_ROOT>/skills/react_architecture_detection/rules/00_overview.md
- [X] T020 [P] [US2] Add baseline conformance rule to overview module in <REPO_ROOT>/skills/react_placement_and_layering/rules/00_overview.md
- [X] T021 [P] [US2] Add baseline conformance rule to overview module in <REPO_ROOT>/skills/react_reuse_update_new/rules/00_overview.md
- [X] T022 [P] [US2] Add baseline conformance rule to overview module in <REPO_ROOT>/skills/react_implementation_discipline/rules/00_overview.md
- [X] T023 [US2] Add four-skill baseline-reference compliance matrix in <REPO_ROOT>/specs/001-agent-policy-v1/contracts/policy-governance-contract.md
- [X] T024 [US2] Regenerate downstream skill bundles in <REPO_ROOT>/skills/react_architecture_detection/AGENTS.md, <REPO_ROOT>/skills/react_placement_and_layering/AGENTS.md, <REPO_ROOT>/skills/react_reuse_update_new/AGENTS.md, and <REPO_ROOT>/skills/react_implementation_discipline/AGENTS.md via `npm run build:agents`
- [X] T025 [US2] Record US2 independent validation evidence in <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md

**Checkpoint**: All downstream skill specs consistently inherit shared baseline behavior.

---

## Phase 5: User Story 3 - Govern Policy Changes Safely (Priority: P3)

**Goal**: Define explicit, auditable governance for policy changes and exceptions.

**Independent Test**: Propose a conflicting rule change and verify governance docs enforce maintainer-only approval, no-expiry exceptions, collision-registry single source, and explicit version-change handling.

### Implementation for User Story 3

- [X] T026 [P] [US3] Add maintainer-only exception workflow and no-expiry rule in <REPO_ROOT>/skills/.shared/policy/rules/20_governance.md
- [X] T027 [P] [US3] Extend governance schema for exception and version records in <REPO_ROOT>/skills/.shared/policy/schemas/policy.schema.json
- [X] T028 [P] [US3] Update governance example with compliant exception payload in <REPO_ROOT>/skills/.shared/policy/examples/policy_usage.example.md
- [X] T029 [US3] Add maintainer-approval and no-expiry compliance checks in <REPO_ROOT>/specs/001-agent-policy-v1/contracts/policy-governance-contract.md
- [X] T030 [US3] Align conflict-governance language with maintainer-only exceptions in <REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md
- [X] T031 [US3] Align policy-evolution and exception language in <REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md
- [X] T032 [US3] Record US3 independent validation evidence in <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md

**Checkpoint**: Governance updates are auditable, deterministic, and aligned with accepted clarifications.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks and release-readiness validation.

- [X] T033 Run repository validation and capture results in <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md using `npm run check`
- [X] T034 Refresh agent context and capture resulting scope notes in <REPO_ROOT>/AGENTS.md and <REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md via `.specify/scripts/bash/update-agent-context.sh codex`
- [X] T035 Update final verification and handoff checklist in <REPO_ROOT>/specs/001-agent-policy-v1/quickstart.md
- [X] T036 Perform final terminology and cross-reference consistency pass in <REPO_ROOT>/specs/001-agent-policy-v1/spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on US1 completion.
- **Phase 5 (US3)**: Depends on US1 completion (can begin after US1; execute after US2 to avoid contract-file merge conflicts).
- **Phase 6 (Polish)**: Depends on completion of all selected user stories.

### User Story Dependency Graph

- **US1 (P1)** -> enables **US2 (P2)** and **US3 (P3)**
- **US2 (P2)** -> no functional dependency on US3, but both modify governance contract; sequence US2 then US3
- **US3 (P3)** -> final governance hardening before polish

### Parallel Opportunities

- **Setup**: T001 and T002 can run in parallel.
- **Foundational**: T004, T005, and T007 can run in parallel after T003 starts.
- **US1**: T009, T010, and T011 can run in parallel.
- **US2**: T015-T022 can run in parallel across separate skill files.
- **US3**: T026, T027, and T028 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Update baseline purpose, applicability, and precedence wording in <REPO_ROOT>/skills/.shared/policy/SKILL.md"
Task: "Add authoritative scope and document-precedence rules in <REPO_ROOT>/skills/.shared/policy/rules/00_overview.md"
Task: "Add deterministic defaults and scope-governor constraints in <REPO_ROOT>/skills/.shared/policy/rules/10_constraints.md"
```

## Parallel Example: User Story 2

```bash
Task: "Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_architecture_detection/SKILL.md"
Task: "Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_placement_and_layering/SKILL.md"
Task: "Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_reuse_update_new/SKILL.md"
Task: "Add explicit shared-baseline inheritance contract in <REPO_ROOT>/skills/react_implementation_discipline/SKILL.md"
```

## Parallel Example: User Story 3

```bash
Task: "Add maintainer-only exception workflow and no-expiry rule in <REPO_ROOT>/skills/.shared/policy/rules/20_governance.md"
Task: "Extend governance schema for exception and version records in <REPO_ROOT>/skills/.shared/policy/schemas/policy.schema.json"
Task: "Update governance example with compliant exception payload in <REPO_ROOT>/skills/.shared/policy/examples/policy_usage.example.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently using T014 acceptance evidence.
4. Share baseline for review before downstream propagation.

### Incremental Delivery

1. Foundation complete -> baseline complete (US1).
2. Apply baseline consistently to downstream skills (US2).
3. Add governance hardening and exception/version controls (US3).
4. Run final polish checks and validation.

### Parallel Team Strategy

1. One maintainer handles foundational top-level docs (T003, T006).
2. One contributor handles downstream skill inheritance edits (T015-T022).
3. One contributor handles governance schema/example updates (T026-T028).
4. Merge via contract updates and final validation tasks.

---

## Notes

- `[P]` tasks are parallelizable because they target independent files with no direct dependency.
- `[US1]`, `[US2]`, and `[US3]` labels provide strict traceability to the feature specification.
- Independent test criteria for each story are included in each story phase and must be satisfied before moving forward.
