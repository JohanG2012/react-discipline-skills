# Phase 0 Research: Root Changelog

## Context

Research consolidated from:

- `<REPO_ROOT>/specs/007-documentation/spec.md`
- `<REPO_ROOT>/.specify/memory/constitution.md`
- Existing completed milestones under `<REPO_ROOT>/specs/001-*` through `<REPO_ROOT>/specs/006-*`

Goal: finalize changelog coverage rules, source-of-truth selection, classification model, and validation approach before implementation tasks.

## Research Task Queue Executed

- Research canonical source of truth for "completed" repository milestones.
- Research best practices for documentation change history in skill/policy repositories.
- Research major vs context milestone classification for fixed-scope product lines.
- Research validation strategy for changelog accuracy without introducing new tooling dependencies.
- Research contract format for a documentation-facing interface.
- Research integration touchpoints between changelog content and existing repository governance constraints.

## Decision 1: Use default-branch merged history as the completion boundary

- **Decision**: A change is considered completed only if it is merged into default-branch history.
- **Rationale**: This keeps changelog claims objective, reproducible, and auditable from one canonical repository timeline.
- **Alternatives considered**:
  - Include non-merged branch work: rejected because it risks publishing unfinished or superseded work.
  - Include open/ready PR scope: rejected because readiness does not guarantee final merged content.

## Decision 2: Use merged `specs/[number]-*` directories as the mandatory milestone source

- **Decision**: Mandatory milestone coverage is determined from merged `specs/[number]-*` directories with identifiers lower than `007`.
- **Rationale**: Milestone specs are already the repository’s normalized feature history and map directly to planning artifacts.
- **Alternatives considered**:
  - Use branch names as canonical source: rejected because naming can be noisy and less stable than merged spec artifacts.
  - Use maintainer memory/manual list only: rejected due to drift and verification risk.

## Decision 3: Classify entries as Major vs Context based on product scope

- **Decision**: Include all merged pre-`007` milestones; label non-production/supporting milestones as context entries, while the four production skills remain major entries.
- **Rationale**: This preserves complete historical context while keeping product-critical milestones prominent.
- **Alternatives considered**:
  - Exclude supporting milestones: rejected because it creates historical gaps.
  - Treat all milestones as equal: rejected because it blurs product-critical vs support context.

## Decision 4: Keep entry ordering/grouping flexible, but require readability

- **Decision**: Do not enforce one global ordering/grouping scheme; require a readable presentation and explicit context labeling where relevant.
- **Rationale**: This matches clarified scope while preserving maintainers’ flexibility for future changelog evolution.
- **Alternatives considered**:
  - Strict single timeline order only: rejected because user clarified no strict ordering requirement.
  - Strict dual-section layout only: rejected because it over-constrains format without additional functional value.

## Decision 5: Use repository-native validation, not new automation dependencies

- **Decision**: Validate changelog completeness via review against default-branch `specs/` history and run existing repository checks (`npm run check`).
- **Rationale**: Meets constitution constraints for minimal dependency and deterministic workflow.
- **Alternatives considered**:
  - Add new changelog parsing/validation package: rejected due to unnecessary dependency expansion.
  - Skip validation beyond manual read: rejected because it weakens factual reliability guarantees.

## Decision 6: Provide a documentation contract in Markdown

- **Decision**: Define the changelog interface in `<REPO_ROOT>/specs/007-documentation/contracts/changelog-document-contract.md`.
- **Rationale**: This feature’s interface is human-readable documentation; a markdown contract is sufficient and consistent with repository planning artifacts.
- **Alternatives considered**:
  - JSON schema only: rejected because markdown readability is primary for this interface.
  - No explicit contract: rejected because it weakens acceptance consistency.

## Research Completion Status

All planning unknowns and decision points for this feature are resolved. No `NEEDS CLARIFICATION` items remain.
