# Reuse Decision Process

## Summary
Defines deterministic evaluation for reuse, update, or new creation.

---

## Rule: Decision Ladder
**Rule ID:** rru-process  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Keeps decisions consistent and bounded.

### Requirement

- Search for existing implementations before proposing new artifacts, using this
  lookup order for each needed artifact:
  1. Exact or near-name match
  2. Pattern/behavior match
  3. Primitive building-block match
  4. Endpoint/DTO/hook match
- For each lookup tier, record repository evidence as concrete paths or explicit
  `not_found`.
- For DRY logic extraction/refactor work across two or more call sites, a
  low-overhead discovery mode is allowed before full scoring:
  - run a quick repo search for existing helpers/patterns (for example
    `isRecord`, `getStringField`, and equivalent typed field-parsing helpers)
  - if a suitable helper exists, prefer `reuse` or small `update`
  - if no suitable helper is found, `new` is allowed with minimal scope
    and feature-appropriate ownership
- Discovery coverage must include:
  - Existing domain modules (`sections/`, `hooks/`, `domain/`) in the owning
    feature area before proposing new modules.
  - Existing UI primitives and composites before proposing new UI artifacts.
  - Existing API client/endpoints/DTO patterns before proposing new data-access
    modules.
  - Existing state conventions for server-state, local state, and global store.
  - Existing naming/export conventions so new decisions do not introduce a new
    style in an established area.
- Evaluate each candidate with scored signals:
  - Required scores: `fit`, `complexity_cost`, `coupling_risk`,
    `divergence_risk`, and `locality_benefit` (0-10 scale)
  - Use score normalization anchors:
    - `coupling_risk=0`: no new imports and no new cross-domain references
    - `coupling_risk=5`: new imports within the same feature boundary
    - `coupling_risk=10`: cross-domain import or new global dependency
    - `divergence_risk=0`: behavior is effectively identical
    - `divergence_risk=5`: behavior is similar but likely to evolve separately
    - `divergence_risk=10`: behavior is expected to diverge significantly over time
    - `locality_benefit=0`: change pulls ownership away from the feature/domain home
    - `locality_benefit=5`: neutral ownership/locality impact
    - `locality_benefit=10`: change keeps ownership close to the feature/domain home
- Apply the reuse ladder in strict order:
  1. Reuse as-is
  2. Update existing
  3. Create new
- Reuse as-is is preferred only when behavior fits with minimal glue, no mode
  flags, and no domain leakage.
- Apply safe-update defaults unless explicit overrides are provided:
  - `max_new_props_for_update=2`
  - `max_flags_allowed_composites=0` for domain mode flags
  - `max_generic_flags_allowed_primitives=1`
  - `max_abstraction_risk_score=6`
- Allow `update` only when changes remain small, abstraction quality improves,
  and existing callers remain compatible (or are straightforward to update).
- When candidate scores tie, resolve in deterministic order:
  1. Candidate in authoritative upstream home
  2. Lower coupling risk
  3. Lower divergence risk
  4. Lower complexity cost
  5. Lexical path order
- Document why reuse/update/new was selected for each needed artifact.
- Apply layer-specific reuse guidance:
  - UI primitives: reuse by default; if missing, create a primitive; if close,
    prefer small generic updates over domain-specific copies.
  - UI composites: reuse only for true UI patterns; generalize via
    slots/children/render props; do not add domain mode flags; if UI shape is
    shared but meaning differs by domain, inject content instead of encoding
    business meaning in the shared composite.
  - Feature sections: cross-domain section reuse defaults to duplication;
    same-domain section reuse is allowed.
  - Feature domain: prefer reuse within the feature domain; move logic to
    cross-domain `lib/` only when it is stable and truly shared.
  - API endpoints/DTOs: endpoint ownership and DTO contracts are reusable, but
    DTO-to-domain mapping remains feature-local unless it is stable cross-domain;
    endpoint modules should remain DTO-returning boundaries.
  - Store: use global store only for global client state and avoid duplicating
    server-state there.
- Creating new modules is preferred when existing code is too opinionated,
  update would require leaky flags/branches, or divergence is likely; duplicate
  feature sections when needed, but treat primitive/composite duplication as a
  design smell versus extending shared building blocks.
- Apply deterministic shortcut bias:
  - Low complexity + low coupling -> prefer reuse or small update.
  - High flag cost + high divergence -> prefer a new feature section while
    reusing shared primitives/composites where safe.
- Enforce anti-leakage guardrails:
  - Shared composites must not receive domain-specific mode flags.
  - Shared abstractions must not encode domain-specific naming.
  - Do not expand shared API client surface area casually; allow expansion only
    when endpoint behavior is stable and truly cross-domain.
  - If divergence risk is high, prefer domain-owned sections over forced
    cross-domain generalization.
- If explicit constraints block all safe options for an artifact, emit
  `decision_blocked` and require explicit override before accepting
  non-compliant paths.
- Pause only when reuse intent is unclear and structural cost is meaningful
  (for example: large composite expansion, unclear intentional divergence, or
  likely long-lived UX split). Otherwise proceed with deterministic defaults.
- If abstraction cost is clearly high, default to a feature-local
  section/module instead of forcing shared generalization.
- Do not pause for minor decisions when a safe default exists
  (for example: small harmless prop additions).
- Pause mode defaults are inherited from shared policy:
  - default `pause_mode` is `balanced`
  - use `strict` or `autonomous` only when explicitly configured by policy
    override
- Require upstream minimum decision context before finalizing outcomes:
  - feature owner/domain
  - route/page involvement
  - current data sources
  - intended state type
  - UI needs (primitive/composite/section shape)
- Validate required inputs before discovery and decisioning.
- Resolve effective output mode before final output:
  - accept optional `output_mode` (`human|agent`)
  - default to `human` when a human explicitly instructs this skill to run
  - default to `agent` otherwise
- If required inputs are missing or invalid, emit `validation_error` and stop.
- If repository discovery/search evidence is unavailable or incomplete, emit
  `dependency_error` and stop.
- Preserve `needed_artifact_id` identity from input through final output.
- Treat refactor sessions as valid decision-plan runs; this skill remains
  decision-only even when the outcome is a tiny shared helper addition.

### Forbidden

- Skipping discovery of existing code.
- Returning `new` without repository evidence or explicit `not_found` outcome.
- Returning ambiguous outcomes with no single final decision per artifact.
- Allowing domain leakage to justify reuse/update in shared abstractions.
- Continuing decisioning after required validation or discovery failures.

### Notes

- Favor reuse when behavior matches without threshold violations.
