# Phase 0 Research: Shared Agent Policy Baseline

## Context

Research consolidated from the approved feature specification, clarification decisions, and repository governance documents to remove planning ambiguity before design.

## Decision 1: Shared baseline coverage applies to four downstream production skills

- **Decision**: Treat all four downstream skill specs as production-scoped for this initiative and enforce one shared baseline across all four.
- **Rationale**: This was explicitly clarified and accepted during `/speckit.clarify`; leaving mixed production scope in documentation would create contradictory policy enforcement.
- **Alternatives considered**:
  - Keep three production skills only: rejected because it conflicts with accepted clarification and `FR-014`.
  - Opt-in baseline per skill: rejected because it weakens consistency guarantees.

## Decision 2: Exception governance is explicit, maintainer-approved, and non-expiring

- **Decision**: Downstream conflicts with shared policy require a repo-maintainer-approved exception record with rationale; exceptions do not carry expiry and remain valid until revoked or superseded by a newer shared policy version.
- **Rationale**: This matches accepted clarifications, minimizes ambiguity in approval authority, and creates deterministic review behavior.
- **Alternatives considered**:
  - Calendar-based expiry: rejected because the team explicitly chose no expiry.
  - Dual approval (policy owner + skill owner): rejected because "policy owner" is not currently defined in baseline docs.
  - Open approval by any skill owner: rejected due to weaker governance controls.

## Decision 3: `pre_approved_collisions` is a single-source shared-header field

- **Decision**: Define `pre_approved_collisions` only in the shared baseline header; keep it empty by default in this version.
- **Rationale**: Single-source placement prevents duplicate policy authorities and aligns with the clarified override-collision strategy.
- **Alternatives considered**:
  - Per-skill collision lists: rejected because they create diverging policy sources.
  - Duplicate shared + per-skill lists: rejected because reconciliation overhead and drift risk are high.

## Decision 4: Document precedence remains strict and deterministic

- **Decision**: `SPEC.md` remains the authoritative source; supporting policy documents fill open gaps only when non-conflicting.
- **Rationale**: Preserves deterministic decision ordering and prevents ad hoc rule reinterpretation across downstream specs.
- **Alternatives considered**:
  - Equal precedence between spec and policy docs: rejected due to conflict ambiguity.
  - Policy-first precedence: rejected because it contradicts accepted feature scope.

## Decision 5: Validation and implementation approach uses existing repository tooling

- **Decision**: Use existing validation pipeline (`npm run check`) and current repository structure; do not add dependencies or new top-level folders.
- **Rationale**: Satisfies constitution constraints for minimal scope and deterministic validation.
- **Alternatives considered**:
  - Add new governance tooling for this feature: rejected because it expands scope and dependency surface unnecessarily.
  - Manual-only validation: rejected because it weakens repeatability.

## Research Completion Status

All planning ambiguities from Technical Context are resolved. No `NEEDS CLARIFICATION` items remain.
