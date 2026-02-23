# Phase 0 Research: React Placement and Layering Skill

## Context

Research consolidated from `<REPO_ROOT>/specs/003-skill-react-placement-layering/spec.md`,
`<REPO_ROOT>/SPEC.md`,
`<REPO_ROOT>/2_REACT_PLACEMENT_AND_LAYERING.md`,
and current skill artifacts to finalize contract and planning decisions before implementation.

## Research Task Queue Executed

- Research strict output-contract shape for placement planning outputs.
- Research fail-fast behavior for missing/invalid required inputs.
- Research conflict precedence between architecture detection and repository evidence.
- Research confidence-threshold policy for source-of-truth override.
- Research safe-output handling for snippet/secret-like content.
- Research validation approach using existing repository tooling.

## Decision 1: Use a strict, versioned placement output contract

- **Decision**: Placement outputs use a strict versioned contract with deterministic required fields for valid planning runs, including `strategy_used`, `feature_owner`, `canonical_endpoint_layer`, `authoritative_home_map`, `artifacts`, `layer_justifications`, `decision_explanation`, `import_guardrails`, `source_of_truth_resolutions`, `notes`, and `validation_status`, plus schema/version metadata.
- **Rationale**: Downstream planning and implementation steps require stable parsing and deterministic field availability.
- **Alternatives considered**:
  - Flexible ad hoc JSON output: rejected due to integration drift and weak testability.
  - Semi-structured contract with optional guardrails/notes: rejected because required governance details could be omitted.

## Decision 2: Fail fast on missing/invalid required inputs with structured validation error

- **Decision**: When required inputs are missing/invalid, return a structured validation-error output and do not emit a placement plan.
- **Rationale**: Producing plans from incomplete inputs creates incorrect placement decisions and high rework risk.
- **Alternatives considered**:
  - Best-effort planning with defaults: rejected because it weakens correctness guarantees.
  - Partial plan with placeholders: rejected because it conflicts with fail-fast expectation.

## Decision 3: Source-of-truth precedence is deterministic with pause-resolved confidence override

- **Decision**: For architecture/repository conflicts, architecture-detection output is the default source; for structural conflicts below `0.7`, repository placement evidence is selected after explicit pause resolution and is recorded as `resolution_mode=pause_resolved`.
- **Rationale**: This keeps planning consistent with upstream detection while still protecting against low-confidence misclassification.
- **Alternatives considered**:
  - Always trust architecture output: rejected because it fails low-confidence recovery.
  - Always trust repository evidence: rejected because it discards upstream strategy intent.
  - Manual reviewer judgment without threshold: rejected due to nondeterministic behavior.

## Decision 6: Move-enabled planning remains tightly bounded

- **Decision**: Move/rename planning is optional and constrained; when present, moves require explicit metadata (`old_path`, `new_path`, `import_update_targets`, `move_concern`) and are limited to three operations or fewer in a single run.
- **Rationale**: This preserves migration safety and keeps scope aligned with shared policy limits.
- **Alternatives considered**:
  - Unbounded move planning in feature scope: rejected due to migration churn risk.
  - Move metadata as optional prose notes: rejected because downstream validation would be non-deterministic.

## Decision 4: Keep placement outputs structural and privacy-safe

- **Decision**: Placement output never includes raw source snippets or secret-like values; only structural metadata and path references are allowed.
- **Rationale**: Prevents content leakage while preserving all planning-relevant information.
- **Alternatives considered**:
  - Allow snippets on demand: rejected for this phase to keep output deterministic and safe.
  - No restrictions: rejected due to unnecessary privacy/security risk.

## Decision 5: Use existing validation pipeline and repository constraints

- **Decision**: Use existing repository checks (`npm run check`) and skill schema/example consistency updates; add no dependencies and no top-level directories.
- **Rationale**: Aligns with constitution requirements for deterministic validation and minimal scope/dependency changes.
- **Alternatives considered**:
  - Introduce new tooling for contract checks: rejected as unnecessary scope expansion.
  - Manual-only validation: rejected because repeatability would regress.

## Research Completion Status

All planning unknowns for this feature are resolved. No `NEEDS CLARIFICATION` items remain.
