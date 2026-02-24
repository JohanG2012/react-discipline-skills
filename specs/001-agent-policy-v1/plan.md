# Implementation Plan: Shared Agent Policy Baseline

**Branch**: `001-agent-policy-v1` | **Date**: 2026-02-23 | **Spec**: `<REPO_ROOT>/specs/001-agent-policy-v1/spec.md`
**Input**: Feature specification from `<REPO_ROOT>/specs/001-agent-policy-v1/spec.md`

## Summary

Define and document a shared governance baseline (`agent-policy-v1`) that all four downstream production skill specs must inherit, including strict conflict handling, exception governance, and single-source policy header rules. The plan uses existing repository tooling and documentation workflows without adding dependencies or new top-level structure.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown for policy/spec artifacts  
**Primary Dependencies**: Node.js runtime, npm scripts, existing build/validation scripts (`tools/build/compile_agents.mjs`, `tools/build/validate_frontmatter.mjs`, `tools/build/validate_examples.mjs`), Husky/Commitlint  
**Storage**: Filesystem-based repository artifacts (Markdown specs, policy docs, generated agent docs)  
**Testing**: `npm run check` plus spec/contract consistency review against feature requirements  
**Target Platform**: Local developer environments and GitHub Actions on Ubuntu (`ubuntu-latest`)  
**Project Type**: Documentation-and-tooling repository for Codex/agent skills governance  
**Performance Goals**: Keep validation workflow deterministic; no regression to current `npm run check` behavior for normal repository state  
**Constraints**: No new top-level directories or runtime dependencies; exception approvals restricted to repo maintainers; `pre_approved_collisions` defined only in shared baseline header and empty by default; approved exceptions have no expiry field  
**Scale/Scope**: One shared baseline governing four downstream production skill specs within a five-spec initiative

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **I. Structure Is a Contract**: PASS
  - Planned work is limited to existing `specs/001-agent-policy-v1/` documentation outputs and policy alignment.
- **II. Rules Are the Source of Truth**: PASS
  - No manual edits to generated `AGENTS.md`; policy/spec source files remain authoritative.
- **III. Validation Is Required**: PASS
  - Existing validation workflow remains the required verification path.
- **IV. ESLint Recommendations Must Be Versioned**: PASS
  - No changes to ESLint recommendation directories or versioning.
- **V. Minimal Scope and Dependencies**: PASS
  - No new dependencies and no top-level folder expansion in this plan.
- **VI. Four-Skill Product Scope**: PASS
  - Constitution language is aligned to four production execution skills with `agent-policy-v1` as shared baseline.

**Gate Decision (Pre-Phase 0)**: PASS

### Post-Phase 1 Gate Re-Check

- Design artifacts (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) keep scope limited to governance documentation and do not introduce structural or dependency violations.
- No additional constitution violations were introduced by design.

**Gate Decision (Post-Phase 1)**: PASS

## Project Structure

### Documentation (this feature)

```text
<REPO_ROOT>/specs/001-agent-policy-v1/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── policy-governance-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
<REPO_ROOT>/
├── skills/
│   ├── .shared/
│   │   ├── policy/
│   │   └── templates/
│   ├── react-architecture-detection/
│   ├── react-implementation-discipline/
│   ├── react-placement-and-layering/
│   └── react-reuse-update-new/
├── tools/
│   └── build/
├── eslint/
│   ├── 8.50.0/
│   └── 10.0.0/
├── specs/
│   └── 001-agent-policy-v1/
└── .specify/
```

**Structure Decision**: Use the existing single-repository skills governance layout. The feature only adds planning/design artifacts under `specs/001-agent-policy-v1/` and does not introduce new structural homes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
