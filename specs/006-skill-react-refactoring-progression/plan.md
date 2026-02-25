# Implementation Plan: React Refactoring Progression Skill

**Branch**: `006-skill-react-refactoring-progression` | **Date**: 2026-02-25 | **Spec**: `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/spec.md`
**Input**: Feature specification from `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/spec.md`

## Summary

Define `react-refactoring-progression` as an optional, plan-only extension skill that produces deterministic, behavior-preserving refactor plans. The plan formalizes canonical `Tier A-D` progression, strict versioned output envelope requirements, fail-closed dependency handling with explicit fallback context-bundle requirements, semantic-duplication scoring, and bounded opportunistic vs dedicated scope behavior.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts  
**Primary Dependencies**: Node.js runtime, npm scripts, existing repository scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint  
**Storage**: Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`)  
**Testing**: `npm run check`, schema/contract consistency validation, and example-output conformance checks  
**Target Platform**: Local developer environments and GitHub Actions on Ubuntu (`ubuntu-latest`)  
**Project Type**: Documentation-and-tooling repository for Codex/agent skills  
**Performance Goals**: At least 90% of opportunistic consult runs produce <=5 recommendations within 2 minutes; 100% of outputs include strict envelope fields and valid `validation_status`  
**Constraints**: No new top-level directories or external dependencies; strict envelope (`schema_version`, `skill`, `version`, `result_type`, `validation_status`); canonical `Tier A-D`; fail-closed dependency behavior with no partial plan payload; bounded scope caps (8 touched files, 4 new files, 0 moves, 0 dependencies, 0 top-level folders) unless explicitly overridden  
**Scale/Scope**: One feature scope under `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/`, with implementation follow-up centered on planned optional module path `<REPO_ROOT>/skills/react-refactoring-progression/` and aligned shared policy artifacts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **I. Structure Is a Contract**: PASS
  - Planned artifacts are limited to existing `specs/` and `skills/` hierarchies; no new top-level paths are introduced.
- **II. Rules Are the Source of Truth**: PASS
  - Plan keeps skill behavior authored via `rules/*.md` and generated `AGENTS.md` updates through standard scripts.
- **III. Validation Is Required**: PASS
  - Existing deterministic validation workflow (`npm run check`) remains mandatory for completion.
- **IV. ESLint Recommendations Must Be Versioned**: PASS
  - This feature does not alter ESLint recommendation packages or versioned config requirements.
- **V. Minimal Scope and Dependencies**: PASS
  - Scope remains bounded to this feature with no new dependency additions.
- **VI. Four-Skill Product Scope**: PASS
  - Feature is explicitly optional extension scope and does not alter the fixed four production execution skills.

**Gate Decision (Pre-Phase 0)**: PASS

### Post-Phase 1 Gate Re-Check

- Phase 0/1 outputs (`research.md`, `data-model.md`, `contracts/*`, `quickstart.md`) remain confined to `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/`.
- Contract/data-model decisions preserve optional-extension classification and do not add dependencies or top-level structural changes.
- Agent context update is executed through the standard repository script without manual edits to generated sections.

**Gate Decision (Post-Phase 1)**: PASS

## Project Structure

### Documentation (this feature)

```text
<REPO_ROOT>/specs/006-skill-react-refactoring-progression/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── refactoring-progression-output-contract.md
│   └── refactoring-progression-output.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
<REPO_ROOT>/
├── shared/
│   ├── SKILL.md
│   └── rules/
├── skills/
│   ├── react-architecture-detection/
│   ├── react-placement-and-layering/
│   ├── react-reuse-update-new/
│   ├── react-implementation-discipline/
│   └── react-refactoring-progression/   (planned optional extension path)
├── scripts/
│   ├── generators/
│   ├── validators/
│   ├── lib/
│   └── fixtures/
├── specs/
│   ├── 001-agent-policy-v1/
│   ├── 002-skill-react-architecture-detection/
│   ├── 003-skill-react-placement-layering/
│   ├── 004-skill-react-reuse-update-new/
│   ├── 005-skill-react-implementation-discipline/
│   └── 006-skill-react-refactoring-progression/
├── eslint/
└── .specify/
```

**Structure Decision**: Keep the repository as a single tooling/docs project and confine planning/design artifacts to `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/`. Implementation-stage changes stay within existing module boundaries and the planned optional skill path under `skills/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
