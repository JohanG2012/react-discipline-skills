# Feature Specification: React Placement and Layering Skill

**Feature Branch**: `003-skill-react-placement-layering`  
**Created**: 2026-02-23  
**Status**: Completed  
**Input**: User description: "This is spec 003-skill-react-placement-and-layering. This is spec 3 out of 5 for the initial phase of the project. The first 5 specs are described in the master spec specs/003-skill-react-placement-layering/master_spec.md read it. In this spec specifically we will be working on the react placement and layering detection skill if the master spec leaves open questions you can also read specs/003-skill-react-placement-layering/master_spec.md for additional structure details"

## Clarifications

### Session 2026-02-23

- Q: Should placement output use a strict, versioned contract or allow flexible shape? → A: Require a strict, versioned output contract with mandatory fields for strategy, owner, artifacts, guardrails, notes, and validation status.
- Q: What should happen when required inputs are missing or invalid? → A: Fail fast with a structured validation error and produce no placement plan until required inputs are valid.
- Q: When architecture-detection output conflicts with current repository evidence, which source should win? → A: Architecture output wins by default; for structural conflicts below `0.7`, repository evidence is selected after explicit pause resolution and recorded with `pause_resolved`.
- Q: Should placement output include raw source snippets or secret-like values? → A: Never include raw source snippets or secret-like values; include structural metadata and references only.
- Q: What threshold defines low architecture confidence for source-of-truth override? → A: Use `0.7`; below `0.7` with structural impact, repository evidence requires `pause_resolved` resolution metadata before override.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Produce a Placement Plan (Priority: P1)

As a skill user preparing implementation work, I need a concrete file-touch plan and layer assignment so changes can be made in the right locations on the first pass.

**Why this priority**: This is the core value of the skill; without an actionable placement plan, downstream implementation quality and speed drop immediately.

**Independent Test**: Provide one implementation request with architecture detection output and verify the skill returns one complete placement plan with clear actions for each planned artifact.

**Acceptance Scenarios**:

1. **Given** an implementation request, target architecture rules, and a detection result, **When** the skill runs, **Then** it returns one structured placement plan with strategy, feature owner, canonical endpoint layer, authoritative-home map, artifacts, layer justifications, and decision explanation.
2. **Given** a plan with multiple artifacts, **When** reviewers inspect each artifact entry, **Then** each entry includes purpose, action (reuse/update/create), action rationale, layer, and path.
3. **Given** a bounded change request, **When** the plan is generated, **Then** the plan can be executed without introducing duplicate homes for the same concern.
4. **Given** any required input is missing or invalid, **When** the skill is invoked, **Then** it returns a structured validation error and no placement plan.

---

### User Story 2 - Enforce Layer Guardrails (Priority: P2)

As a reviewer, I need placement decisions to enforce boundary guardrails so teams avoid cross-layer coupling and policy violations.

**Why this priority**: Correct placement without boundary enforcement still leads to architecture erosion and rework.

**Independent Test**: Evaluate the plan against defined guardrails and verify disallowed cross-layer dependencies are prevented before implementation starts.

**Acceptance Scenarios**:

1. **Given** planned artifacts across UI, feature, and data-access layers, **When** guardrails are evaluated, **Then** disallowed dependency directions are flagged and removed from the plan.
2. **Given** a route-level artifact, **When** placement is finalized, **Then** direct backend calls are not assigned to the route layer.
3. **Given** conflicting potential homes for one concern, **When** final placement is chosen, **Then** only one authoritative home is selected for the task.
4. **Given** architecture-detection output conflicts with repository evidence for a structural concern, **When** architecture confidence is below `0.7`, **Then** repository evidence is used only after pause resolution and recorded as `resolution_mode=pause_resolved`.

---

### User Story 3 - Prefer Reuse Before New Artifacts (Priority: P3)

As a skill user, I need the plan to favor existing artifacts when suitable so implementation stays small and consistent with repository gravity.

**Why this priority**: Reuse and minimal churn reduce risk and preserve long-term maintainability, but this is secondary to producing a valid initial plan.

**Independent Test**: Run the skill on a repository with existing relevant artifacts and verify the plan marks clear reuse/update actions instead of unnecessary new files.

**Acceptance Scenarios**:

1. **Given** existing artifacts that satisfy part of the request, **When** the plan is generated, **Then** those artifacts are marked as reuse or update with rationale in notes.
2. **Given** no suitable existing artifact for a required concern, **When** the plan is generated, **Then** a new artifact is proposed in the correct layer.
3. **Given** high ambiguity about where to place an artifact, **When** planning completes, **Then** the output records the safest minimal choice and highlights ambiguity for follow-up.

### Edge Cases

- Detection output indicates mixed architecture with no clear authoritative home for one or more concerns.
- Required inputs are incomplete or invalid (for example missing detection result or missing target architecture rules); the run returns a structured validation error and no placement plan.
- Existing structure and preferred target structure conflict for the same concern in the same task.
- Architecture-detection output conflicts with repository evidence for a structural concern; default to architecture output unless confidence is below `0.7` and pause resolution explicitly approves repository evidence.
- A request attempts to include raw source snippets or secret-like values in placement output.
- Constraint settings forbid new folders while all candidate homes would require new folders.
- The request spans multiple domains and could lead to split ownership if not forced to one primary owner.
- The repository already has duplicate homes for the same concern and the request touches both.
- Move-enabled planning proposes more than three file moves/renames in one run.
- Move-enabled planning attempts to move files across multiple concerns in one run.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define `react_placement_and_layering` as one of the four production execution skills in the initial scope.
- **FR-002**: The system MUST require three core inputs for each run: implementation request, target architecture rules, and architecture-detection result.
- **FR-003**: The system MUST interpret the implementation request into a checklist of concrete needs before planning artifacts.
- **FR-004**: The system MUST select exactly one primary feature owner for the request.
- **FR-005**: The system MUST choose exactly one placement strategy from `follow-existing`, `introduce-boundaries`, or `migrate-as-you-touch` using detection guidance.
- **FR-006**: The system MUST generate one structured placement plan containing selected strategy, feature owner, canonical endpoint layer, authoritative-home map, artifact list, layer justifications, decision explanation, guardrail list, source-of-truth resolutions, concise notes, and validation status.
- **FR-007**: Each planned artifact MUST include purpose, action (`reuse`, `update`, or `create`), action rationale, assigned layer, target path, and dependencies when relevant.
- **FR-008**: The system MUST classify artifacts into a single authoritative layer and MUST prevent one responsibility from being split across multiple layers.
- **FR-009**: The system MUST enforce guardrails that prevent disallowed dependency directions between layers before finalizing the plan, including `lib/**` importing React.
- **FR-010**: The system MUST check for existing routes, sections, reusable UI artifacts, data-access artifacts, shared state artifacts, and naming/export patterns before proposing new artifacts.
- **FR-011**: The system MUST prefer reuse when a suitable artifact already exists, choose update when a small extension is sufficient, and create new artifacts only when reuse/update is not suitable.
- **FR-012**: The system MUST avoid duplicate architecture outcomes by selecting one authoritative home per concern for the task.
- **FR-013**: The system MUST respect explicit constraints, including whether new folders are allowed, limits on planned file touches, and move/rename scope limits when move mode is enabled.
- **FR-014**: The system MUST inherit shared baseline rules from `agent-policy-v1` and MUST NOT define conflicting mandatory rules.
- **FR-015**: When architecture detection indicates unresolved high-impact structural ambiguity, the system MUST preserve that ambiguity status and block final placement recommendations until clarification is resolved.
- **FR-016**: The system MUST limit scope to placement planning and MUST NOT perform full implementation, broad refactors, or convention redefinition.
- **FR-017**: The system MUST produce output that is machine-consumable by downstream planning and implementation workflows.
- **FR-018**: The system MUST emit placement output using a strict, versioned contract and MUST include all mandatory fields for every run.
- **FR-019**: The system MUST reject incomplete output objects that omit mandatory fields.
- **FR-020**: The system MUST validate all required inputs before planning begins and MUST fail fast when inputs are missing or invalid.
- **FR-021**: When required inputs are missing or invalid, the system MUST return a structured validation error and MUST NOT emit a placement plan or partial plan.
- **FR-022**: When architecture-detection output conflicts with current repository evidence, the system MUST use architecture output as the default source of truth for the affected concern.
- **FR-023**: When architecture confidence is below `0.7` for a structural conflicting concern, the system MUST require explicit pause resolution and then prioritize repository placement evidence for that concern.
- **FR-024**: The system MUST exclude raw source snippets and secret-like values from placement output and MUST emit only structural metadata and references.
- **FR-025**: The system MUST require `source_of_truth_resolutions` entries to include resolution mode and MUST use `pause_resolved` when repository evidence is selected for structural conflicts.
- **FR-026**: The system MUST include an authoritative-home map for active concerns in successful placement-plan output.
- **FR-027**: If move/rename operations are present, the system MUST include move metadata (`old_path`, `new_path`, `import_update_targets`, and `move_concern`) and MUST cap move operations to three or fewer per run.
- **FR-028**: If no path alias is already configured, the system MUST keep relative imports and MUST NOT introduce alias configuration unless explicitly requested.

### Key Entities *(include if feature involves data)*

- **Placement Request**: The incoming change description and optional constraints for planning.
- **Detection Result**: Upstream architecture context containing concern homes, strategy signals, and ambiguity state.
- **Placement Strategy Decision**: The selected approach governing whether to follow existing structure, introduce boundaries, or migrate touched areas.
- **Planned Artifact**: One planned file touch with purpose, action type, layer, target path, and dependencies.
- **Guardrail Set**: The boundary rules that are checked before plan finalization.
- **Placement Plan Output**: The complete structured result used by downstream skills.
- **Placement Output Contract**: The strict, versioned schema that defines required output fields and validation expectations.
- **Authoritative Home Map**: Per-run map of concern homes used consistently across placement decisions.
- **Layer Justification**: Concise rationale for each touched layer.
- **Decision Explanation**: Structured summary of detected architecture signals and chosen direction.
- **Move Operation**: Explicit move/rename metadata with import-update targets in move-enabled scope.

### Terminology

- **Authoritative Home**: The one location treated as correct for a concern in the current task.
- **Placement Guardrail**: A boundary rule that blocks disallowed dependency direction or concern leakage.
- **Duplicate Architecture Outcome**: A task result that treats more than one home as simultaneously correct for the same concern.
- **Low Architecture Confidence**: A confidence value below `0.7` for a conflicting concern.
- **Pause-resolved Override**: A source-of-truth override that is applied only after explicit pause confirmation for structural conflicts.

### Assumptions

- The master specification (`specs/003-skill-react-placement-layering/master_spec.md`) remains the authoritative source for architecture rules and production-skill scope.
- `specs/003-skill-react-placement-layering/master_spec.md` defines detailed behavior for this skill when additional precision is needed.
- The input explicitly targets the placement-and-layering skill scope based on the spec identifier and referenced detail document.
- Architecture detection runs before placement planning and provides required upstream context.
- Shared baseline policy (`agent-policy-v1`) is active for all four production execution skills.
- Structural source-of-truth overrides below `0.7` require explicit pause resolution metadata.

### Dependencies

- Valid architecture-detection output is available for each placement-planning run.
- Shared policy constraints from `agent-policy-v1` are available and enforced.
- Project structure conventions from `specs/003-skill-react-placement-layering/master_spec.md` remain available for artifact organization.
- Downstream skills consume placement-plan outputs without redefining layer ownership for the same task.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of placement-planning runs, output includes strategy selection, feature owner, canonical endpoint layer, authoritative-home map, artifact list, layer justifications, decision explanation, guardrails, and notes in one structured result.
- **SC-002**: In a review sample of at least 20 planning tasks, at least 90% of artifact placement decisions are accepted without reclassification.
- **SC-003**: In 100% of planned artifacts, action type (`reuse`, `update`, or `create`), action rationale, and assigned layer are explicitly stated.
- **SC-004**: During pilot usage, duplicate-home corrections after review occur in no more than 5% of planning tasks.
- **SC-005**: In at least 90% of tasks with reusable artifacts present, the plan selects reuse or update for at least one relevant artifact rather than unnecessary creation.
- **SC-006**: Reviewer-rated clarity of placement plans averages at least 4.0 out of 5.0 across at least 3 reviewers before moving to broader rollout.
- **SC-007**: In 100% of placement-planning runs, output conforms to the strict versioned contract with no missing mandatory fields.
- **SC-008**: In 100% of runs with missing or invalid required inputs, the system returns a structured validation error and emits no placement plan.
- **SC-009**: In 100% of runs with architecture/repository mismatch, source-of-truth precedence is applied consistently: architecture output by default, and repository evidence only with `pause_resolved` metadata for structural conflicts below `0.7`.
- **SC-010**: In 100% of placement outputs, no raw source snippets or secret-like values are present.
- **SC-011**: In 100% of move-enabled runs, move operations are three or fewer and include `move_concern` plus explicit import-update targets.
