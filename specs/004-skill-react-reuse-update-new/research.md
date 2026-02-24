# Phase 0 Research: React Reuse vs Update vs New Skill

## Context

Research consolidated from `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/spec.md`,
`<REPO_ROOT>/SPEC.md`,
`<REPO_ROOT>/3_REACT_REUSE_VS_UPDATE_VS_NEW.md`,
and current `react_reuse_update_new` skill artifacts to finalize deterministic
decision and contract behavior before implementation tasks.

## Research Task Queue Executed

- Research default safe-update thresholds and their governance impact.
- Research deterministic tie-break behavior for equal-score candidates.
- Research constraint-conflict handling when no safe decision path exists.
- Research dependency failure handling for missing/incomplete discovery evidence.
- Research artifact identity continuity across input, scoring, and output.
- Research strict output-contract shape for downstream consumption and validation.
- Research validation approach using existing repository tooling without new dependencies.

## Decision 1: Enforce explicit default safe-update thresholds

- **Decision**: Use defaults `max_new_props_for_update=2`,
  `max_flags_allowed_composites=0` for domain modes, and
  `max_generic_flags_allowed_primitives=1`; allow explicit override only through
  input configuration.
- **Rationale**: Numeric defaults convert subjective "small update" language into
  testable acceptance criteria and reduce reviewer variance.
- **Alternatives considered**:
  - Looser defaults (up to 4 props or mode flags in composites): rejected due to
    over-generalization risk.
  - No numeric defaults: rejected because decisions become inconsistent.

## Decision 2: Use deterministic tie-break ordering for equal-score candidates

- **Decision**: Resolve candidate ties in this order:
  1) authoritative upstream home, 2) lower coupling risk, 3) lower divergence
  risk, 4) lower complexity cost, 5) lexical path order.
- **Rationale**: Deterministic tie-breaks keep outputs reproducible and avoid ad
  hoc reviewer-dependent decisions.
- **Alternatives considered**:
  - Manual reviewer selection for ties: rejected due to non-determinism.
  - Always pause for clarification on ties: rejected as unnecessary flow friction.

## Decision 3: Return `decision_blocked` when constraints remove all safe options

- **Decision**: Emit a structured per-artifact `decision_blocked` outcome and
  require explicit human override before any non-compliant path can be accepted.
- **Rationale**: Failing safely preserves architecture constraints while still
  providing actionable blocked-state visibility.
- **Alternatives considered**:
  - Auto-override one threshold and continue: rejected because it can hide
    architectural drift.
  - Force `new` decision automatically: rejected because it may violate explicit
    constraints and policy intent.

## Decision 4: Fail closed when discovery evidence is unavailable

- **Decision**: When repository discovery/search evidence is unavailable or
  incomplete, return a structured dependency error and emit no decision package.
- **Rationale**: Reuse/update/new decisions depend on repository evidence; guessing
  without discovery introduces high rework risk.
- **Alternatives considered**:
  - Continue with low-confidence placeholders: rejected because downstream
    consumers may treat placeholders as valid decisions.
  - Default all affected artifacts to `new`: rejected as biased and potentially
    incorrect.

## Decision 5: Require stable artifact identity across the decision pipeline

- **Decision**: Require `needed_artifact_id` for each artifact and preserve the
  same ID from request through scoring and final output.
- **Rationale**: Stable IDs preserve traceability even if names/paths shift during
  planning refinement.
- **Alternatives considered**:
  - Use path-based identity only: rejected because paths may change during
    evaluation.
  - Use list position identity: rejected because ordering changes can break traceability.

## Decision 6: Use strict versioned output contract with explicit result types

- **Decision**: Define strict versioned outputs for:
  - successful decision package (`result_type=decision_plan`)
  - input validation failure (`result_type=validation_error`)
  - discovery dependency failure (`result_type=dependency_error`)
  and include deterministic required fields for each.
- **Rationale**: Downstream skills need stable parsing and explicit state handling
  for success vs blocked/error outcomes.
- **Alternatives considered**:
  - Flexible output shape with optional fields: rejected due to contract drift.
  - Single generic error type: rejected because dependency failures and
    validation failures require different remediation.

## Decision 7: Keep validation and build integration on existing repo toolchain

- **Decision**: Use current repository validation workflow (`npm run check`) and
  existing schema/example validation flow; add no new dependencies or top-level
  directories.
- **Rationale**: Aligns with constitution rules on minimal scope and deterministic
  validation.
- **Alternatives considered**:
  - Introduce new contract tooling dependencies: rejected as unnecessary for this
    phase.
  - Manual validation only: rejected due to repeatability loss.

## Decision 8: Require explicit decision marks for downstream clarity

- **Decision**: Add `decision_mark` per artifact (`reuse as-is`, `updated`,
  `new`, `decision_blocked`) and enforce consistency with final decision type.
- **Rationale**: Downstream reviewers and automation can consume concise
  decision-intent labels without re-deriving intent from free text.
- **Alternatives considered**:
  - Infer marks from `decision` at consumption time: rejected due to avoidable
    consumer coupling.
  - Keep marks optional: rejected because optional semantics drift over time.

## Decision 9: Extend revised plan structure for implementation readiness

- **Decision**: Require structured `context_decisions`, `file_actions`, and
  `layer_justifications`, with optional `move_actions`.
- **Rationale**: Mirrors SPEC-required planning output and keeps downstream
  implementation planning deterministic and auditable.
- **Alternatives considered**:
  - Keep only free-text notes: rejected due to inconsistent downstream parsing.
  - Keep plan structure in separate sidecar docs: rejected as brittle.

## Decision 10: Make abstraction risk threshold explicit and mandatory

- **Decision**: Require `max_abstraction_risk_score` in applied thresholds and
  default it to `6`.
- **Rationale**: Prevents partial threshold payloads and keeps update-vs-new
  reasoning measurable.
- **Alternatives considered**:
  - Keep abstraction threshold optional: rejected due to ambiguous evaluation.
  - Hard-code risk cap with no output field: rejected due to poor traceability.

## Decision 11: Add explicit fallback context-bundle requirements on dependency errors

- **Decision**: `dependency_error` outputs must include
  `fallback_context_bundle_requirements[]` describing required no-access inputs.
- **Rationale**: Converts no-repo-access scenarios into actionable remediation
  instead of generic failure output.
- **Alternatives considered**:
  - Single generic retry note: rejected as insufficiently actionable.
  - Inline long prose guidance: rejected for parser instability.

## Decision 12: Add scope-governor expansion signaling

- **Decision**: Support optional `scope_expansion_needed[]` with bounded
  (`why`, `would_touch`) entries and require short `follow_up_scope[]` when
  expansion is requested, while still returning in-cap output.
- **Rationale**: Aligns with scope-governor rules and preserves delivery
  momentum under hard caps.
- **Alternatives considered**:
  - Fail immediately when caps are exceeded: rejected due to avoidable stalls.
  - Expand scope silently: rejected due to review-risk and governance drift.

## Research Completion Status

All planning unknowns for this feature are resolved. No unresolved
clarification items remain in planning artifacts.
