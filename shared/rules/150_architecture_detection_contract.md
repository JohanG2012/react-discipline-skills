# Architecture Detection Contract

## Summary
Defines the shared contract that downstream skills must inherit from
architecture-detection outputs, including bootstrap behavior.

---

## Rule: Architecture Detection Output and Bootstrap Contract
**Rule ID:** apv-architecture-detection-contract  
**Priority:** MUST  
**Applies to:** __TARGET_SKILL__  
**Inherited from:** shared-rules  
**Rationale:** Ensures all downstream skills consume one consistent
architecture-detection result and bootstrap behavior.

### Requirement

- Architecture detection output must include the shared structural signals:
  - `routing.type`
  - `ui.home`
  - `api.home` (canonical endpoint layer for boundary checks)
  - `domain.organization`
  - `gravity_map`
  - `alignment_score`
  - `strategy`
  - `notes[]`
- Gravity decisions are owned by architecture detection and reused by all
  downstream skills within the same task.
- Downstream skills must not recompute/override gravity unless a structural
  pause is triggered and explicitly resolved.
- Bootstrap behavior applies only when no clear concern homes exist:
  - Allow folder creation only from the canonical set:
    `pages/`, `features/`, `ui/primitives/`, `ui/composites/`, `api/client/`,
    `api/dto/`, `api/endpoints/`, `core/`, `lib/`, `hooks/`, `config/`
  - `store/` may be created only when truly global client-state is required.
  - Prefer minimal bootstrap: create only folders needed for the current task.

### Forbidden

- Consuming inconsistent architecture-detection outputs across downstream skills
  for the same task.
- Creating speculative bootstrap folders not needed by the current task.
