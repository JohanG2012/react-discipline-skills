# Planning and Reuse Workflow

## Summary
Defines required pre-implementation workflow and reuse decision discipline for
selected downstream skills.

---

## Rule: Planning and Reuse Workflow
**Rule ID:** sr-planning-reuse  
**Priority:** MUST  
**Applies to:** react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Prevents ad hoc implementation choices and improves consistency
across downstream planning outputs.

### Requirement

- Before implementation, downstream skills must:
  - Classify request type (feature, route/page, API integration, refactor, bug
    fix).
  - Choose a domain owner.
  - Map affected layers.
  - Identify expected data sources.
  - Decide server/local/global state ownership.
  - Decide UI reuse shape (reuse/update/new).
  - List planned file touches.
- For `micro_change` runs that satisfy `sr-micro-change-bypass`, the full
  pre-implementation planning sequence may be abbreviated and handled directly
  by Skill 4 micro mode.
- Existing implementations must be searched before creating new modules in:
  - Feature/domain modules.
  - UI primitives/composites.
  - API endpoints/DTOs.
  - State patterns.
- Reuse decisions must follow the ladder:
  - Reuse as-is.
  - Update existing (small, clean extension).
  - Create new (when reuse would leak domain concerns or force excessive
    complexity).
- For shared composites, if reuse requires too many domain-specific options,
  prefer feature-level duplication instead of adding domain mode flags.
- Reuse evaluation should weigh complexity cost, coupling risk, divergence
  probability, and locality benefit.

### Forbidden

- Creating new modules without checking existing alternatives.
- Skipping explicit reuse/update/new decision capture.
- Forcing domain behavior into reusable shared composites.
