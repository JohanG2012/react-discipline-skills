# Quickstart: Shared Agent Policy Baseline

## Goal

Apply and validate the shared policy baseline for all four downstream production skill specs before task planning.

## Prerequisites

- Working branch: `001-agent-policy-v1`
- Repository root: `<REPO_ROOT>`
- Node.js 20 LTS and npm installed

## Steps

1. Review source-of-truth order
   - Confirm shared decisions in `<REPO_ROOT>/specs/001-agent-policy-v1/spec.md`.
   - Use `<REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md` as authoritative shared-policy source.
   - Use relevant spec master documents under `specs/**/master_spec.md` for cross-spec references.

2. Apply baseline governance decisions to policy docs
  - Ensure downstream coverage is defined for four production skills.
  - Ensure production execution scope remains fixed to those four skills and
    `agent-policy-v1` remains shared baseline policy (not counted as production
    execution skill).
   - Ensure shared baseline rule modules cover architecture boundaries,
     ownership/naming, deterministic defaults/pause, planning/reuse workflow,
     migration/placement strategy, architecture-detection output/bootstrap
     contract, fallback/implementation defaults, layer contracts, enforcement
     heuristics, access/write control, file-size guidance, scope caps, output
     discipline, and completion checks.
   - Ensure conflict exceptions require repo maintainer approval and rationale.
   - Ensure approved exceptions have no expiry field.
   - Ensure `pre_approved_collisions` exists only in shared baseline header and remains empty by default.

3. Validate downstream-spec compatibility
   - Confirm each downstream skill spec references `agent-policy-v1`.
   - Confirm no downstream skill spec defines local collision registry fields.
   - Confirm no conflicting mandatory rule is introduced without valid exception record.

4. Run repository checks

```bash
cd <REPO_ROOT>
npm run check
```

5. Confirm planning artifacts for this feature

- `<REPO_ROOT>/specs/001-agent-policy-v1/plan.md`
- `<REPO_ROOT>/specs/001-agent-policy-v1/research.md`
- `<REPO_ROOT>/specs/001-agent-policy-v1/data-model.md`
- `<REPO_ROOT>/specs/001-agent-policy-v1/contracts/policy-governance-contract.md`
- `<REPO_ROOT>/specs/001-agent-policy-v1/quickstart.md`

## Execution Checklist

- [ ] Foundational scope alignment completed across constitution and top-level policy docs.
- [ ] Shared baseline rules updated in `shared/rules/`.
- [ ] Shared baseline rule IDs listed in `shared/SKILL.md` map to concrete rule definitions.
- [ ] Shared baseline includes numbered rule modules for planning/reuse, migration, fallback defaults, implementation defaults, layer contracts, access/write control, and file-size guidance.
- [ ] Shared baseline includes numbered modules for architecture-detection contract and enforcement heuristics.
- [ ] All four downstream production skills explicitly reference shared baseline inheritance.
- [ ] Governance exception model confirms maintainer-only approval and no expiry metadata.
- [ ] Agent bundles regenerated with `npm run build:agents`.
- [ ] Repository checks pass with `npm run check`.
- [ ] Execution evidence recorded in `<REPO_ROOT>/specs/001-agent-policy-v1/implementation-tracker.md`.

## Final Verification and Handoff Checklist

- [ ] Confirm all tasks in `<REPO_ROOT>/specs/001-agent-policy-v1/tasks.md` are marked complete.
- [ ] Confirm shared baseline references are present in all four downstream `SKILL.md` files.
- [ ] Confirm required shared-rule categories are covered by numbered files in `shared/rules/`.
- [ ] Confirm contract checks include maintainer-only and no-expiry exception validation.
- [ ] Confirm scope wording is aligned across `README.md`, `AGENTS.md`, `<REPO_ROOT>/specs/001-agent-policy-v1/master_spec.md`, `<REPO_ROOT>/specs/002-skill-react-architecture-detection/master_spec.md`, `<REPO_ROOT>/specs/003-skill-react-placement-layering/master_spec.md`, `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/master_spec.md`, `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/master_spec.md`, and `.specify/memory/constitution.md`.
- [ ] Confirm `AGENTS.md` outputs were regenerated through official build/update scripts.

## Exit Criteria

- All checks in this quickstart are satisfied.
- No unresolved ambiguity remains for shared baseline governance decisions.
- Feature implementation and governance alignment are complete and ready for final review/merge.
