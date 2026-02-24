# Feature Specification: React Reuse vs Update vs New Skill

**Feature Branch**: `004-skill-react-reuse-update-new`  
**Created**: 2026-02-23  
**Status**: Completed  
**Input**: User description: "This is spec 004-skill-react-reuse-update-new. This is spec 4 out of 5 for the initial phase of the project. The first 5 specs are described in the master spec specs/004-skill-react-reuse-update-new/master_spec.md read it. In this spec specifically we will be working on the react reuse update new skill if the master spec leaves open questions you can also read specs/004-skill-react-reuse-update-new/master_spec.md for additional structure details"

## Clarifications

### Session 2026-02-23

- Q: What default thresholds should define a safe `update` decision? → A: Max 2 new generic props, no new domain mode flags in composites, and max 1 generic flag in primitives.
- Q: How should candidate ties be resolved when scores are equal? → A: Use deterministic tie-break order: authoritative upstream home, then lower coupling risk, then lower divergence risk, then lower complexity cost, then lexical path order.
- Q: How should the system behave when constraints block all safe options? → A: Return a structured `decision_blocked` result and require explicit human override before proceeding.
- Q: What should happen when repository discovery/search evidence is unavailable? → A: Fail closed with a structured dependency error and emit no decision package.
- Q: How should artifact identity be tracked across evaluation and output? → A: Require a stable `needed_artifact_id` preserved from input through final decision output.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Make Deterministic Reuse Decisions (Priority: P1)

As a planner preparing implementation work, I need each required artifact to be classified as reuse, update, or new so implementation avoids unnecessary churn and duplication.

**Why this priority**: This is the core value of the skill. If this decision is weak, downstream implementation quality, speed, and consistency degrade immediately.

**Independent Test**: Provide one placement plan with multiple required artifacts and verify the output returns one explicit decision per artifact, a concrete target, and concise rationale.

**Acceptance Scenarios**:

1. **Given** a placement plan and repository context with clear existing candidates, **When** the skill evaluates artifacts, **Then** it selects reuse or small updates where fit is strong.
2. **Given** a required artifact with no suitable candidate, **When** evaluation completes, **Then** the skill marks that artifact as new and explains why reuse and update were rejected.
3. **Given** an artifact that could match multiple candidates, **When** the skill scores fit, complexity, coupling, and divergence, **Then** it applies deterministic tie-break rules and returns one final decision and one chosen target.

---

### User Story 2 - Prevent Leaky Generalization (Priority: P2)

As a reviewer, I need reuse decisions to enforce anti-leakage guardrails so shared UI assets are not overloaded with domain-specific behavior.

**Why this priority**: Improper generalization causes long-term maintenance cost and cross-domain coupling even when short-term delivery appears faster.

**Independent Test**: Evaluate decisions for a mixed-domain request and verify outputs reject domain-specific mode flags in shared UI abstractions and prefer domain-owned sections where needed.

**Acceptance Scenarios**:

1. **Given** a candidate shared UI artifact that would require domain-specific mode flags, **When** decisioning runs, **Then** the skill rejects that update path and chooses a safer alternative.
2. **Given** two domains that share similar section behavior but different roadmap pressure, **When** decisions are finalized, **Then** the skill favors domain-local sections over a forced cross-domain section abstraction.
3. **Given** a proposed update that adds small generic extension points without domain leakage, **When** the decision is scored, **Then** update may be selected with bounded change rationale.

---

### User Story 3 - Produce Downstream-Ready Decision Output (Priority: P3)

As a downstream skill consumer, I need a revised plan and guardrails that can be applied directly so implementation can proceed without reinterpreting reuse intent.

**Why this priority**: Decision outputs are only useful if they are actionable and consistent for the next stage.

**Independent Test**: Run the skill on one realistic planning input and verify the revised plan can be consumed directly, with no missing decision fields or contradictory artifacts.

**Acceptance Scenarios**:

1. **Given** a valid planning input, **When** the skill returns output, **Then** each artifact decision includes `needed_artifact_id`, decision type, chosen target, and concise reasoning.
2. **Given** multiple artifact decisions in one run, **When** reviewers inspect the output, **Then** guardrails are explicit and consistent with all decisions.
3. **Given** missing required upstream input, **When** the skill is invoked, **Then** it returns a structured validation error and no partial decision package.
4. **Given** repository discovery/search is unavailable or incomplete, **When** the skill is invoked, **Then** it returns a structured dependency error and no decision package.

### Edge Cases

- Required input is incomplete (for example missing detection context or missing placement artifacts).
- No repository candidates are found for one or more required artifacts.
- Repository discovery/search is unavailable or returns incomplete evidence needed for candidate evaluation.
- Repository access is unavailable and fallback context bundle is incomplete.
- Multiple candidates have similar fit but materially different coupling or divergence risk.
- A candidate update would require domain-mode flags in shared UI artifacts.
- A candidate appears reusable but would require more than minor extensions, creating over-generalization risk.
- Different artifacts in the same run would otherwise create contradictory decisions for one concern owner.
- Input constraints block all safe reuse/update/new options for one or more artifacts.
- Desired completeness would exceed scope caps and requires explicit expansion signaling.
- Artifact names or target paths change during planning; decision traceability must remain stable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define `react_reuse_update_new` as one of the four production execution skills in initial project scope.
- **FR-002**: The system MUST require valid upstream context from architecture detection, placement planning, and repository search before evaluating decisions.
- **FR-003**: The system MUST evaluate each needed artifact using a deterministic ladder in this order: reuse as-is, update existing, then create new.
- **FR-004**: The system MUST emit exactly one final decision (`reuse`, `update`, `new`, or `decision_blocked`) for every needed artifact in scope.
- **FR-005**: The system MUST record a concrete target for each decision, or explicitly record that no suitable target exists.
- **FR-006**: The system MUST evaluate candidates against scored dimensions: fit, complexity cost, coupling risk, divergence risk, and locality benefit.
- **FR-022**: When two or more candidates have equal score outcomes, the system MUST resolve ties in this order: candidate in authoritative upstream home, lower coupling risk, lower divergence risk, lower complexity cost, then lexical path order.
- **FR-023**: When explicit constraints block all safe decision paths for an artifact, the system MUST return `decision_blocked` for that artifact and MUST require explicit human override before any non-compliant decision is accepted.
- **FR-024**: When repository discovery/search evidence is unavailable or incomplete, the system MUST fail closed with a structured dependency error and MUST NOT emit any decision package.
- **FR-025**: The system MUST require a stable `needed_artifact_id` for each needed artifact and MUST preserve that same identifier from input, through scoring, to final decision output.
- **FR-007**: The system MUST permit update decisions only when required changes stay within safe thresholds: at most 2 new generic props, no new domain mode flags in shared composites, and no more than 1 new generic behavior flag in primitives.
- **FR-008**: The system MUST reject shared-UI updates that introduce domain mode flags or domain naming into generic abstractions.
- **FR-009**: The system MUST prefer domain-owned sections over cross-domain section generalization when divergence risk is high.
- **FR-010**: The system MUST allow creation of new artifacts when reuse/update would create high coupling, high divergence, or abstraction leakage.
- **FR-011**: The system MUST include concise reasoning for every artifact decision, including why higher-priority ladder options were not chosen.
- **FR-012**: The system MUST return a revised plan preserving artifact intent while replacing tentative actions with finalized decisions.
- **FR-013**: The system MUST output guardrails that make anti-leakage and anti-overgeneralization rules explicit for downstream work.
- **FR-014**: The system MUST keep decision scope bounded to planning guidance and MUST NOT perform direct code implementation or file operations.
- **FR-015**: The system MUST return a structured validation error and MUST NOT return partial decisions when required inputs are invalid.
- **FR-016**: The system MUST preserve alignment with the authoritative architecture and placement decisions already established upstream for the same task.
- **FR-017**: The system MUST prevent contradictory final decisions for the same artifact need within a single run.
- **FR-018**: The system MUST support configurable reuse thresholds and apply documented defaults when overrides are not provided.
- **FR-021**: The system MUST use these default reuse thresholds unless explicitly overridden: `max_new_props_for_update=2`, `max_flags_allowed_composites=0` for domain modes, `max_generic_flags_allowed_primitives=1`, and `max_abstraction_risk_score=6`.
- **FR-026**: The system MUST include explicit per-artifact `decision_mark` values aligned to final decision type (`reuse as-is`, `updated`, `new`, `decision_blocked`).
- **FR-027**: For dependency failures, the system MUST include structured fallback context-bundle requirements and MUST NOT emit a decision package.
- **FR-028**: When scope-cap expansion is needed for material completeness, the system MUST include bounded `scope_expansion_needed` entries and still emit an in-cap minimal decision package.
- **FR-029**: The revised decision plan MUST include structured context decisions, file actions, and layer justifications for downstream consumption.
- **FR-030**: If scope expansion is requested, the revised decision plan MUST include a short follow-up scope list.
- **FR-019**: The system MUST keep all decisions traceable to repository evidence or explicit "not found" outcomes.
- **FR-020**: The system MUST inherit shared governance constraints from `agent-policy-v1` without defining conflicting mandatory rules.

### Key Entities *(include if feature involves data)*

- **Reuse Evaluation Request**: The input package containing upstream context and the list of needed artifacts to evaluate.
- **Needed Artifact**: One planned capability requiring a final reuse, update, new, or blocked decision, identified by a stable `needed_artifact_id`.
- **Candidate Match**: A discovered existing artifact considered as a potential reuse or update target.
- **Decision Record**: The finalized decision, decision mark, selected target, discovery evidence state, score profile, and concise rationale for one needed artifact.
- **Threshold Profile**: Configurable limits that bound what qualifies as safe update vs new creation, with defaults of 2 new generic props per update, 0 domain mode flags in composites, 1 generic behavior flag in primitives, and abstraction-risk cap 6.
- **Revised Plan**: The downstream-ready artifact plan after all reuse decisions are finalized, including context decisions, file actions, layer justifications, and optional follow-up scope.
- **Guardrail Set**: Explicit constraints that prevent domain leakage and over-generalized abstractions in later implementation steps.

### Terminology

- **Reuse Ladder**: The strict decision order of reuse, then update, then new.
- **Domain Leakage**: Introduction of domain-specific behavior into shared generic artifacts.
- **Divergence Risk**: The likelihood that two currently similar use cases will need to evolve differently.
- **Coupling Risk**: The chance that a decision creates avoidable dependencies between unrelated concerns.
- **Decision Traceability**: The ability to show evidence for each final decision outcome.
- **Artifact Identity**: The stable `needed_artifact_id` used to track one artifact across evaluation and output.

### Assumptions

- `specs/004-skill-react-reuse-update-new/master_spec.md` remains the authoritative source for project architecture rules and scope boundaries.
- `specs/004-skill-react-reuse-update-new/master_spec.md` defines the detailed intent and guardrails for this skill.
- Upstream skills provide valid architecture-detection and placement-planning outputs before this skill runs.
- The four-skill production scope remains fixed for the initial phase.
- Repository read/search capability is available for candidate discovery.
- Shared baseline policy (`agent-policy-v1`) applies to this skill as a mandatory governance layer.

### Dependencies

- Reliable upstream outputs from architecture detection and placement planning.
- Repository artifacts and naming conventions remain accessible for discovery and comparison.
- Shared policy constraints remain active and unchanged during this feature phase.
- Project structure guidance in `specs/004-skill-react-reuse-update-new/master_spec.md` remains available for skill artifact organization.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of decision runs, every needed artifact receives one and only one final decision.
- **SC-002**: In a review sample of at least 20 planning tasks, at least 90% of decisions are accepted without reclassification.
- **SC-003**: In at least 90% of tasks where suitable existing candidates exist, at least one artifact is resolved through reuse or update rather than unnecessary creation.
- **SC-004**: In 100% of approved decision outputs, zero shared-UI decisions introduce domain mode flags or domain-specific naming.
- **SC-005**: In at least 95% of runs with complete inputs, downstream implementation planning proceeds without requiring manual reinterpretation of reuse decisions.
- **SC-006**: In 100% of runs with invalid required inputs, output is a validation error and no partial decision package is emitted.
- **SC-007**: For planning tasks with up to 30 needed artifacts, decision output is produced within 2 minutes in at least 90% of acceptance runs.
- **SC-008**: Reviewer-rated decision clarity averages at least 4.0 out of 5.0 across at least 3 reviewers before broader rollout.
- **SC-009**: In 100% of approved update decisions, threshold compliance is explicit and no update exceeds the configured or default limits.
- **SC-010**: In 100% of equal-score candidate cases, final target selection follows the documented deterministic tie-break order.
- **SC-011**: In 100% of constraint-conflict cases where no safe option exists, output includes a structured `decision_blocked` result and no non-compliant decision is finalized without explicit override.
- **SC-012**: In 100% of runs where repository discovery/search evidence is unavailable or incomplete, output is a structured dependency error and no decision package is emitted.
- **SC-013**: In 100% of successful decision outputs, every decision record includes a stable `needed_artifact_id` that matches the source input artifact identity.
- **SC-014**: In 100% of successful decision outputs, every decision record includes a valid `decision_mark` consistent with the final decision type.
- **SC-015**: In 100% of dependency-error outputs, fallback context-bundle requirements are included and are actionable.
- **SC-016**: In 100% of outputs containing scope expansion requests, each request includes concrete `why` and `would_touch` values and a concise follow-up scope list.
