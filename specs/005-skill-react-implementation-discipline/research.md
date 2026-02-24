# Phase 0 Research: React Implementation Discipline Skill

## Context

Research consolidated from `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/spec.md`,
`<REPO_ROOT>/SPEC.md`,
`<REPO_ROOT>/4_REACT_IMPLEMENTATION_DISCIPLINE.md`,
`<REPO_ROOT>/PROJECT_STRUCTURE.md`,
and current `react_implementation_discipline` skill artifacts to finalize
execution, output, and validation behavior before implementation tasks.

## Research Task Queue Executed

- Research output-contract patterns for implementation-phase skills with blocked and error states.
- Research best practices for representing mandatory quality-gate failures without losing reviewer visibility.
- Research fail-closed dependency behavior when repository context is unavailable.
- Research bounded handling of out-of-scope requests under scope-governor rules.
- Research measurable file-size discipline thresholds for implementation safety.
- Research structured validation summary fields that support review and automation.
- Research schema and contract synchronization practices using existing repository tooling.

## Decision 1: Use explicit result types with a stable validation summary

- **Decision**: Use three result types: `implementation_package`, `validation_error`, and `dependency_error`, with a mandatory `validation_summary` in every output.
- **Rationale**: Explicit result typing prevents ambiguous downstream parsing and keeps failure handling deterministic.
- **Alternatives considered**:
  - Single generic output envelope: rejected due to weak state semantics.
  - Free-text status fields only: rejected due to parser and reviewer inconsistency.

## Decision 2: Keep quality-gate failures visible but blocked

- **Decision**: On mandatory quality-check failure, return an `implementation_package` marked `blocked`, including failed checks and required fixes.
- **Rationale**: Reviewers retain full visibility into proposed changes while governance remains strict.
- **Alternatives considered**:
  - Hard fail with no package: rejected because it reduces remediation visibility.
  - Warn-only and continue accepted: rejected due to policy risk.

## Decision 3: Fail closed when repository context is missing

- **Decision**: Emit `dependency_error` and no implementation package when context needed for convention matching or boundary validation is unavailable.
- **Rationale**: Low-confidence implementation output would violate the discipline mandate and increase rework risk.
- **Alternatives considered**:
  - Best-effort implementation with warnings: rejected due to unsafe defaults.
  - Default to generic patterns: rejected because local conventions are mandatory.

## Decision 4: Treat unapproved out-of-scope work as excluded

- **Decision**: Exclude unapproved out-of-scope asks (migration, dependency additions, unrelated cleanup, policy/spec edits) and represent them through bounded scope-expansion guidance.
- **Rationale**: Preserves minimal-churn and scope-governor compliance while still capturing follow-up needs.
- **Alternatives considered**:
  - Include low-risk out-of-scope work opportunistically: rejected due to drift risk.
  - Immediate hard failure: rejected because bounded guidance is more actionable.

## Decision 5: Enforce explicit file-size discipline thresholds

- **Decision**: Keep layer soft caps, require split/extraction above 400 lines, and hard-stop above 600 lines.
- **Rationale**: Numeric thresholds make reviews and automation testable and consistent.
- **Alternatives considered**:
  - Qualitative-only size guidance: rejected as non-testable.
  - One hard stop only: rejected because it misses early-drift prevention.

## Decision 6: Require structured validation summary content in all outputs

- **Decision**: `validation_summary` must include quality-check status, boundary status, scope-deviation status, stage, errors, and final state.
- **Rationale**: Centralizes verification signals for both humans and downstream automation.
- **Alternatives considered**:
  - Summary only for failed runs: rejected because accepted runs also need verifiable signals.
  - Full verbose trace logs by default: rejected as unnecessary noise.

## Decision 7: Prefer patch-first output for updates and full content for new files

- **Decision**: Keep update outputs patch-oriented and include full content only for new files.
- **Rationale**: Preserves reviewability while maintaining deterministic apply behavior.
- **Alternatives considered**:
  - Always full-file output: rejected due to churn and review overhead.
  - Patch-only even for new files: rejected because complete artifact creation is needed.

## Decision 8: Preserve existing validation tooling and dependency baseline

- **Decision**: Use current validation workflow (`npm run check`) and existing schema/example checks; add no new dependencies.
- **Rationale**: Aligns with constitution principles on minimal scope and deterministic validation.
- **Alternatives considered**:
  - Add new contract tooling: rejected as unnecessary for this feature.
  - Manual validation only: rejected due to repeatability loss.

## Decision 9: Keep contract and schema as dual source artifacts

- **Decision**: Maintain both a human-readable contract document and a machine-readable schema under `specs/.../contracts/`, and align skill schema/example files to them.
- **Rationale**: Supports both stakeholder review and automated validation.
- **Alternatives considered**:
  - Schema only: rejected because business/readability context would be weaker.
  - Markdown only: rejected because machine validation would be incomplete.

## Decision 10: Keep scope within existing four-skill product boundary

- **Decision**: Limit this feature to `react_implementation_discipline` behavior and related artifacts; no new production skills.
- **Rationale**: Constitution requires fixed four-skill scope for this phase.
- **Alternatives considered**:
  - Add adjunct execution skill for validation reporting: rejected as out of scope.
  - Expand shared policy in this feature: rejected because policy amendment is separate governance work.

## Research Completion Status

All planning unknowns and high-impact ambiguities for this feature are resolved.
No unresolved `NEEDS CLARIFICATION` items remain.
