# Policy Constraints

## Summary
Defines non-negotiable constraints that all skills must respect.

---

## Rule: Minimal Scope Enforcement
**Rule ID:** apv-constraints  
**Priority:** MUST  
**Applies to:** agent_policy_v1  
**Rationale:** Prevents uncontrolled scope expansion and dependency creep.

### Requirement

- Changes must stay within the requested feature scope.
- New top-level folders must not be added without explicit approval.
- New dependencies must not be added without explicit approval.

### Forbidden

- Silent expansion of scope.
- Introducing unapproved dependencies or repositories.

### Notes

- If a requirement cannot be met without expanding scope, pause and request approval.
