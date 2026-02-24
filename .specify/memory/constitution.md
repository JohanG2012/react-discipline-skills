<!--
Sync Impact Report
- Version change: 0.2.0 → 0.3.0
- Modified principles: VI. Four-Skill Product Scope
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (no changes required)
  - ✅ .specify/templates/spec-template.md (no changes required)
  - ✅ .specify/templates/tasks-template.md (no changes required)
  - ✅ .specify/templates/commands/*.md (not present)
- Follow-up TODOs: None
-->
# React Discipline Skills Constitution

## Core Principles

### I. Structure Is a Contract
The repository MUST follow the agreed project structure for skills, tooling, and
shared templates. New top-level folders or deviations from the structure MUST
not be introduced unless explicitly approved and documented.

### II. Rules Are the Source of Truth
Skill rules in `rules/*.md` are authoritative. `AGENTS.md` files are generated
outputs and MUST NOT be edited manually. All generated agent summaries MUST be
produced by the standard build process.

### III. Validation Is Required
The repository MUST provide repeatable validation checks that detect stale
generated artifacts, missing skill metadata, and invalid examples. CI and local
checks MUST run these validations and fail on drift or invalid content.

### IV. ESLint Recommendations Must Be Versioned
Recommended ESLint rules MUST be provided as versioned configurations for
ESLint 8.50.0 and 10.0.0. These configurations MUST be clearly labeled as
recommended, intended to be merged into user configurations, and kept in the
`eslint/` directory.

### V. Minimal Scope and Dependencies
Changes MUST be small, deterministic, and focused on the current feature scope.
New dependencies or new top-level directories MUST NOT be added unless
explicitly requested and justified.

### VI. Four-Skill Product Scope
The product scope is fixed to exactly four production execution skills:
`react_architecture_detection`, `react_placement_and_layering`,
`react_reuse_update_new`, and `react_implementation_discipline`.
`agent-policy-v1` is a shared policy baseline and is not counted as a
production execution skill.

## Repository Constraints

- Skills MUST include a skill definition file, rules directory, examples
  directory, and generated agent summary location.
- Generated outputs MUST be deterministic and normalized for stable diffs.
- Schema validation is REQUIRED when a schema is provided for a skill.
- New production skills beyond the four-skill scope MUST NOT be added without a
  constitution amendment and version bump.

## Development Workflow

- Edit `rules/*.md` as the source of truth.
- Run the build/generation workflow to update `AGENTS.md` outputs.
- Run validation checks before committing changes.
- CI MUST run the validation suite and fail on stale generated outputs.

## Governance

- This constitution supersedes other practices when conflicts arise.
- Amendments require an explicit version bump and an update to dependent
  templates or guidance when necessary.
- All PRs MUST include a compliance check against these principles.
- Use `specs/**/master_spec.md` and `eslint/README.md` as runtime guidance.

**Version**: 0.3.0 | **Ratified**: 2026-02-23 | **Last Amended**: 2026-02-23
