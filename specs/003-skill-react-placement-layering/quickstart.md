# Quickstart: React Placement and Layering Skill

## Goal

Implement and validate placement-planning contract updates defined in
`<REPO_ROOT>/specs/003-skill-react-placement-layering/spec.md`
with deterministic output behavior, strict validation, and confidence-based
source-of-truth precedence with pause-resolved structural overrides.

## Prerequisites

- Working branch: `003-skill-react-placement-layering`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Steps

1. Review planning artifacts
   - Read `<REPO_ROOT>/specs/003-skill-react-placement-layering/plan.md`.
   - Read `<REPO_ROOT>/specs/003-skill-react-placement-layering/research.md`.
   - Read `<REPO_ROOT>/specs/003-skill-react-placement-layering/data-model.md`.
   - Read `<REPO_ROOT>/specs/003-skill-react-placement-layering/contracts/placement-plan-output-contract.md`.

2. Apply skill contract and rule updates
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/SKILL.md` to reflect strict versioned output expectations.
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/rules/00_overview.md` with explicit scope and sensitive-output prohibition.
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/rules/10_process.md` with:
     - required-input validation sequence
     - request-classification categories before artifact planning
     - architecture-vs-repository precedence handling
     - confidence threshold behavior (`<0.7` structural conflicts require pause-resolved override)
     - cross-layer error ownership expectations
     - state-persistence policy for store/global-state placement
     - authoritative-home mapping and move-mode constraints
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/rules/20_output.md` with:
     - strict output field requirements for plan results
     - validation-error output shape
     - optional structured scope-expansion escape hatch field
     - no raw source snippets or secret-like values
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/rules/60_scope_governor.md` with structured scope-expansion behavior.
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/rules/70_access_control.md` with explicit write-control policy for architecture/spec docs.
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/rules/90_implementation_handoff.md` with implementation-output formatting defaults.
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/schemas/output.schema.json` to align with the contract.
   - Update `<REPO_ROOT>/skills/react-placement-and-layering/examples/output.example.json` to match the updated schema.

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
   - Confirm implementation aligns with requirements in `<REPO_ROOT>/specs/003-skill-react-placement-layering/spec.md`, especially:
     - strict versioned output contract (`FR-018`, `FR-019`)
     - fail-fast validation behavior (`FR-020`, `FR-021`)
     - source-of-truth precedence and threshold (`FR-022`, `FR-023`, `FR-025`)
     - authoritative-home and move metadata contract fields (`FR-026`, `FR-027`)
     - scope-expansion structured field behavior (`FR-032`)
     - request classification, persistence policy, and cross-layer error guidance (`FR-029`, `FR-030`, `FR-031`)
     - documentation write-control and implementation handoff format defaults (`FR-033`, `FR-034`)
     - sensitive-output exclusion (`FR-024`)
   - Confirm no new dependencies or top-level directories were added.
   - Record implementation evidence in `<REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md`.

## Tracker Checkpoints

- After Setup + Foundational: update phase statuses and foundational evidence in `<REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md`.
- After each user story (US1, US2, US3): record independent-test evidence and set story status to complete in `<REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md`.
- After final polish: record command outcomes (`npm run build:agents`, `npm run check`, agent-context update) and final sign-off notes in `<REPO_ROOT>/specs/003-skill-react-placement-layering/implementation-tracker.md`.

## Execution Checklist

- [x] Placement output contract is strict and versioned.
- [x] Plan output includes required planning fields and validation status.
- [x] Validation-error output occurs for missing/invalid required inputs with no plan artifacts.
- [x] Source-of-truth precedence uses architecture output by default; structural repository overrides below `0.7` require `pause_resolved` metadata.
- [x] Plan output includes canonical endpoint layer and authoritative-home map.
- [x] Move-enabled output (when used) is capped to three operations and includes `move_concern` and import-update targets.
- [x] Scope-expansion follow-up output uses structured `scope_expansion_needed` entries (`why`, `would_touch`) only for plan results.
- [x] Process rules include request-classification categories and store/error policy constraints.
- [x] Access-control rules prohibit routine auto-editing of architecture/specification documents.
- [x] Implementation handoff formatting defaults are codified for downstream stages.
- [x] Output excludes raw source snippets and secret-like values.
- [x] Updated example output validates against updated schema.
- [x] Generated `<REPO_ROOT>/skills/react-placement-and-layering/AGENTS.md` is up to date.
- [x] `npm run check` passes.

## Validation Notes

- `npm run build:agents`: passed.
- `npm run check`: passed (`check:agents`, `check:frontmatter`, and
  `check:examples` all passed).
- `.specify/scripts/bash/update-agent-context.sh codex`: passed; script emitted
  the known duplicate-prefix warning but updated
  `<REPO_ROOT>/AGENTS.md`.

## Exit Criteria

- Contract, schema, and example files are consistent.
- Validation checks pass with no stale generated outputs.
- Feature is ready for `/speckit.tasks` decomposition.
