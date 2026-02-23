# Phase 0 Research: React Architecture Detection Skill

## Context

Research consolidated from `<REPO_ROOT>/specs/002-skill-react-architecture-detection/spec.md`, `<REPO_ROOT>/SPEC.md`, and current skill artifacts to resolve technical-context unknowns and confirm contract decisions before design.

## Research Task Queue Executed

- Research performance-goal handling for this feature phase.
- Research contract versioning best practice for machine-consumable skill outputs.
- Research ambiguity handling for low-confidence architecture classification.
- Research privacy-safe output conventions for repository analysis skills.
- Research validation path using existing repository tooling.

## Decision 1: Performance goals are intentionally deferred in this phase

- **Decision**: Do not define explicit runtime/throughput targets in this feature phase; treat performance baselines as deferred and focus this phase on contract correctness and ambiguity controls.
- **Rationale**: The feature clarification explicitly selected deferral of runtime/scale targets, and this scope is contract/design-focused rather than benchmark-focused.
- **Alternatives considered**:
  - Define `95% <= 60s` for up to 10k files: rejected because phase clarification explicitly declined hard targets now.
  - Define a looser interim benchmark: rejected for same reason and to avoid pseudo-target drift.

## Decision 2: Add mandatory output schema versioning

- **Decision**: Require every architecture-detection output to include a mandatory `schema_version` field.
- **Rationale**: Schema-version tagging enables safe downstream parsing and controlled evolution across planning and implementation skills.
- **Alternatives considered**:
  - Optional versioning only on shape change: rejected because it allows silent incompatibilities.
  - No schema versioning: rejected due to higher integration risk.

## Decision 3: Low-confidence concern homes resolve to `unknown` with required pause

- **Decision**: When a structural concern has confidence below `0.7`, set concern home to `unknown` and require a clarification pause before downstream planning continues.
- **Rationale**: This prevents incorrect structural assumptions from propagating into placement and implementation plans.
- **Alternatives considered**:
  - Force best-guess home below threshold: rejected due to misclassification risk.
  - Omit unresolved concern from output: rejected because downstream consumers need explicit unresolved state.

## Decision 4: Output remains structural metadata only by default

- **Decision**: Standard output includes structural metadata and notes only; no raw code snippets are emitted by default.
- **Rationale**: Metadata-only output reduces leakage risk while preserving all information needed for downstream architectural decisions.
- **Alternatives considered**:
  - Allow contextual snippets for ambiguity: rejected for default mode to keep outputs privacy-safe and deterministic.
  - Allow unrestricted excerpts: rejected due to unnecessary exposure and noisy contracts.

## Decision 5: Use existing validation pipeline and repository constraints

- **Decision**: Validate feature outcomes with existing checks (`npm run check`) and skill artifact consistency updates, without adding dependencies or top-level structure.
- **Rationale**: Constitution requires deterministic validation and minimal dependency/structure churn.
- **Alternatives considered**:
  - Add new validation tooling for this feature: rejected as out-of-scope expansion.
  - Manual-only verification: rejected because repeatability would regress.

## Research Completion Status

All Technical Context unknowns are resolved by explicit decisions in this document.
