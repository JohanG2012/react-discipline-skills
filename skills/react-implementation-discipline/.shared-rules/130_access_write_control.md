# Access and Write Control

## Summary
Defines shared access assumptions and write-control behavior for downstream
skills.

---

## Rule: Access and Write Control
**Rule ID:** sr-access-write-control  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps structural decisions grounded in repository signals and
maintains controlled, reviewable changes.
**Covers:** Access and Write Control.
**Index mode:** reference

### Requirement

- Detection/reuse/planning stages require repository read/search access.
- Minimum capabilities include:
  - Listing relevant file trees.
  - Searching code patterns.
  - Reading source/config files on demand.
- If direct access is unavailable, require a fallback context bundle with file
  tree, package/tooling config, router entry, API home, and representative
  module examples.
- Default write posture must be controlled and reviewable.
- If direct writes are enabled, scope-governor and minimal-churn rules still
  apply.
- Architecture/specification document edits require explicit request and must be
  treated as dedicated documentation scope.

### Forbidden

- Structural placement decisions without repository signal checks.
- Silent broad writes that bypass scope and review controls.
- Auto-editing architecture/spec documents during regular implementation work.
