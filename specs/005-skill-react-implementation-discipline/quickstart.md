# Quickstart: React Implementation Discipline Skill

## Goal

Implement and validate `react_implementation_discipline` updates defined in
`<REPO_ROOT>/specs/005-skill-react-implementation-discipline/spec.md`
with strict plan fidelity, boundary-safe behavior, blocked output handling,
fail-closed dependency behavior, out-of-scope exclusion, file-size discipline,
and structured validation summary reporting.

## Prerequisites

- Working branch: `005-skill-react-implementation-discipline`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Requirement Trace Map

- `FR-003` to `FR-007`: Process and boundary rules in `skills/react_implementation_discipline/rules/10_process.md`
- `FR-013` to `FR-016`: Output structure and flow in `skills/react_implementation_discipline/rules/20_output.md`
- `FR-021` to `FR-025`: Blocked/dependency/error behavior in `skills/react_implementation_discipline/schemas/output.schema.json` and examples
- `SC-011` to `SC-015`: Validated by output examples and `npm run check`

## Steps

1. Review feature artifacts
   - `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/plan.md`
   - `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/research.md`
   - `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/data-model.md`
   - `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md`
   - `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json`

2. Update skill artifacts
   - `skills/react_implementation_discipline/SKILL.md`
   - `skills/react_implementation_discipline/rules/00_overview.md`
   - `skills/react_implementation_discipline/rules/10_process.md`
   - `skills/react_implementation_discipline/rules/20_output.md`
   - `skills/react_implementation_discipline/schemas/output.schema.json`

3. Update examples
   - `skills/react_implementation_discipline/examples/output.example.json`
   - `skills/react_implementation_discipline/examples/blocked-output.example.json`
   - `skills/react_implementation_discipline/examples/validation-error.example.json`
   - `skills/react_implementation_discipline/examples/dependency-error.example.json`

4. Keep contract mirror in sync
   - `specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output-contract.md`
   - `specs/005-skill-react-implementation-discipline/contracts/implementation-discipline-output.schema.json`

5. Regenerate and validate

```bash
cd <REPO_ROOT>
npm run build:agents
npm run check
.specify/scripts/bash/update-agent-context.sh codex
```

## Validation Checklist

- [x] Implementation package supports `accepted` and `blocked` states with mandatory `validation_summary`.
- [x] Blocked outputs include failed checks and required fixes.
- [x] Dependency and validation errors are explicit result types and exclude implementation payload.
- [x] Out-of-scope requests are represented via scope deviation and expansion guidance.
- [x] File-size discipline thresholds are explicit and testable.
- [x] Examples validate against `skills/react_implementation_discipline/schemas/output.schema.json`.

## Exit Criteria

- Contract and skill schema are aligned.
- Generated `AGENTS.md` is up to date.
- `npm run check` passes.
- Implementation tracker records per-story evidence and final sign-off.

## Validation Notes

- `npm run build:agents`: passed.
- `npm run check`: passed.
- `.specify/scripts/bash/update-agent-context.sh codex`: passed.
- Output examples validated against `skills/react_implementation_discipline/schemas/output.schema.json`.
