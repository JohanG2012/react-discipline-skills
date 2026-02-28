# Feature Capability Clusters

## Summary
Defines when feature folders should stay flat versus when capability folders are
preferred.

---

## Rule: Capability Cluster Policy Inside Feature Owners
**Rule ID:** sr-feature-capability-clusters  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents premature taxonomy growth while making structural
extraction criteria deterministic when feature scope expands.
**Covers:** Capability Cluster Policy Inside Feature Owners.
**Index mode:** reference

### Requirement

- Cluster policy defaults:
  - 1-2 capability clusters in one `features/<domain>/` owner -> keep flat
    homes (`domain/**`, `hooks/**`, `components/**`, `sections/**`).
  - 3+ capability clusters in one owner -> capability folders are preferred
    directly under `features/<domain>/`.
- Cluster signals must be measurable and evidence-backed, such as:
  - distinct sub-areas with dedicated sections/hooks/domain logic,
  - repeated change touch-points across sub-areas in one task,
  - distinct query/mutation groups with separate invariants.
- Trigger behavior is review + plan only:
  - recommend the smallest structural next step,
  - include concrete evidence paths for each identified cluster,
  - keep execution scoped; do not auto-restructure.
- Capability folders should remain direct, descriptive homes (no generic wrapper
  taxonomy).

### Forbidden

- Auto-migrating a feature into capability folders solely because a trigger was
  detected.
- Introducing wrapper taxonomies like `features/<domain>/capabilities/**` or
  `features/<domain>/modules/**` as default structure.
- Forcing capability-folder structure when only 1-2 clusters exist.
