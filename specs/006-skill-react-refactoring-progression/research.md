# Phase 0 Research: React Refactoring Progression Skill

## Context

Research consolidated from:

- `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/spec.md`
- `<REPO_ROOT>/master_spec.md`
- `<REPO_ROOT>/.specify/memory/constitution.md`
- Completed feature precedents under `<REPO_ROOT>/specs/002-*` through `005-*`

Goal: finalize output/interface behavior, mode scope constraints, and validation rules before implementation tasks.

## Research Task Queue Executed

- Research canonical tier model choice for deterministic planning outputs.
- Research strict output-envelope patterns across existing repository skills.
- Research fail-closed behavior for missing repository/discovery context.
- Research fallback context-bundle requirements for dependency error recovery.
- Research opportunistic vs dedicated mode boundary best practices.
- Research semantic-duplication detection guardrails and scoring signals.
- Research behavior-preservation enforcement patterns for refactor-only skills.
- Research scope-governor cap representation for downstream automation.
- Research contract format conventions (human-readable contract + JSON schema).
- Research integration model with `react-implementation-discipline` as default consult consumer.

## Decision 1: Use `Tier A-D` as the only canonical progression labels

- **Decision**: Standardize all plan outputs and validation rules on `Tier A`, `Tier B`, `Tier C`, and `Tier D`.
- **Rationale**: A single tier vocabulary avoids ambiguous mapping logic and keeps downstream assertions deterministic.
- **Alternatives considered**:
  - Keep `Tier 0-4`: rejected because master spec finalized mode sections around `A-D` progression language.
  - Keep both models permanently: rejected due to parser/test complexity and drift risk.

## Decision 2: Require a strict versioned output envelope

- **Decision**: Make `schema_version`, `skill`, `version`, `result_type`, and `validation_status` mandatory in every output.
- **Rationale**: Strict envelopes align with existing contracts and support stable machine validation.
- **Alternatives considered**:
  - Optional envelope fields: rejected due to weaker contract reliability.
  - Narrative-only output: rejected because downstream consumers require deterministic parsing.

## Decision 3: Lock result variants to `refactor_plan`, `validation_error`, `dependency_error`

- **Decision**: Restrict output result variants to those three states.
- **Rationale**: Fixed variants map directly to success, input invalidity, and missing dependency context.
- **Alternatives considered**:
  - Add additional ad-hoc result types: rejected to avoid uncontrolled state expansion.
  - Collapse all failures into one generic error: rejected due to reduced remediation clarity.

## Decision 4: Fail closed when repository/discovery context is unavailable

- **Decision**: Emit `dependency_error` and never emit a partial `refactor_plan` when required context is missing.
- **Rationale**: Best-effort refactor planning without context risks unsafe or misaligned recommendations.
- **Alternatives considered**:
  - Produce low-confidence plans with warnings: rejected due to correctness and governance risk.
  - Pause indefinitely without structured output: rejected due to poor automation ergonomics.

## Decision 5: Require actionable fallback context-bundle requirements in `dependency_error`

- **Decision**: Every `dependency_error` includes explicit minimum context inputs required for safe retry.
- **Rationale**: Dependency failures must be recoverable without guesswork.
- **Alternatives considered**:
  - Message-only dependency errors: rejected because operators cannot reliably resolve missing inputs.
  - Optional recovery hints: rejected due to inconsistent recovery behavior.

## Decision 6: Use closed `validation_status` values

- **Decision**: Allow only `accepted`, `blocked`, `validation_error`, and `dependency_error`.
- **Rationale**: Closed enum values avoid semantic drift and simplify validation/testing.
- **Alternatives considered**:
  - Free-form status text: rejected due to non-deterministic interpretation.
  - Binary status only (`ok`/`error`): rejected because blocked-success and dependency/input failures must remain distinct.

## Decision 7: Keep behavior-preservation as default with explicit non-preserving escalation

- **Decision**: Default all refactor steps to behavior-preserving; require explicit approval marker for non-preserving recommendations.
- **Rationale**: The skill exists to improve quality without breaking behavior unless intentionally approved.
- **Alternatives considered**:
  - Allow implicit behavior change in higher tiers: rejected due to regression risk.
  - Ban non-preserving changes entirely: rejected because explicit migration mode still needs a governed path.

## Decision 8: Preserve mode-specific scope boundaries

- **Decision**: Opportunistic mode remains bounded to already-touched files (with narrow folderization exception), while dedicated mode uses scope caps and optional expansion guidance.
- **Rationale**: This keeps auto-consult behavior low-risk and dedicated sessions tractable.
- **Alternatives considered**:
  - Let opportunistic mode expand scope freely: rejected due to hidden churn.
  - Force dedicated mode to same strict bounds: rejected because it would under-deliver explicit refactor requests.

## Decision 9: Enforce semantic-duplication guardrails with scored recommendations

- **Decision**: Require two-signal qualification and include abstraction cost, leakage risk, divergence risk, and radius per cluster.
- **Rationale**: Prevents over-abstraction and keeps recommendations explainable.
- **Alternatives considered**:
  - Simple similarity-only detection: rejected due to high false-positive/unsafe extraction risk.
  - Unscored recommendations: rejected because prioritization becomes subjective.

## Decision 10: Keep contract artifacts dual-format (Markdown + JSON Schema)

- **Decision**: Publish both a human-readable contract and a machine-readable schema in `contracts/`.
- **Rationale**: Mirrors repository precedent and supports both reviewer comprehension and automated enforcement.
- **Alternatives considered**:
  - Schema only: rejected because rationale and governance context would be implicit.
  - Markdown only: rejected because strict machine validation would be weak.

## Research Completion Status

All high-impact planning unknowns are resolved. No `NEEDS CLARIFICATION` items remain for this feature.
