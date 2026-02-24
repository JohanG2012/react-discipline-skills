# Feature Specification: React Architecture Detection Skill

**Feature Branch**: `002-skill-react-architecture-detection`  
**Created**: 2026-02-23  
**Status**: Completed  
**Input**: User description: "This is spec 002-skill-react-architecture-detection. This is spec 2 out of 5 for the initial phase of the project. The first 5 specs are described in the master spec specs/002-skill-react-architecture-detection/master_spec.md read it. In this spec specifically we will be working on the react architecture detection skill if the master spec leaves open questions you can also read specs/002-skill-react-architecture-detection/master_spec.md for additional structure details"

## Clarifications

### Session 2026-02-23

- Q: What confidence threshold should trigger a clarification pause for structural ambiguity? → A: Use `0.7`; values below `0.7` trigger a clarification pause.
- Q: Should architecture-detection output include an explicit schema version field? → A: Yes; include a mandatory `schema_version` field in every output.
- Q: Should architecture-detection output include raw code snippets by default? → A: No; return structural metadata only by default.
- Q: What should happen when a concern has no clear home under the confidence threshold? → A: Set the concern home to `unknown` and require a clarification pause before downstream planning.
- Q: Should this phase define explicit architecture-detection runtime/scale targets? → A: No; runtime and scale targets are deferred for a later phase.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Classify Repository Architecture (Priority: P1)

As a skill user preparing a change, I need a reliable classification of the repository's current structure so downstream work follows real repository gravity instead of assumptions.

**Why this priority**: Every later decision depends on this baseline; if classification is wrong, placement and implementation decisions will drift immediately.

**Independent Test**: Run architecture detection on one repository and verify it returns one complete classification for routing, UI home, domain organization, data-access home, state ownership, and a single gravity map.

**Acceptance Scenarios**:

1. **Given** a repository with clear routing, UI, data-access, and domain homes, **When** architecture detection runs, **Then** it returns one unambiguous home per concern and a complete gravity map.
2. **Given** a repository with mixed or legacy folder names, **When** architecture detection runs, **Then** it maps those homes to one authoritative concern owner for this task and records notes for downstream reuse.
3. **Given** architecture detection has produced a gravity map for a task, **When** a downstream skill starts planning, **Then** it reuses that map instead of recomputing concern homes.

---

### User Story 2 - Select Safe Migration Strategy (Priority: P2)

As a skill user planning changes, I need one explicit migration strategy so new work avoids parallel architectures and unnecessary churn.

**Why this priority**: Strategy selection controls whether teams follow existing structure, introduce boundary structure, or migrate touched areas; unclear strategy creates inconsistent repository growth.

**Independent Test**: Evaluate one repository and task scope, then verify architecture detection returns exactly one strategy with rationale and that the recommendation avoids duplicate homes for the same concern.

**Acceptance Scenarios**:

1. **Given** a repository with strong existing gravity and a small change scope, **When** strategy is chosen, **Then** the result is to follow existing structure.
2. **Given** a repository that is flat or ad-hoc and a new capability scope, **When** strategy is chosen, **Then** the result introduces target boundaries without forcing broad migration.
3. **Given** a partially aligned repository where touched areas can be clarified immediately, **When** strategy is chosen, **Then** the result recommends migrate-as-you-touch for that bounded area only.

---

### User Story 3 - Handle Ambiguity With Confidence Rules (Priority: P3)

As a reviewer, I need ambiguity and confidence to be explicit so structural decisions are either deterministic or paused only for high-impact uncertainty.

**Why this priority**: Without confidence rules, the skill may over-ask or make high-impact structural guesses, reducing delivery flow and consistency.

**Independent Test**: Run detection on ambiguous and non-ambiguous repositories and verify that high-confidence cases proceed directly while structural low-confidence cases trigger a pause decision with bounded options.

**Acceptance Scenarios**:

1. **Given** a repository with clear concern homes and high confidence, **When** detection completes, **Then** no clarification pause is required.
2. **Given** a repository with competing active homes for a structural concern, **When** confidence falls below `0.7` for that concern, **Then** the output includes a bounded clarification pause decision.
3. **Given** a pause decision is required, **When** the ambiguity is presented, **Then** it includes the ambiguity statement, 2-3 options, and one recommended default.

### Edge Cases

- Repository contains multiple active routing systems in parallel.
- Repository has competing UI homes that are both heavily used.
- Repository has competing backend-access homes with similar activity.
- Repository has alias and non-alias imports that point to the same folders.
- Repository is too small or too inconsistent to establish a clear home for one or more concerns.
- Repository has no explicit state-management layer and relies on local state only.
- Repository includes newly introduced folders with little usage that should not override established gravity.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define `react_architecture_detection` as one of the four production execution skills for the initial phase scope.
- **FR-002**: The system MUST accept repository context, target architecture context, and task-scope context as required detection inputs.
- **FR-003**: The system MUST detect and classify the repository routing approach and identify route entry points.
- **FR-004**: The system MUST detect and classify the current reusable UI home and identify whether shared UI structure is cohesive or fragmented.
- **FR-005**: The system MUST detect and classify the current domain organization model and its authoritative homes.
- **FR-006**: The system MUST detect and classify data-access ownership, including the canonical endpoint layer used for boundary checks in the current task.
- **FR-007**: The system MUST detect and classify server-state and client-state ownership patterns and their current home.
- **FR-008**: The system MUST generate one gravity map that assigns one authoritative home per concern for the current task.
- **FR-009**: The system MUST produce one alignment score from 0 to 100, identify blockers that reduce alignment, and provide one recommended next migration step.
- **FR-010**: The system MUST choose exactly one migration strategy (`follow-existing`, `introduce-boundaries`, or `migrate-as-you-touch`) for the task and provide rationale.
- **FR-011**: The system MUST apply deterministic defaults when confidence is sufficient and MUST avoid unnecessary clarification pauses.
- **FR-012**: The system MUST trigger a clarification pause only when structural ambiguity is high impact and decision-safety confidence is below `0.7`.
- **FR-013**: The system MUST output results in a machine-consumable,
  downstream-reusable contract that includes mandatory envelope fields
  (`schema_version`, `skill`, `version`, `result_type`, `validation_status`) and
  result-type-specific payloads (`detection_result`, `validation_error`,
  `dependency_error`).
- **FR-014**: The system MUST prevent two-architecture outcomes by prohibiting recommendations that establish parallel homes for the same concern in one task.
- **FR-015**: The system MUST limit this skill to detection, mapping, and strategy guidance and MUST NOT implement features, move files, or perform refactors.
- **FR-016**: The system MUST return structural metadata only by default and MUST NOT include raw code snippets in standard architecture-detection output.
- **FR-017**: When any structural concern has gravity confidence below `0.7`, the system MUST set that concern home to `unknown` with ambiguous status and require `pause_decision.pause_required=true` before downstream planning continues.
- **FR-018**: The system MUST support pause modes `strict`, `balanced`, and `autonomous`; `balanced` is the default when no mode is explicitly configured.
- **FR-019**: The system MUST select strategy using explicit mode criteria:
  - `follow-existing` for strong local gravity or small/urgent scope where migration churn is not justified.
  - `introduce-boundaries` for flat/messy or partially structured repositories where isolated target-boundary introduction is safe.
  - `migrate-as-you-touch` only in explicit migration scope where touched-area moves provide immediate clarity.
- **FR-020**: For bootstrap-triggered repositories (`flat/ad-hoc` with no clear routing/UI/API/domain homes), the system MUST constrain recommendations to the canonical bootstrap set, MUST enforce minimal bootstrap (no speculative folders), and MUST enforce the bootstrap exit rule (no alternative concern home creation without explicit migration mode once a canonical home exists).

### Key Entities *(include if feature involves data)*

- **Architecture Detection Request**: The analysis request containing repository context, target architecture context, and task scope.
- **Concern Classification**: The detected state for routing, UI, domain organization, data access, and state ownership.
- **Gravity Map**: The single-task ownership map that assigns authoritative homes for each architectural concern.
- **Strategy Decision**: The selected migration strategy and rationale for the current task.
- **Alignment Assessment**: The alignment score, blockers, and one recommended next migration step showing closeness to target architecture.
- **Pause Decision Record**: A bounded clarification artifact used only for low-confidence, high-impact structural ambiguity.

### Terminology

- **Concern Home**: The repository location considered authoritative for a specific concern in a task.
- **Canonical Endpoint Layer**: The detected authoritative backend-access home used for boundary checks in the task.
- **Gravity Confidence**: Concern-level placement confidence used to determine whether a concern home is clear.
- **Decision-safety Confidence**: Pause-decision confidence used to determine whether structural ambiguity requires clarification.
- **Two-Architecture Anti-pattern**: Parallel treatment of multiple homes as simultaneously correct for the same concern.
- **Pause Mode**: Configurable clarification strictness policy (`strict | balanced | autonomous`) used to determine structural pause thresholds.

### Assumptions

- The master spec (`specs/002-skill-react-architecture-detection/master_spec.md`) is the authoritative source for architectural rules and migration constraints.
- `specs/002-skill-react-architecture-detection/master_spec.md` provides the detailed intent and output shape for this skill when additional detail is needed.
- The shared policy baseline (`agent-policy-v1`) applies to this skill and is not counted as a production execution skill.
- Detection is executed before placement, reuse, and implementation skills for the same task.
- Repository read/search access is available during detection; if unavailable, an explicit context bundle is provided.
- Explicit runtime and scale targets for detection are intentionally deferred and will be defined in a later phase.

### Dependencies

- The four-skill production scope remains fixed as defined in the master spec.
- Project structure conventions in `specs/002-skill-react-architecture-detection/master_spec.md` remain available for skill artifact organization.
- Downstream skills consume this skill's gravity map and strategy output without local overrides unless a clarification pause is explicitly resolved.
- Shared policy constraints continue to govern ambiguity handling, scope discipline, and decision defaults.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of architecture-detection runs, the output includes all required classification fields, one gravity map, one strategy, required strategy rationale, one alignment score, alignment blockers, and one next migration step.
- **SC-002**: In a review sample of at least 20 repositories, at least 90% of concern-home decisions are accepted by reviewers without reclassification.
- **SC-003**: In at least 90% of high-confidence runs, no clarification pause is triggered and downstream planning proceeds without architectural rework.
- **SC-004**: In 100% of structural cases with confidence below `0.7`, output includes a pause decision record with ambiguity, bounded options, and a recommended default.
- **SC-005**: During pilot usage across downstream skills, zero tasks produce approved plans that introduce parallel homes for the same concern.
- **SC-006**: Reviewer-rated usefulness for architecture-detection output averages at least 4.0 out of 5.0 across at least 3 reviewers before broader rollout.
- **SC-007**: In 100% of standard architecture-detection outputs, no raw code snippets are included.
- **SC-008**: In 100% of cases where a concern has confidence below `0.7`, output marks that concern as `unknown` and includes a required pause decision before downstream planning.
- **SC-009**: In 100% of architecture-detection runs, output includes a `pause_decision` record (`pause_required=false` when no structural pause is needed).
- **SC-010**: In 100% of runs, `pause_decision` includes pause-mode metadata (`pause_mode`, `decision_safety_confidence`, `impact`) and follows configured mode thresholds.
- **SC-011**: In 100% of bootstrap-triggered runs, recommendations stay within canonical bootstrap homes, avoid speculative folders, and preserve bootstrap exit constraints.
