# Feature Specification: React Refactoring Progression Skill

**Feature Branch**: `006-skill-react-refactoring-progression`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "this is spec 006-skill-react-refactoring-progression everything you need to know you can find in master_spec.md. When unsure check how already existing skills have been implemented."

## Clarifications

### Session 2026-02-25

- Q: Which tier label model is canonical for this spec? → A: Tier A-D only.
- Q: How strict should output contract structure be? → A: Strict versioned envelope with mandatory fields.
- Q: What should happen when repository/discovery context is unavailable? → A: Return `dependency_error` and no refactor plan.
- Q: Which `validation_status` values are allowed? → A: `accepted`, `blocked`, `validation_error`, `dependency_error`.
- Q: What must `dependency_error` include for recovery? → A: Explicit fallback context-bundle requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Produce a Safe Refactor Plan (Priority: P1)

As a coding agent preparing implementation work, I need a deterministic, risk-ordered refactor plan so improvements happen safely without changing behavior.

**Why this priority**: The primary value of this skill is producing actionable refactor planning guidance with clear safety boundaries.

**Independent Test**: Provide a valid refactor request and verify the output returns a structured plan with ordered tiers, scoped file impact, risk labels, and clear step rationale.

**Acceptance Scenarios**:

1. **Given** a dedicated refactor request with valid context, **When** the skill runs, **Then** it returns one structured refactor plan with step ordering from lowest risk to highest risk.
2. **Given** a request where only low-risk improvements are needed, **When** planning completes, **Then** the plan includes only low-tier steps and no unnecessary escalation.
3. **Given** a request that lacks required context for planning, **When** the skill runs, **Then** it returns a structured error result and no partial plan.

---

### User Story 2 - Keep Refactoring Scope and Behavior Bounded (Priority: P2)

As a maintainer, I need refactor plans to preserve behavior and stay within explicit scope limits so quality improves without introducing delivery risk.

**Why this priority**: Unbounded refactor guidance creates churn and instability even when the intent is quality improvement.

**Independent Test**: Execute planning in both opportunistic and dedicated modes and verify all recommendations remain within mode-specific constraints and behavior-preservation rules.

**Acceptance Scenarios**:

1. **Given** an opportunistic planning request, **When** output is produced, **Then** all recommendations stay within the already-touched file set and avoid structural expansion.
2. **Given** a proposed step that could break behavioral invariants, **When** the plan is validated, **Then** that step is either excluded or marked as requiring explicit approval.
3. **Given** a request that would exceed scope caps for complete coverage, **When** planning completes, **Then** an in-cap plan is returned with bounded scope-expansion guidance.

---

### User Story 3 - Detect High-Value Refactor Opportunities (Priority: P3)

As a reviewer, I need anti-pattern and duplication findings to be surfaced with bounded recommendations so teams can improve architecture alignment progressively.

**Why this priority**: Sustainable quality gains require identifying repeated structural problems, not just one-off cleanup opportunities.

**Independent Test**: Run the skill on code with known anti-patterns and structural duplication and verify findings include tier assignment, extraction direction, risk/cost scoring, and recommended next steps.

**Acceptance Scenarios**:

1. **Given** shared UI responsibilities are mixed with domain behavior, **When** the skill evaluates anti-patterns, **Then** the plan recommends boundary-aligned refactor actions.
2. **Given** two or more implementations have equivalent responsibility, **When** duplication analysis runs, **Then** the output includes one extraction recommendation with explicit risk/cost metadata.
3. **Given** a high-risk, cross-architecture migration opportunity is detected in opportunistic mode, **When** planning completes, **Then** the recommendation is deferred as follow-up instead of blocking the main implementation flow.

### Edge Cases

- Opportunistic mode receives an empty touched-file set and has no eligible in-scope refactor actions.
- Only higher-tier structural opportunities exist, but lower-tier improvements are exhausted and migration scope is not enabled.
- A proposed recommendation improves structure but cannot guarantee behavior preservation under defined invariants.
- Folderization is required by size rules but would force a concern-home move.
- A dedicated refactor request would exceed default file-touch or new-file caps for meaningful completeness.
- A semantic-duplication candidate needs more than two extension points or introduces domain flags in shared abstractions.
- Divergence risk is high between candidate implementations that look structurally similar.
- Anti-pattern findings are detected at tiers that are out of mode scope (for example high-tier findings during opportunistic mode).
- Required upstream context from other skills is unavailable or contradictory.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define `react-refactoring-progression` as an optional extension skill and MUST NOT redefine the fixed four production execution skills.
- **FR-002**: The system MUST support two execution modes: `opportunistic` (default consult mode) and `dedicated` (explicit refactor session mode).
- **FR-003**: In opportunistic mode, the system MUST limit recommendations to files already touched by the primary implementation task.
- **FR-004**: In opportunistic mode, the system MUST NOT expand the touched-file set except narrowly scoped mandatory folderization within the same concern home.
- **FR-005**: In opportunistic mode, the system MUST forbid moves/renames, routing changes, new dependencies, and behavior-changing recommendations.
- **FR-006**: In dedicated mode, the system MUST allow multi-file planning within scope-governor limits and MUST require explicit migration scope for systemic changes.
- **FR-007**: The system MUST apply the refactor progression ladder in ascending risk order and escalate only when lower tiers are exhausted or blocked.
- **FR-007A**: The system MUST use `Tier A`, `Tier B`, `Tier C`, and `Tier D` as the canonical tier labels in all outputs and validation rules.
- **FR-008**: The system MUST enforce escalation governance that rejects aesthetic-only churn and requires explicit justification for every step.
- **FR-009**: Every recommended refactor step MUST include `why_now` and at least one justification category: `unblocks`, `reduces_future_cost`, or `standard_alignment`.
- **FR-010**: The system MUST treat behavior preservation as the default and enforce invariants covering external contracts, user-visible behavior, and navigation/state semantics.
- **FR-011**: When behavior-preserving guarantees cannot be met, the system MUST mark the step as non-preserving and require explicit approval or exclusion.
- **FR-012**: The system MUST apply default dedicated-mode scope caps of 8 touched files, 4 new files, 0 moves/renames, 0 new dependencies, and 0 new top-level folders unless explicitly overridden.
- **FR-013**: When materially better completeness exceeds default caps, the system MUST return bounded `scope_expansion_needed` guidance and still provide an in-cap plan.
- **FR-014**: In opportunistic mode, the system MUST cap plan steps at five highest-leverage actions by default.
- **FR-015**: In opportunistic mode, Tier C or Tier D findings MUST be surfaced as follow-up suggestions and MUST NOT block primary implementation completion.
- **FR-016**: The system MUST enforce file-size discipline: mandatory split/extraction above approximately 400 lines and conditional folderization allowance around 250-300 lines when responsibility reduction is clear.
- **FR-017**: The system MUST produce plan-only output and MUST NOT emit direct implementation patches.
- **FR-018**: The system MUST emit structured result variants `refactor_plan`, `validation_error`, or `dependency_error`.
- **FR-018A**: The system MUST use a strict, versioned output envelope with mandatory fields `schema_version`, `skill`, `version`, `result_type`, and `validation_status`, plus result-type-specific payload constraints.
- **FR-018B**: The system MUST restrict `validation_status` to `accepted`, `blocked`, `validation_error`, or `dependency_error`.
- **FR-019**: Successful plan output MUST include touch budget context, ordered steps, risk metadata, behavior-change expectation, and scope-expansion notes when relevant.
- **FR-020**: The system MUST integrate as a downstream consult to `react-implementation-discipline` by default for both micro and standard execution modes.
- **FR-021**: The system MUST NOT recompute architecture gravity, override placement decisions, or override reuse decisions from upstream skills.
- **FR-022**: The system MUST detect and plan responses for anti-patterns that hide responsibility ownership in shared presentational abstractions.
- **FR-023**: The system MUST detect and plan responses for boundary violations where data-access behavior is placed outside canonical ownership boundaries.
- **FR-024**: The system MUST detect and plan responses for domain leakage into shared abstractions and unjustified duplicate state ownership patterns.
- **FR-025**: The system MUST detect semantic duplication using responsibility equivalence plus at least one additional independent similarity signal.
- **FR-026**: For each semantic-duplication cluster, the system MUST provide exactly one extraction target recommendation and include abstraction cost, leakage risk, divergence risk, and refactor radius.
- **FR-027**: The system MUST include one concise `recommended_next_step` and variation-point summary for each semantic-duplication recommendation.
- **FR-028**: Dedicated mode MAY escalate to higher-tier placement or architecture convergence recommendations only when explicit migration mode is enabled.
- **FR-029**: The system MUST preserve scope discipline by excluding out-of-mode actions from active execution plans and representing them as follow-up guidance.
- **FR-030**: When required planning inputs are missing or inconsistent, the system MUST fail with structured validation/dependency output and MUST NOT emit partial refactor plans.
- **FR-031**: When repository or discovery context is unavailable, the system MUST fail closed with `dependency_error` and MUST NOT emit any `refactor_plan` payload.
- **FR-032**: Every `dependency_error` output MUST include actionable fallback context-bundle requirements that specify the minimum inputs required for a safe retry.

### Key Entities *(include if feature involves data)*

- **Refactor Planning Request**: Input package that defines mode, task context, and constraints for refactor recommendation generation.
- **Refactor Mode**: Execution context (`opportunistic` or `dedicated`) that determines allowed scope and escalation boundaries.
- **Refactor Step**: One ordered recommendation containing tier, files, change type, risk level, behavior expectation, and required rationale.
- **Behavior Preservation Record**: Validation record showing whether default invariants are preserved for each planned step.
- **Scope Budget**: Constraint profile defining touched-file, new-file, move, dependency, and folder limits for the plan.
- **Scope Expansion Need**: Structured follow-up item describing additional out-of-cap work with rationale and likely impact.
- **Anti-Pattern Finding**: Structured detection result describing a boundary or ownership drift issue and its remediation tier.
- **Semantic Duplication Cluster**: Group of structurally equivalent responsibilities with one extraction recommendation and risk/cost profile.
- **Refactor Plan Output**: Final structured output containing result type, ordered steps, budget status, and follow-up guidance.

### Terminology

- **Behavior-Preserving Refactor**: A recommendation that keeps external contracts and user-facing behavior equivalent.
- **Escalation Governor**: Rule set that controls when the plan can move from lower-risk to higher-risk tiers.
- **Tier Progression**: Ordered movement from local safety improvements toward broader structural convergence only when justified.
- **Refactor Radius**: Estimated breadth of file impact for one recommendation cluster (`local`, `medium`, `large`).
- **Standard Alignment**: Improvement that directly reduces drift from established architecture and implementation discipline.

### Assumptions

- Root `master_spec.md` is the authoritative source for this skill's scope, progression model, and locked decisions.
- `react-refactoring-progression` remains optional in v1 and does not change the fixed production skill set.
- Upstream architecture, placement, reuse, and implementation context is available when this skill is consulted.
- Reviewers expect behavior-preserving, scope-bounded refactor planning by default.
- When dedicated refactor migration scope is not explicitly enabled, systemic architecture migration remains out of scope.

### Dependencies

- Upstream context from `react-architecture-detection`, `react-placement-and-layering`, and `react-reuse-update-new`.
- Default consult integration point from `react-implementation-discipline`.
- Shared governance baseline from `agent-policy-v1`.
- Repository context needed for anti-pattern and semantic-duplication discovery.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of successful runs, output includes mode, ordered refactor steps, risk metadata, and budget context in one structured result.
- **SC-002**: In 100% of opportunistic runs, recommendations stay within the already-touched file set except explicitly allowed mandatory folderization cases.
- **SC-003**: In 100% of accepted plans, no recommendation violates declared behavior-preservation invariants without explicit approval marking.
- **SC-004**: In at least 90% of sampled dedicated refactor tasks, reviewers accept step ordering and scope without requesting re-planning.
- **SC-005**: In at least 90% of opportunistic consult runs, the plan produces no more than five actionable recommendations within 2 minutes.
- **SC-006**: In 100% of runs where desired completeness exceeds caps, output includes bounded scope-expansion guidance plus an in-cap plan.
- **SC-007**: In 100% of outputs, no direct implementation patches are included.
- **SC-008**: In 100% of escalated recommendations, justification records explicitly state why lower tiers were insufficient.
- **SC-009**: In 100% of semantic-duplication recommendations, cost/risk scoring and one clear next step are present.
- **SC-010**: Reviewer-rated clarity for refactor plans averages at least 4.0 out of 5.0 across at least 3 reviewers.
- **SC-011**: In 100% of opportunistic runs with higher-tier findings, those findings are surfaced as non-blocking follow-up guidance only.
- **SC-012**: In 100% of runs with missing critical context, output is a structured validation/dependency error and no partial plan is emitted.
- **SC-013**: In 100% of outputs, the strict versioned envelope is present and includes all mandatory envelope fields with valid result-type payload shape.
- **SC-014**: In 100% of runs where repository/discovery context is unavailable, output is `dependency_error` and no `refactor_plan` payload is emitted.
- **SC-015**: In 100% of outputs, `validation_status` is one of `accepted`, `blocked`, `validation_error`, or `dependency_error`.
- **SC-016**: In 100% of `dependency_error` outputs, actionable fallback context-bundle requirements are present.
