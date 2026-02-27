# Governance

## Summary
Sets expectations for compliance, documentation, and review.

---

## Rule: Governance Compliance
**Rule ID:** sr-governance  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Ensures policies are enforced consistently across changes.
**Covers:** Governance Compliance.
**Index mode:** reference

### Requirement

- All changes must be validated against the constitution and project specs.
- Documentation updates must keep guidance accurate and current.
- Generated artifacts must be produced by the official build process.
- Shared-policy rule changes must include an explicit policy version increment
  with documented rationale.
- Shared-policy exception approvals must be performed by repo maintainers only.
- Exception records must include rationale and conflicting rule reference.
- Exception records must not include expiry metadata; approved exceptions remain
  active until explicitly revoked or superseded by newer policy version.
- `pre_approved_collisions` must be managed only in the shared baseline header.
- Policy behavior must not be changed implicitly via examples, migration
  behavior, or downstream reinterpretation.

### Forbidden

- Bypassing validation requirements.
- Manual edits to generated artifacts.
- Approving shared-policy exceptions from non-maintainer roles.
- Adding expiry fields to shared-policy exception records.
- Defining downstream-local `pre_approved_collisions` sources.
- Changing shared-policy semantics without a version and rationale update.

### Notes

- If governance rules conflict, the constitution takes precedence.
