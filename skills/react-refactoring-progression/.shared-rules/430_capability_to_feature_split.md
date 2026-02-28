# Capability to Feature Split

## Summary
Defines when an internal capability should be promoted into its own
top-level feature owner.

---

## Rule: Capability Promotion to Feature Owner
**Rule ID:** sr-capability-to-feature-split  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents both premature feature explosion and hidden
feature-sized ownership inside one folder.
**Covers:** Capability Promotion to Feature Owner.
**Index mode:** reference

### Requirement

- Promote a capability to top-level `features/<name>/` only when at least
  2 of 4 signals are true:
  1. distinct domain model (not just fields on an existing owner model),
  2. distinct rules/invariants,
  3. distinct data operations lifecycle,
  4. cross-cutting usage across multiple composition points or clear growth
     trajectory.
- Explicit non-requirements:
  - route presence is not required,
  - minimum capability count is not required,
  - lifecycle complexity threshold is not required.
- Top-level feature creation remains gated by user-facing ownership:
  - new top-level `features/<name>/` is valid only for route/nav-level or
    otherwise user-facing domain owners,
  - otherwise keep concern inside existing feature owner as a direct
    capability folder.
- If candidate name collides by stem/prefix with an existing feature owner,
  default to owner-scoped capability placement rather than a new sibling
  feature root.
- If extracted concern is React-free cross-domain logic, prefer `lib/**`
  instead of feature promotion.

### Forbidden

- Promoting to a new top-level feature when fewer than 2 of 4 promotion signals
  are satisfied.
- Creating new top-level features for internal helpers that are not user-facing
  owners.
- Spawning a new feature because of a single field/flag on another domain
  entity.
- Leaving parallel owners active for the same concern after split decisions.
