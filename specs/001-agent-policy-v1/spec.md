# Feature Specification: Shared Agent Policy Baseline

**Feature Branch**: `001-agent-policy-v1`  
**Created**: 2026-02-23  
**Status**: Completed  
**Input**: User description: "this is spec 001-agent-policy-v1. Its the first out of 5 specs. During those 5 specs we will build 4 codex agent skills and shared policies/rules for those 4 agents. This is the spec where we focus on the shared rules/policies. Im saying this because you will have to read the file specs/001-agent-policy-v1/master_spec.md this is the master spec that covers everyhing for the initial phase of the project including the other 4 specs (that are not relevant right now). Project structure guidance is included in specs/001-agent-policy-v1/master_spec.md. the master spec is the source of truth but if it leaves open questions than answers for those might be found in specs/001-agent-policy-v1/master_spec.md"

## Clarifications

### Session 2026-02-23

- Q: How should downstream rule conflicts with the shared policy baseline be handled? → A: Downstream specs may override shared rules only through an explicitly approved, documented exception with rationale; pre-approved collision override slots are reserved for future use but remain empty in this version.
- Q: What is the shared-baseline coverage scope across downstream skills? → A: The shared baseline applies to all four downstream skills, and all four are treated as production skills; documentation that still states otherwise must be updated.
- Q: Who can approve shared-policy exception requests? → A: Repo maintainers only.
- Q: Where must the pre-approved collision field live? → A: It must exist only in the shared baseline header as the single source of truth.
- Q: Do shared-policy exceptions expire? → A: No; approved exceptions have no expiry and remain active until explicitly revoked or superseded by a newer shared policy version.
- Q: How should shared baseline rule coverage be organized in policy files? → A: Shared rule coverage must be explicit and modularized in numbered rule files, with rule IDs mapped in `skills/.shared/policy/SKILL.md` and mirrored by compliance checks in contract and quickstart artifacts.
- Q: Which additional shared-rule areas from `specs/001-agent-policy-v1/master_spec.md` must be explicitly represented in baseline modules? → A: Planning/reuse workflow, migration strategy, fallback defaults, implementation defaults, layer contracts, access/write control, and file-size guidance must be included as explicit numbered shared-rule modules.
- Q: After final precaution review, which remaining shared rules still required explicit modules? → A: Architecture-detection output/bootstrap contract and enforcement heuristics were added as dedicated numbered modules and included in shared baseline coverage checks.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Define One Shared Policy Baseline (Priority: P1)

As the initiative owner, I need one shared policy baseline so all skill specifications in this 5-spec program follow the same architecture, decision, and governance rules.

**Why this priority**: Without a shared baseline, all downstream skill specs can diverge and create contradictory rules before implementation begins.

**Independent Test**: Review the shared policy spec alone and verify it fully defines constraints, defaults, escalation rules, and versioning without relying on downstream skill documents.

**Acceptance Scenarios**:

1. **Given** the program includes one shared-policy spec and four skill-focused specs, **When** a maintainer reads this shared-policy spec, **Then** they can identify one authoritative baseline that all skill-focused specs must inherit.
2. **Given** all four downstream skills are production, **When** policy applicability is reviewed, **Then** the same shared baseline is enforced uniformly across all four.
3. **Given** a rule conflict appears between the master spec and supporting policy material, **When** conflict resolution is performed, **Then** the master spec is treated as authoritative and supporting policy is used only to resolve open details.
4. **Given** a policy reviewer evaluates the baseline, **When** they check for governance controls, **Then** they find explicit rules for scope limits, deterministic defaults, and pause/escalation behavior.

---

### User Story 2 - Apply Baseline Consistently in Skill Specs (Priority: P2)

As a skill spec author, I need clear shared rules so I can produce a skill-specific spec that is consistent with program-wide boundaries and does not redefine core policy.

**Why this priority**: Consistent inheritance across specs reduces rework, review friction, and downstream execution errors.

**Independent Test**: Draft one downstream skill spec using only this shared baseline plus the skill-specific objective and confirm no contradictory mandatory rules are introduced.

**Acceptance Scenarios**:

1. **Given** a skill author is drafting a downstream spec, **When** they apply shared guidance for ownership boundaries and allowed interactions, **Then** the draft remains consistent with the shared baseline.
2. **Given** a skill author encounters an ambiguous decision with low confidence and high structural impact, **When** they follow the shared baseline, **Then** they pause and present bounded options with a recommended default.

---

### User Story 3 - Govern Policy Changes Safely (Priority: P3)

As a reviewer, I need clear policy evolution rules so updates to shared guidance stay explicit, auditable, and safe for all dependent specs.

**Why this priority**: Policy drift without explicit version control can silently invalidate assumptions across all downstream work.

**Independent Test**: Propose a policy change and verify that the baseline requires an explicit version increment and documented rationale before acceptance.

**Acceptance Scenarios**:

1. **Given** a contributor proposes a change to shared policy, **When** the change is reviewed, **Then** it is rejected unless the policy version and change rationale are explicitly updated.
2. **Given** a downstream spec introduces a mandatory rule that conflicts with shared policy, **When** governance review runs, **Then** the conflict is rejected unless a repo maintainer approves an exception record that includes rationale and no expiry requirement.
3. **Given** pre-approved collision override slots exist but are empty, **When** a downstream spec attempts automatic override use, **Then** the override is rejected and must follow the explicit exception path.
4. **Given** a downstream skill spec adds its own pre-approved collision list, **When** policy conformance is reviewed, **Then** the list is rejected because only the shared baseline header may define pre-approved collisions.
5. **Given** an approved exception omits expiry metadata, **When** policy conformance is reviewed, **Then** the exception remains valid until explicitly revoked or superseded by shared policy version change.

### Edge Cases

- A downstream skill spec attempts to create a second "home" for the same concern and claims local exception.
- A planning task exceeds shared scope limits (files, new artifacts, moves, or dependencies) without explicit expansion approval.
- A decision is ambiguous but high impact, and the author tries to proceed without pausing for confirmation.
- Shared policy and supporting documents offer different defaults for the same scenario.
- A policy change is proposed as a minor wording adjustment but materially changes constraints without a version increment.
- A downstream spec claims a "common collision" automatic override while the pre-approved collision list is empty.
- Legacy documentation still labels only a subset of downstream skills as production, causing inconsistent policy application.
- A non-maintainer attempts to approve a shared-policy exception.
- A downstream skill defines a separate pre-approved collision list, causing duplicate policy sources.
- A reviewer incorrectly rejects an approved exception because it has no expiry metadata.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define a single shared policy baseline named `agent-policy-v1` for this initiative's skill work.
- **FR-002**: The shared baseline MUST define document precedence so the master spec remains authoritative and supporting policy resolves only open questions.
- **FR-003**: The shared baseline MUST define mandatory architectural boundaries and prohibited cross-layer interactions for all downstream skill guidance.
- **FR-004**: The shared baseline MUST define deterministic defaults for non-structural ambiguity and a pause protocol for structural-impact ambiguity.
- **FR-005**: The shared baseline MUST define scope-governor limits and required handling when planned work exceeds those limits.
- **FR-006**: The shared baseline MUST define output consistency rules for planning guidance and implementation guidance.
- **FR-007**: The shared baseline MUST define naming and ownership conventions for route orchestration, feature ownership, reusable UI, data access, shared utilities, and configuration.
- **FR-008**: The shared baseline MUST define required completion checks covering boundary compliance, data-access placement, minimum churn, and applicable validation gates.
- **FR-009**: Any change to shared policy rules MUST require an explicit version increment and a documented reason for the change.
- **FR-010**: Every downstream skill spec in this program MUST reference the shared baseline and MUST NOT introduce conflicting mandatory rules unless a repo maintainer approves an explicit exception that is documented with rationale.
- **FR-011**: The shared baseline MUST explicitly define its non-goals to prevent policy from expanding into implementation prescriptions.
- **FR-012**: The shared baseline MUST include representative disallowed-pattern examples so reviewers can apply rules consistently.
- **FR-013**: The shared baseline MUST reserve a dedicated `pre_approved_collisions` field in the shared baseline header as the only allowed source for pre-approved collision categories, and that field MUST be empty by default in this version.
- **FR-014**: The shared baseline MUST apply uniformly to all four downstream production skill specs, and any conflicting production-scope documentation MUST be updated to this definition.
- **FR-015**: Approved shared-policy exceptions MUST have no expiry field and remain active until explicitly revoked by a repo maintainer or superseded by a newer shared policy version.

### Key Entities *(include if feature involves data)*

- **Shared Policy Baseline**: The single authoritative ruleset used by all skill-focused specs in the initiative.
- **Skill Spec**: A skill-focused specification that inherits shared rules and adds only skill-specific intent.
- **Policy Rule**: A mandatory or default instruction with clear applicability and expected behavior.
- **Pause Decision**: A recorded escalation point containing ambiguity, options, and recommended default.
- **Scope Governor**: The set of bounded limits and expansion protocol controlling change size.
- **Policy Version Record**: The explicit version identifier and rationale log for policy changes.

### Terminology

- **Downstream Production Skill Specs**: The four production skill specs governed by this shared baseline (`react_architecture_detection`, `react_placement_and_layering`, `react_reuse_update_new`, `react_implementation_discipline`).
- **Exception Record**: A maintainer-approved policy conflict allowance with rationale and no expiry metadata.

### Assumptions

- This feature covers shared policy governance only; skill-specific behaviors are defined in separate specs.
- The initiative sequence is one shared-policy spec plus four skill-focused specs, and those skill-focused specs must consume this baseline.
- All four downstream skills in this initiative are treated as production skills for policy coverage and validation.
- The master spec remains the primary authority; supporting policy material is used only for unresolved details that do not conflict with the master spec.

### Dependencies

- The master specification content remains available and stable enough to serve as authoritative scope input.
- The project structure definition remains available for shared placement and ownership terminology.
- Downstream skill specs adopt this baseline before finalization so consistency checks can be applied program-wide.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the four downstream production skill specs explicitly reference the shared baseline and contain zero unresolved conflicts against shared mandatory rules at review sign-off.
- **SC-002**: In a review sample of at least 15 ambiguous planning decisions across the program, at least 90% are resolved directly by shared deterministic defaults without additional stakeholder clarification.
- **SC-003**: 100% of high-impact ambiguous decisions include an explicit pause decision record before execution begins.
- **SC-004**: 100% of accepted shared-policy changes include an explicit version increment and documented rationale.
- **SC-005**: During pilot execution of downstream specs, unapproved scope-limit breaches occur in no more than 5% of reviewed tasks.
- **SC-006**: Shared-policy clarity is rated at least 4.0/5.0 on average by at least 3 reviewers before planning starts for the next phase.
