# Implementation Plan: React Implementation Discipline Skill

**Branch**: `005-skill-react-implementation-discipline` | **Date**: 2026-02-24 | **Spec**: `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/spec.md`
**Input**: Feature specification from `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/spec.md`

## Summary

Define and harden `react-implementation-discipline` so downstream implementation execution is deterministic, boundary-safe, and low-churn. The plan formalizes blocked-output behavior on quality-gate failure, strict out-of-scope filtering, fail-closed dependency handling when repository context is unavailable, explicit file-size enforcement thresholds, and mandatory structured validation summaries in every output package.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts  
**Primary Dependencies**: Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint  
**Storage**: Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`)  
**Testing**: `npm run check` plus contract/schema/example consistency verification against feature requirements  
**Target Platform**: Local developer environments and GitHub Actions on Ubuntu (`ubuntu-latest`)  
**Project Type**: Documentation-and-tooling repository for Codex/agent skills  
**Performance Goals**: At least 90% of implementation outputs for tasks touching up to 8 files produced within 5 minutes; 100% of outputs include structured validation summary with final state (`accepted`, `blocked`, `dependency_error`, or `validation_error`)  
**Constraints**: No new top-level directories or dependencies; strict plan-fidelity and boundary enforcement; mandatory blocked output on failed mandatory quality checks; fail-closed dependency behavior when repository context is unavailable; explicit out-of-scope exclusions unless approved; file-size discipline with layer soft caps, mandatory split over 400 lines, hard stop over 600 lines  
**Scale/Scope**: One feature scope under `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/`, with implementation follow-up confined to `skills/react-implementation-discipline/**` and aligned shared policy artifacts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **I. Structure Is a Contract**: PASS
  - Planned artifacts are confined to existing `specs/` and `skills/` directories with no new top-level folders.
- **II. Rules Are the Source of Truth**: PASS
  - Skill updates remain rule-driven (`rules/*.md`) and preserve generated `AGENTS.md` discipline.
- **III. Validation Is Required**: PASS
  - Existing deterministic validation workflow (`npm run check`) remains mandatory for completion.
- **IV. ESLint Recommendations Must Be Versioned**: PASS
  - ESLint recommendation scope is unchanged for this feature.
- **V. Minimal Scope and Dependencies**: PASS
  - No new dependency additions are planned; scope is limited to this skill and its contracts.
- **VI. Four-Skill Product Scope**: PASS
  - Work is scoped to one approved production execution skill: `react-implementation-discipline`.

**Gate Decision (Pre-Phase 0)**: PASS

### Post-Phase 1 Gate Re-Check

- Phase 0/1 outputs (`research.md`, `data-model.md`, `contracts/*`, `quickstart.md`) remain documentation/design artifacts under the feature directory.
- Contract and data model decisions preserve the four-skill scope, no-dependency-expansion rule, and generated-artifact governance model.

**Gate Decision (Post-Phase 1)**: PASS

## Project Structure

### Documentation (this feature)

```text
<REPO_ROOT>/specs/005-skill-react-implementation-discipline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── implementation-discipline-output-contract.md
│   └── implementation-discipline-output.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
<REPO_ROOT>/
├── skills/
│   ├── .shared/
│   │   └── policy/
│   ├── react-architecture-detection/
│   ├── react-placement-and-layering/
│   ├── react-reuse-update-new/
│   └── react-implementation-discipline/
│       ├── SKILL.md
│       ├── rules/
│       ├── examples/
│       └── schemas/
├── tools/
│   └── build/
├── specs/
│   ├── 001-agent-policy-v1/
│   ├── 005-skill-react-implementation-discipline/
│   ├── 002-skill-react-architecture-detection/
│   ├── 003-skill-react-placement-layering/
│   └── 004-skill-react-reuse-update-new/
├── eslint/
└── .specify/
```

**Structure Decision**: Use the current single-repository skills layout and keep all planning/design artifacts under `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/`. Implementation updates remain within existing `skills/react-implementation-discipline/` module boundaries.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
