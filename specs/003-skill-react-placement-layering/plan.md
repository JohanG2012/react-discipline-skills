# Implementation Plan: React Placement and Layering Skill

**Branch**: `003-skill-react-placement-layering` | **Date**: 2026-02-23 | **Spec**: `<REPO_ROOT>/specs/003-skill-react-placement-layering/spec.md`
**Input**: Feature specification from `<REPO_ROOT>/specs/003-skill-react-placement-layering/spec.md`

## Summary

Define and harden the `react-placement-and-layering` skill design with a strict versioned output contract, deterministic layer/placement planning rules, fail-fast input validation, pause-resolved architecture-vs-repository precedence for structural conflicts below `0.7`, and sensitive-output redaction constraints. This plan delivers design and contract artifacts only, within existing repository structure and dependency limits.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts  
**Primary Dependencies**: Node.js runtime, npm scripts, existing validation/build scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint  
**Storage**: Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`)  
**Testing**: `npm run check` and contract/spec consistency review against feature requirements  
**Target Platform**: Local developer environments and GitHub Actions on Ubuntu (`ubuntu-latest`)  
**Project Type**: Documentation-and-tooling repository for Codex/agent skills  
**Performance Goals**: Deterministic contract compliance and validation correctness for planning outputs; explicit runtime throughput targets are out of this phase scope  
**Constraints**: No new top-level directories or dependencies; strict versioned output contract; fail-fast on missing/invalid required inputs; source-of-truth precedence uses architecture output by default with pause-resolved repository override for structural conflicts when confidence is below `0.7`; successful plans include canonical endpoint layer, authoritative-home map, and decision justification fields; move/rename metadata is required when moves are planned and move count is capped to three per run; no raw source snippets or secret-like values in output  
**Scale/Scope**: One skill-focused feature scope for `react-placement-and-layering` in `<REPO_ROOT>/specs/003-skill-react-placement-layering/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **I. Structure Is a Contract**: PASS
  - Planned artifacts are confined to `<REPO_ROOT>/specs/003-skill-react-placement-layering/` and existing skill directories.
- **II. Rules Are the Source of Truth**: PASS
  - Plan keeps `rules/*.md` as authoritative sources and does not rely on manual edits to generated agent summaries.
- **III. Validation Is Required**: PASS
  - Validation remains on existing deterministic checks (`npm run check`) and schema/contract consistency.
- **IV. ESLint Recommendations Must Be Versioned**: PASS
  - No ESLint recommendation changes are in scope for this feature.
- **V. Minimal Scope and Dependencies**: PASS
  - No dependency additions and no top-level directory expansion are planned.
- **VI. Four-Skill Product Scope**: PASS
  - Scope remains within one fixed production skill (`react-placement-and-layering`) under shared baseline policy.

**Gate Decision (Pre-Phase 0)**: PASS

### Post-Phase 1 Gate Re-Check

- Phase 0/1 outputs (`research.md`, `data-model.md`, `contracts/*`, `quickstart.md`) are documentation/design artifacts only and remain inside allowed feature scope.
- Design artifacts do not introduce dependency or structure violations and preserve four-skill product boundaries.

**Gate Decision (Post-Phase 1)**: PASS

## Project Structure

### Documentation (this feature)

```text
<REPO_ROOT>/specs/003-skill-react-placement-layering/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── placement-plan-output-contract.md
│   └── placement-plan-output.schema.json
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
│   │   ├── SKILL.md
│   │   ├── rules/
│   │   ├── examples/
│   │   └── schemas/
│   ├── react-reuse-update-new/
│   └── react-implementation-discipline/
├── scripts/
│   ├── generators/
│   ├── validators/
│   ├── lib/
│   └── fixtures/
├── specs/
│   ├── 001-agent-policy-v1/
│   ├── 002-skill-react-architecture-detection/
│   └── 003-skill-react-placement-layering/
├── eslint/
└── .specify/
```

**Structure Decision**: Use the current single-repository skills layout. This feature adds planning/design artifacts under `<REPO_ROOT>/specs/003-skill-react-placement-layering/` and keeps all implementation follow-up in existing placement skill homes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
