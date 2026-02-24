# Feature Specification: React Implementation Discipline Skill

**Feature Branch**: `005-skill-react-implementation-discipline`  
**Created**: 2026-02-24  
**Status**: Completed  
**Input**: User description: "This is spec 005-skill-react-implementation-discipline. This is spec 5 out of 5 for the initial phase of the project. The first 5 specs are described in the master spec specs/005-skill-react-implementation-discipline/master_spec.md read it. In this spec specifically we will be working on the react implementatin discipline skill if the master spec leaves open questions you can also read specs/005-skill-react-implementation-discipline/master_spec.md for additional structure details"

## Clarifications

### Session 2026-02-24

- Q: How should the skill handle final quality-gate check failures? → A: Return implementation output marked blocked, with explicit failed checks and required fixes.
- Q: What default out-of-scope boundaries should this skill enforce? → A: No architecture migration, no new dependencies, no unrelated refactors, and no policy/spec edits unless explicitly requested.
- Q: How should the skill behave when repository context is unavailable for convention matching? → A: Fail closed with a structured dependency error and no implementation output package.
- Q: Should file-size discipline use explicit thresholds? → A: Yes, enforce layer soft caps, mandatory split above 400 lines, and hard stop above 600 lines.
- Q: Should every output include a structured validation summary? → A: Yes, include check status, boundary results, scope deviations, and final state in every output.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Implement Planned Changes with Discipline (Priority: P1)

As a coding agent, I need to execute only the approved revised plan so delivered changes are predictable, reviewable, and aligned with architecture boundaries.

**Why this priority**: This is the core purpose of the skill and the final execution gate for all upstream planning work.

**Independent Test**: Run the skill with a valid revised plan and verify output changes only target planned files (or explicitly documented exception files) with boundary-compliant updates.

**Acceptance Scenarios**:

1. **Given** a revised plan with explicit file actions, **When** the skill produces implementation output, **Then** each changed file maps to a planned action or a documented minimal exception.
2. **Given** a plan that would force an architecture-boundary violation, **When** implementation is generated, **Then** the skill rejects that path and emits a compliant alternative.
3. **Given** complete upstream inputs, **When** implementation output is generated, **Then** it includes concise rationale for any unavoidable extra touch.

---

### User Story 2 - Preserve Repository Conventions and Stability (Priority: P2)

As a maintainer, I need implementations to follow existing local conventions and avoid unnecessary churn so changes remain easy to review and low risk.

**Why this priority**: Consistency and low churn protect long-term maintainability and reduce downstream breakage risk.

**Independent Test**: Compare generated outputs with nearby existing modules and confirm naming, export style, and error-handling conventions are preserved without unrelated refactors.

**Acceptance Scenarios**:

1. **Given** nearby analog files with established conventions, **When** the skill updates or adds files, **Then** it mirrors the established conventions in that local area.
2. **Given** a request where optional cleanup is possible but not required, **When** output is generated, **Then** unrelated renames, reformatting, or pattern swaps are not introduced.
3. **Given** a change that risks excessive file growth, **When** implementation is prepared, **Then** the skill applies split/extraction behavior to stay within discipline limits.

---

### User Story 3 - Deliver Downstream-Ready Implementation Output (Priority: P3)

As a reviewer, I need implementation output that is easy to apply and validate so acceptance can happen quickly with clear confidence signals.

**Why this priority**: The feature is complete only when reviewers can verify correctness and scope quickly.

**Independent Test**: Review one generated output package and verify it includes changed-file coverage, scoped patch content, and quality-gate confirmation points.

**Acceptance Scenarios**:

1. **Given** an implementation task with mixed updates and new files, **When** output is delivered, **Then** updates are patch-oriented and new files are complete.
2. **Given** conflicting local patterns in the repository, **When** ambiguity exists, **Then** the skill applies the lowest-churn strategy and documents the selected path.
3. **Given** a finished output package, **When** a reviewer inspects it, **Then** boundary, scope, and consistency checks are explicitly verifiable.

### Edge Cases

- Revised plan is missing required file targets or contains contradictory actions.
- Required upstream artifacts are incomplete, stale, or mutually inconsistent.
- Repository context for local convention matching cannot be retrieved for one or more target areas.
- A required update cannot be completed without touching one additional dependency file.
- The only available implementation approach would violate import boundaries.
- Multiple local patterns exist for naming/export conventions in the same concern area.
- Requested output scope exceeds default scope-governor limits.
- Request includes architecture migration, dependency additions, or unrelated cleanup not explicitly requested.
- A planned update would push a file beyond defined complexity or size thresholds.
- New output introduces potential circular dependency risk between touched modules.
- Existing code quality issues are discovered in touched files but are unrelated to requested behavior.
- One or more final quality-gate checks fail for the generated output package.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define `react_implementation_discipline` as one of the four production execution skills for initial project scope.
- **FR-002**: The system MUST require valid `revised_plan`, `detection_result`, `reuse_decisions`, and repository context before generating implementation output.
- **FR-003**: The system MUST execute implementation according to revised plan intent and touched-file scope.
- **FR-004**: The system MUST restrict changes to planned files unless a minimal dependency or export wiring touch is required to keep the change functional.
- **FR-005**: The system MUST explicitly identify every out-of-plan file touch and include a concise reason.
- **FR-006**: The system MUST enforce architecture boundary rules from the governing specification before finalizing output.
- **FR-007**: The system MUST prevent implementation paths that require forbidden cross-layer imports.
- **FR-008**: The system MUST enforce a minimal-churn policy by excluding unrelated renames, broad formatting, or speculative refactors.
- **FR-009**: The system MUST follow established local conventions in the nearest relevant repository area for naming, exports, and behavioral patterns.
- **FR-010**: The system MUST apply complexity discipline by splitting or extracting work when planned changes would exceed defined file-size guardrails.
- **FR-010A**: The system MUST enforce default soft caps by layer: pages 120-150 lines, sections 200-250, composites 200-250, hooks 150-200, endpoints 80-120, and primitives up to 150.
- **FR-010B**: The system MUST require mandatory split/extraction when any touched file would exceed 400 lines.
- **FR-010C**: The system MUST apply a hard stop when any touched file would exceed 600 lines and return blocked output with required refactor actions.
- **FR-011**: The system MUST keep shared UI assets generic and prevent domain-specific leakage into shared abstractions.
- **FR-012**: The system MUST preserve predictable data flow boundaries and avoid bypassing the canonical endpoint ownership model.
- **FR-013**: The system MUST produce review-friendly implementation output that lists changed files and provides scoped patch-style updates for modified files.
- **FR-014**: The system MUST provide full file content for newly created files in the output package.
- **FR-015**: The system MUST run final quality-gate checks covering boundary safety, dependency safety, and state/behavior consistency before declaring output complete.
- **FR-016**: The system MUST resolve ambiguity using migration-aware strategy defaults and choose the lowest-churn compliant path when multiple valid options exist.
- **FR-017**: The system MUST inherit shared governance constraints from `agent-policy-v1` without introducing conflicting mandatory policy.
- **FR-018**: The system MUST enforce default scope-governor constraints and return bounded expansion guidance when requested work exceeds those limits.
- **FR-019**: The system MUST reject incomplete required-input requests with structured validation feedback and MUST NOT emit partial implementation output.
- **FR-020**: The system MUST keep this skill’s scope limited to disciplined implementation execution and must not redefine upstream planning decisions.
- **FR-021**: When any mandatory final quality-gate check fails, the system MUST return the implementation output package marked as blocked, MUST list failed checks, and MUST include required fixes before acceptance.
- **FR-022**: By default, the system MUST treat architecture migration, new dependency introduction, unrelated refactors/cleanup, and policy/specification document edits as out of scope unless explicitly requested.
- **FR-023**: When out-of-scope work is requested without explicit approval, the system MUST exclude it from implementation output and represent it through bounded scope-expansion guidance.
- **FR-024**: When repository context required for convention matching or boundary validation is unavailable, the system MUST fail closed with a structured dependency error and MUST NOT emit an implementation output package.
- **FR-025**: Every implementation output package MUST include a structured validation summary containing quality-check status, boundary-check results, scope deviations, and final output state (`accepted`, `blocked`, `dependency_error`, or `validation_error`).
- **FR-026**: The system MUST support exactly these structured result types: `implementation_package`, `validation_error`, and `dependency_error`.
- **FR-027**: `validation_error` and `dependency_error` outputs MUST NOT include implementation output payload content.
- **FR-028**: `dependency_error` outputs MUST include actionable fallback context-bundle requirements for no-direct-repository-access execution.
- **FR-029**: The system MUST enforce these default scope-governor hard caps unless explicitly overridden: max files touched `8`, max new files `4`, max moved/renamed files `0`, max new dependencies `0`, max new top-level folders `0`.

### Key Entities *(include if feature involves data)*

- **Implementation Execution Request**: The complete request package containing revised plan, architecture detection result, reuse decisions, and context needed for disciplined execution.
- **Revised Plan Action**: One planned file action with intended behavior, ownership layer, and expected change type.
- **Implementation Output Package**: The reviewable result set containing changed file list, patch content for updates, full content for new files, and validation notes.
- **Boundary Compliance Record**: Evidence that touched files and imports satisfy required dependency-direction and layer constraints.
- **Churn Deviation Record**: A structured note describing any out-of-plan touch or scope exception with its justification.
- **Convention Anchor**: The nearest relevant local pattern used as the baseline for naming, export, and structural consistency decisions.
- **Scope Expansion Request**: A bounded follow-up request detailing why additional scope is needed beyond default limits.
- **Validation Summary**: A structured verification record containing gate status, scope deviation status, and final output state for every result.
- **Output Result Variant**: One of `implementation_package`, `validation_error`, or `dependency_error`, each with strict payload constraints.

### Terminology

- **Plan Fidelity**: Executing implementation consistent with approved revised plan intent and scope.
- **Minimal Churn**: Avoiding unrelated changes that do not directly enable requested behavior.
- **Boundary Violation**: Any dependency or import relationship that conflicts with approved layer-direction rules.
- **Convention Matching**: Aligning new or updated artifacts with patterns already established in the nearest comparable area.
- **Discipline Guardrail**: A constraint that prevents architecture drift, overreach, or unstable implementation behavior.

### Assumptions

- `specs/005-skill-react-implementation-discipline/master_spec.md` remains the authoritative architecture and policy source for this initial phase.
- The first four specs provide upstream skill outputs and baseline governance needed by this skill.
- Repository read/search access is available for local pattern discovery and validation.
- The initial production skill scope remains fixed to the four execution skills plus shared baseline policy.
- Reviewers expect patch-oriented, low-churn implementation output as the default delivery mode.

### Dependencies

- Upstream outputs from architecture detection, placement/layering, and reuse decision workflows.
- Shared policy constraints and scope-governor defaults defined by `agent-policy-v1`.
- Repository structure and skill artifact conventions documented in `specs/005-skill-react-implementation-discipline/master_spec.md`.
- Skill intent and behavior baseline documented in `specs/005-skill-react-implementation-discipline/master_spec.md`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of successful runs, every changed file is either planned or documented as a justified minimal exception.
- **SC-002**: In 100% of accepted outputs, zero boundary violations are present in modified artifacts.
- **SC-003**: In at least 90% of reviewed tasks, reviewers approve implementation scope without requesting structural rework.
- **SC-004**: In at least 95% of tasks with only file updates, output is delivered as scoped patch content rather than full-file replacement.
- **SC-005**: In at least 90% of runs touching up to 8 files, complete implementation output is produced within 5 minutes.
- **SC-006**: In 100% of tasks where required inputs are invalid or incomplete, the system returns a structured validation response and no partial implementation package.
- **SC-007**: In at least 90% of sampled outputs, new or updated artifacts match local naming/export conventions on first review.
- **SC-008**: Reviewer-rated output clarity averages at least 4.0 out of 5.0 across at least 3 reviewers during acceptance review.
- **SC-009**: In 100% of outputs where scope limits are exceeded, expansion requests include concrete rationale and bounded follow-up impact.
- **SC-010**: In 100% of accepted outputs, no unrelated file churn (renames/reformats/speculative cleanup) is included.
- **SC-011**: In 100% of runs with failed mandatory quality checks, output is marked blocked and includes explicit failed checks plus required remediation actions.
- **SC-012**: In 100% of runs that include unapproved out-of-scope requests, output excludes those changes and includes explicit scope-expansion guidance.
- **SC-013**: In 100% of runs where required repository context is unavailable, output is a structured dependency error and no implementation output package is emitted.
- **SC-014**: In 100% of accepted outputs, no touched file exceeds 600 lines, and any file over 400 lines is split or extracted before acceptance.
- **SC-015**: In 100% of output packages, a structured validation summary is present and correctly reports check status, boundary results, scope deviations, and final state.
- **SC-016**: In 100% of `validation_error` and `dependency_error` outputs, no implementation output payload is present.
- **SC-017**: In 100% of `dependency_error` outputs, actionable fallback context-bundle requirements are included.
- **SC-018**: In 100% of runs where no explicit override is provided, scope-governor hard caps are enforced at `8/4/0/0/0` (files touched/new files/moves/dependencies/top-level folders).
