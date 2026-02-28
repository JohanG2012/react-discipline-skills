# Capability Folder Naming

## Summary
Defines enforceable naming constraints for capability folders under feature
owners.

---

## Rule: Capability Folder Naming and Reserved Names
**Rule ID:** sr-capability-folder-naming  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps capability structure searchable and prevents generic
dumping-ground taxonomy drift.
**Covers:** Capability Folder Naming and Reserved Names.
**Index mode:** reference

### Requirement

- Direct capability folders under `features/<domain>/` must use
  capability-descriptive names.
- Capability names should represent concrete business/user capabilities rather
  than technical buckets.
- Verb-ish names are allowed only when they clearly denote a real user/domain
  capability and remain stable in review language.
- Capability names must avoid stem/prefix ambiguity with existing siblings in
  the same feature owner.
- Reserved/disallowed folder names directly under `features/<domain>/`:
  - `views`
  - `api` (when canonical API home exists)
  - `common`
  - `shared`
  - `utils`
  - `modules`
  - `capabilities`

### Forbidden

- Creating generic or catch-all capability folder names.
- Using reserved names as direct capability folders under feature owners.
- Keeping ambiguous sibling names that overlap by stem/prefix and hide
  ownership intent.
