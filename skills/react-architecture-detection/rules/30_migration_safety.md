# Migration Strategy and Bootstrap Safety

## Summary
Defines strategy selection, one-home discipline, and bootstrap constraints for
architecture detection output.

---

## Rule: Strategy and One-Home Discipline
**Rule ID:** rad-migration-safety  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Prevents parallel-architecture guidance and unsafe migration
recommendations.
**Covers:** Strategy and One-Home Discipline.
**Index mode:** reference

### Requirement

- Select exactly one strategy per run:
  - `follow-existing`
  - `introduce-boundaries`
  - `migrate-as-you-touch`
- Strategy selection criteria:
  - `follow-existing`: local gravity is clear or migration churn would be high.
  - `introduce-boundaries`: repo is flat/partially structured and isolated
    boundary introduction is feasible.
  - `migrate-as-you-touch`: migration scope is explicit and touched-area moves
    create immediate clarity.
- Always provide concise `strategy_rationale`.
- Preserve one-home-per-concern discipline in guidance.
- Do not recommend competing homes for the same concern.
- For bootstrap-triggered repositories (flat/ad-hoc with no clear
  routing/UI/API/domain homes), constrain recommendations to canonical set:
  - `pages/`
  - `features/`
  - `ui/primitives/`
  - `ui/composites/`
  - `api/client/`
  - `api/dto/`
  - `api/endpoints/`
  - `core/`
  - `lib/`
  - `hooks/`
  - `config/`
  - `store/` only when truly global client-state is required
- Alias handling for existing repositories:
  - `views/` is treated as `pages/`-equivalent routing home evidence,
  - `state/` is treated as `store/`-equivalent global-state home evidence,
  - bootstrap/new-home recommendations remain canonical (`pages/`, `store/`)
    rather than alias names.
- Bootstrap recommendations must be minimal and task-scoped (no speculative
  folder recommendations).
- Once a canonical home exists for a concern, do not recommend an alternate
  home unless explicit migration mode is enabled.

### Forbidden

- Emitting multiple strategies for one task.
- Recommending mixed parallel homes for the same concern.
- Recommending bootstrap homes outside canonical set.
- Recommending direct migration file moves/refactors as part of detection stage.

### Notes

- Detection may recommend a migration direction; implementation ownership remains
  downstream.
