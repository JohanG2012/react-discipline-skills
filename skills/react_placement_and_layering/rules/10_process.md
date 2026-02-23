# Placement Process

## Summary
Defines the placement workflow for new or updated files.

---

## Rule: Layer Mapping
**Rule ID:** rpl-process  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Keeps placement decisions consistent and testable.

### Requirement

- Map requested changes to a single owning layer.
- Prefer reuse of existing folders over creating new ones.
- Document why adjacent layers were not chosen.

### Forbidden

- Splitting a single responsibility across multiple layers.
- Introducing inconsistent naming conventions.

### Notes

- Use deterministic defaults when choices are otherwise equivalent.
