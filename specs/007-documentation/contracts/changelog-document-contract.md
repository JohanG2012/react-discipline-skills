# Changelog Document Contract

## Purpose

Define the normative, user-facing contract for `<REPO_ROOT>/CHANGELOG.md`.

## Scope

- **Producer**: Repository maintainers updating `<REPO_ROOT>/CHANGELOG.md`
- **Consumers**:
  - Repository visitors and contributors
  - Maintainers validating historical milestone completeness
  - Planning/review workflows that trace repository evolution

## Source of Truth

Contract artifacts for this feature:

- `<REPO_ROOT>/specs/007-documentation/spec.md`
- `<REPO_ROOT>/specs/007-documentation/plan.md`
- `<REPO_ROOT>/specs/007-documentation/data-model.md`
- `<REPO_ROOT>/specs/007-documentation/contracts/changelog-document-contract.md`

Repository sources used for coverage validation:

- `<REPO_ROOT>/specs/[number]-*/` (merged default-branch milestones)
- Default-branch commit history as supporting evidence for optional supplemental entries

## Top-Level Contract

`CHANGELOG.md` MUST:

1. Exist at repository root.
2. Describe completed milestones only when merged into default-branch history.
3. Include all merged pre-`007` feature/spec milestones discoverable from `specs/[number]-*`.
4. Include the four production skills as major entries:
   - `react-architecture-detection`
   - `react-placement-and-layering`
   - `react-reuse-update-new`
   - `react-implementation-discipline`
5. Label non-production/supporting pre-`007` milestones as context entries.
6. Keep each entry understandable (what changed + why it matters).
7. Avoid claims that conflict with merged default-branch history.

`CHANGELOG.md` MAY:

- Include supplemental minor entries derived from merged feature branch history, provided required milestone coverage is already satisfied.
- Use any readable grouping/ordering style (no single mandatory global scheme).

## Behavioral Guarantees

- Changelog completeness is auditable from repository artifacts.
- Major product milestones remain distinguishable from context/supporting milestones.
- Supplemental minor entries cannot replace required major/context milestone coverage.
- The document is readable to non-authors without needing raw commit-level investigation.

## Acceptance Mapping

- `FR-001`, `SC-001`: Root-level changelog presence.
- `FR-002`, `FR-008`, `FR-009`, `SC-004`: Required pre-`007` milestone coverage from default-branch `specs/` history.
- `FR-011`, `SC-006`: Required context labeling for non-production/supporting milestones.
- `FR-012`: Required major entries for four production skills.
- `FR-003`, `FR-004`, `FR-005`, `SC-002`: Readability and discoverability expectations.
- `FR-006`, `SC-003`, `SC-005`: Factual alignment with default-branch history, including optional supplemental entries.

## Implementation Reconciliation (2026-02-25)

- Changelog file exists at `<REPO_ROOT>/CHANGELOG.md`.
- Required pre-`007` milestones are represented with source references.
- Four production skills are present as `major` entries.
- Supporting/extension milestones are present as `context` entries.
- Coverage and conflict audit results are documented in `<REPO_ROOT>/specs/007-documentation/changelog-coverage-audit.md`.
