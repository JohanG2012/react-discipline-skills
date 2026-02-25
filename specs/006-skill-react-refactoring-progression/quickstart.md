# Quickstart: React Refactoring Progression Skill

## Goal

Implement and validate `react-refactoring-progression` as an optional,
plan-only extension skill with strict output contract behavior, canonical
`Tier A-D` progression, mode-bounded scope controls, fail-closed dependency
handling, and semantic-duplication/anti-pattern planning metadata.

## Prerequisites

- Working branch: `006-skill-react-refactoring-progression`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Requirement Trace Map

- `FR-001` to `FR-008`: Optional-extension classification, mode behavior, and escalation governance in `skills/react-refactoring-progression/SKILL.md` and `rules/00_overview.md`, `rules/10_process.md`
- `FR-009` to `FR-016`: Step-justification, behavior-preservation, and scope-governor controls in `rules/10_process.md`, `rules/30_validation_gates.md`, `rules/40_scope_governor.md`
- `FR-017` to `FR-021`: Plan-only output, strict envelope, result variants, and integration behavior in `rules/20_output.md`, `rules/70_interactions.md`, and `schemas/output.schema.json`
- `FR-022` to `FR-029`: Anti-pattern handling, semantic-duplication modeling, progression-tier behavior, and follow-up scoping in `rules/50_detection.md`, `rules/60_semantic_duplication.md`, `rules/80_progression_model.md`, `rules/20_output.md`
- `FR-030` to `FR-032` and `SC-013` to `SC-016`: Validation/dependency error handling and fallback bundle requirements in `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json`

## Steps

1. Review feature artifacts
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/plan.md`
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/research.md`
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/data-model.md`
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md`
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json`

2. Create/update skill module artifacts
   - `skills/react-refactoring-progression/SKILL.md`
   - `skills/react-refactoring-progression/rules/00_overview.md`
   - `skills/react-refactoring-progression/rules/10_process.md`
   - `skills/react-refactoring-progression/rules/20_output.md`
   - `skills/react-refactoring-progression/rules/30_validation_gates.md`
   - `skills/react-refactoring-progression/rules/40_scope_governor.md`
   - `skills/react-refactoring-progression/rules/50_detection.md`
   - `skills/react-refactoring-progression/rules/60_semantic_duplication.md`
   - `skills/react-refactoring-progression/schemas/output.schema.json`

3. Add/update examples
   - `skills/react-refactoring-progression/examples/refactor-plan.example.json`
   - `skills/react-refactoring-progression/examples/blocked-plan.example.json`
   - `skills/react-refactoring-progression/examples/validation-error.example.json`
   - `skills/react-refactoring-progression/examples/dependency-error.example.json`

4. Keep contract mirror in sync
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output-contract.md`
   - `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/contracts/refactoring-progression-output.schema.json`

5. Regenerate and validate

```bash
cd <REPO_ROOT>
npm run build:agents
npm run check
.specify/scripts/bash/update-agent-context.sh codex
```

## Validation Checklist

- [x] Output envelope fields are mandatory in all result variants.
- [x] `validation_status` values are restricted to approved enum values.
- [x] `dependency_error` excludes `refactor_plan` payload and includes actionable fallback context requirements.
- [x] Opportunistic mode step cap and Tier A/B constraint are represented in schema/contract.
- [x] Semantic-duplication clusters include required risk/cost metadata.

## Exit Criteria

- Contract and schema are aligned for the `react-refactoring-progression` output surface.
- Generated `AGENTS.md` is up to date.
- `npm run check` passes.
- Planning artifacts are complete for `/speckit.tasks`.

## Validation Notes

- `npm run build:agents`: passed.
- `npm run check`: passed.
- `.specify/scripts/bash/update-agent-context.sh codex`: passed.
