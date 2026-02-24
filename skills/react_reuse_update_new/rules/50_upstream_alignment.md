# Upstream Alignment and Migration Safety

## Summary
Defines how reuse decisions must honor upstream architecture/placement outputs
and avoid introducing parallel architecture paths.

---

## Rule: Upstream Decision Alignment
**Rule ID:** rru-upstream-alignment  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Keeps reuse decisions coherent with prior skills and prevents
conflicting structural guidance.

### Requirement

- Treat upstream `detection_result` and `placement_plan` as authoritative for:
  - feature/domain ownership
  - layer placement intent
  - endpoint home conventions and data-boundary expectations
- Reuse decisions must refine upstream plans, not recompute or override
  architecture/gravity outcomes within the same task.
- Preserve migration safety:
  - do not create parallel mixed architecture in one decision package
  - avoid half-old/half-new placement without explicit migration boundary
  - keep feature behavior decisions and broad structural migration separated
    unless explicitly requested
- Default move/rename behavior is no moves in feature-scope plans; only include
  move actions when migration scope is explicit and import updates are complete.

### Forbidden

- Overriding upstream feature ownership or layer placement decisions without an
  explicit pause/override path.
- Returning decision guidance that conflicts with established endpoint/layer
  homes in the same task.
- Bundling migration-scale restructuring into routine feature reuse decisions.

### Notes

- This rule constrains refinement scope, not implementation details.
