# Quickstart: Root Changelog

## Goal

Implement and validate `<REPO_ROOT>/CHANGELOG.md` so it accurately summarizes completed repository milestones up to pre-`007` scope, with major/context distinction and no factual conflicts against default-branch history.

## Prerequisites

- Working branch: `007-documentation`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Requirement Trace Map

- `FR-001`, `SC-001`: Add root-level `CHANGELOG.md`.
- `FR-002`, `FR-008`, `FR-009`, `SC-004`: Include all required merged pre-`007` milestones from `specs/[number]-*` history.
- `FR-011`, `SC-006`: Label non-production/supporting milestones as context entries.
- `FR-012`: Ensure four production skills are present as major entries.
- `FR-003`, `FR-004`, `FR-005`, `SC-002`: Keep entries understandable and quickly discoverable by reviewers.
- `FR-006`, `FR-010`, `SC-003`, `SC-005`: Keep facts aligned with default-branch history; optional supplemental entries remain traceable and non-replacing.

## Steps

1. Review planning artifacts
   - `<REPO_ROOT>/specs/007-documentation/plan.md`
   - `<REPO_ROOT>/specs/007-documentation/research.md`
   - `<REPO_ROOT>/specs/007-documentation/data-model.md`
   - `<REPO_ROOT>/specs/007-documentation/contracts/changelog-document-contract.md`

2. Build required milestone inventory from repository history
   - Enumerate merged pre-`007` milestone specs under `<REPO_ROOT>/specs/001-*` through `<REPO_ROOT>/specs/006-*`.
   - Mark the four production skills as major entries.
   - Mark non-production/supporting milestones as context entries.

3. Draft `<REPO_ROOT>/CHANGELOG.md`
   - Add an entry for every required pre-`007` milestone.
   - Ensure each entry states what changed and why it matters.
   - Optionally include supplemental minor entries from merged branch history when useful.

4. Validate coverage and factual consistency
   - Confirm no required pre-`007` milestones are missing.
   - Confirm no changelog claim conflicts with default-branch history.
   - Confirm context labels are present for non-production/supporting entries.

5. Validate readability and findability
   - Confirm entries follow the readability conventions in `<REPO_ROOT>/specs/007-documentation/changelog-readability-guide.md`.
   - Confirm each entry includes both `what changed` and `why it matters`.
   - Run a spot-check where a reviewer finds a known milestone from `CHANGELOG.md` without opening git history.

6. Run repository checks

```bash
cd <REPO_ROOT>
npm run check
```

## Validation Checklist

- [ ] Root `CHANGELOG.md` exists.
- [ ] All required pre-`007` milestones are represented.
- [ ] Four production skills are major entries.
- [ ] Non-production/supporting entries are labeled as context.
- [ ] Sampled entries are readable and discoverable within acceptance time targets.
- [ ] No sampled entry conflicts with default-branch history.

## Exit Criteria

- Changelog satisfies all `FR` and `SC` commitments for this feature.
- Planning artifacts are complete for `/speckit.tasks`.
- Repository checks pass.
