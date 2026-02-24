# Implementation Plan: React Reuse vs Update vs New Skill

**Branch**: `004-skill-react-reuse-update-new` | **Date**: 2026-02-23 | **Spec**: `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/spec.md`
**Input**: Feature specification from `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/spec.md`

## Summary

Define and harden the `react-reuse-update-new` skill with deterministic per-artifact decisions, explicit safe-update thresholds (including abstraction-risk cap), stable artifact identity (`needed_artifact_id`), deterministic tie-break ordering, structured decision marks, fail-closed dependency handling with fallback context requirements, scope-governor expansion signaling, and explicit `decision_blocked` behavior when constraints eliminate all safe options. This planning phase delivers design and contract artifacts only within existing repository boundaries.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts  
**Primary Dependencies**: Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint  
**Storage**: Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`)  
**Testing**: `npm run check` plus contract/spec consistency review against feature requirements  
**Target Platform**: Local developer environments and GitHub Actions on Ubuntu (`ubuntu-latest`)  
**Project Type**: Documentation-and-tooling repository for Codex/agent skills  
**Performance Goals**: Decision outputs satisfy the feature target of at least 90% completion within 2 minutes for runs with up to 30 artifacts; deterministic output contract fields for every run  
**Constraints**: No new top-level directories or dependencies; deterministic decision ladder; default update thresholds (`max_new_props_for_update=2`, `max_flags_allowed_composites=0` for domain modes, `max_generic_flags_allowed_primitives=1`, `max_abstraction_risk_score=6`); tie-break order is authoritative-home then risk/complexity then lexical path; `decision_blocked` is required when constraints block all safe options; repository-discovery failure returns dependency error with fallback context requirements and no decision package; revised plans require context decisions plus file/layer justification records; scope-cap expansion must be structured and bounded; stable `needed_artifact_id` must be preserved end-to-end  
**Scale/Scope**: One feature scope for `react-reuse-update-new` in `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **I. Structure Is a Contract**: PASS
  - Planned artifacts are confined to `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/` and existing skill directories.
- **II. Rules Are the Source of Truth**: PASS
  - Plan keeps `rules/*.md` as authoritative and does not require manual edits to generated `AGENTS.md`.
- **III. Validation Is Required**: PASS
  - Existing deterministic validation (`npm run check`) remains the validation baseline.
- **IV. ESLint Recommendations Must Be Versioned**: PASS
  - No ESLint recommendation changes are in scope for this feature.
- **V. Minimal Scope and Dependencies**: PASS
  - No new dependencies and no top-level directory expansion are planned.
- **VI. Four-Skill Product Scope**: PASS
  - Scope remains within one fixed production skill (`react-reuse-update-new`) under shared baseline policy.

**Gate Decision (Pre-Phase 0)**: PASS

### Post-Phase 1 Gate Re-Check

- Phase 0/1 artifacts (`research.md`, `data-model.md`, `contracts/*`, `quickstart.md`) remain documentation/design outputs only.
- Design artifacts preserve repository structure and dependency constraints and remain within four-skill product boundaries.

**Gate Decision (Post-Phase 1)**: PASS

## Project Structure

### Documentation (this feature)

```text
<REPO_ROOT>/specs/004-skill-react-reuse-update-new/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── reuse-decision-output-contract.md
│   └── reuse-decision-output.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
<REPO_ROOT>/
├── shared/
│   ├── SKILL.md
│   └── rules/
├── templates/
│   ├── 00_OVERVIEW_TEMPLATE.md
│   ├── SKILL_TEMPLATE.md
│   ├── AGENTS_TEMPLATE.md
│   └── RULE_TEMPLATE.md
├── skills/
│   ├── react-architecture-detection/
│   ├── react-placement-and-layering/
│   ├── react-reuse-update-new/
│   │   ├── SKILL.md
│   │   ├── rules/
│   │   ├── examples/
│   │   └── schemas/
│   └── react-implementation-discipline/
├── scripts/
│   ├── generators/
│   ├── validators/
│   ├── lib/
│   └── fixtures/
├── specs/
│   ├── 001-agent-policy-v1/
│   ├── 004-skill-react-reuse-update-new/
│   ├── 002-skill-react-architecture-detection/
│   └── 003-skill-react-placement-layering/
├── eslint/
└── .specify/
```

**Structure Decision**: Use the existing single-repository skills layout and add planning/design artifacts only under `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/`. Implementation follow-up remains in existing `skills/react-reuse-update-new/` paths.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
