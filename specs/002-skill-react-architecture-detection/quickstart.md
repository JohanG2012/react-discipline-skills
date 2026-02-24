# Quickstart: React Architecture Detection Skill

## Goal

Implement and validate the architecture-detection contract updates defined in
`<REPO_ROOT>/specs/002-skill-react-architecture-detection/spec.md`
with deterministic, machine-consumable output behavior.

## Prerequisites

- Working branch: `002-skill-react-architecture-detection`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Steps

1. Review planning artifacts
   - Read `<REPO_ROOT>/specs/002-skill-react-architecture-detection/plan.md`.
   - Read `<REPO_ROOT>/specs/002-skill-react-architecture-detection/research.md`.
   - Read `<REPO_ROOT>/specs/002-skill-react-architecture-detection/data-model.md`.
   - Read `<REPO_ROOT>/specs/002-skill-react-architecture-detection/contracts/architecture-detection-output-contract.md`.

2. Apply skill contract changes
   - Update `<REPO_ROOT>/skills/react_architecture_detection/SKILL.md` output contract guidance.
   - Update `<REPO_ROOT>/skills/react_architecture_detection/rules/00_overview.md` to keep scope detection-only (no refactors, no direct edits).
   - Update `<REPO_ROOT>/skills/react_architecture_detection/rules/10_process.md` with deterministic scan rules, single-strategy selection, and low-confidence pause behavior.
   - Update `<REPO_ROOT>/skills/react_architecture_detection/rules/20_output.md` with:
     - mandatory `schema_version`
     - `confidence < 0.7 => home=unknown`
     - required `pause_decision` when ambiguity is structural/high-impact
     - pause-mode thresholds (`strict | balanced | autonomous`, default `balanced`)
     - metadata-only output (no raw code snippets)
   - Update `<REPO_ROOT>/skills/react_architecture_detection/schemas/output.schema.json` to match the new contract.
   - Update `<REPO_ROOT>/skills/react_architecture_detection/examples/output.example.json` to a valid payload under the updated schema.

3. Regenerate derived agent docs

```bash
cd <REPO_ROOT>
npm run build:agents
```

4. Run validation checks

```bash
cd <REPO_ROOT>
npm run check
```

5. Verify design-contract alignment
   - Confirm implementation aligns with all requirements in `<REPO_ROOT>/specs/002-skill-react-architecture-detection/spec.md` (`FR-012`, `FR-013`, `FR-016`, `FR-017`, `FR-018`, `FR-019`, `FR-020` and related success criteria).
   - Confirm no new dependencies or top-level folders were introduced.
   - Record implementation and validation evidence in `<REPO_ROOT>/specs/002-skill-react-architecture-detection/implementation-tracker.md`.

## Execution Checklist

- [x] Output contract includes mandatory `schema_version`.
- [x] Output includes classification fields for routing, UI, domain, data access, and state plus one gravity map.
- [x] Output includes exactly one strategy (`follow-existing`, `introduce-boundaries`, or `migrate-as-you-touch`) with rationale.
- [x] Low-confidence rule (`< 0.7`) forces `home=unknown` and `status=ambiguous`.
- [x] Required `pause_decision` is present when ambiguity is low-confidence and structural.
- [x] `pause_decision` includes `pause_mode`, `decision_safety_confidence`, and `impact`.
- [x] Strategy output includes explicit strategy-selection basis metadata.
- [x] Bootstrap behavior is constrained to canonical/minimal recommendations when triggered.
- [x] Output contains structural metadata only and no raw code snippets.
- [x] Example output validates against updated schema.
- [x] Generated `<REPO_ROOT>/skills/react_architecture_detection/AGENTS.md` is up to date.
- [x] `npm run check` passes.

## Validation Notes

- `npm run build:agents` completed successfully.
- `npm run check` completed successfully (`check:agents`, `check:frontmatter`, and `check:examples` all passed).
- `.specify/scripts/bash/update-agent-context.sh codex` completed successfully; script emitted the known duplicate-prefix warning but updated `<REPO_ROOT>/AGENTS.md`.

## Exit Criteria

- Contract, schema, and example files are consistent.
- Validation checks pass with no stale generated artifacts.
- Feature is ready for `/speckit.tasks` decomposition and implementation tracking.
