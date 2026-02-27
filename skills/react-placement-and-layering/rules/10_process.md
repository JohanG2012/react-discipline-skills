# Placement Process

## Summary
Defines the orchestration workflow for placement planning.

---

## Rule: Layer Mapping
**Rule ID:** rpl-process  
**Priority:** MUST  
**Applies to:** react-placement-and-layering  
**Rationale:** Keeps placement decisions consistent and testable.
**Covers:** Layer Mapping.
**Index mode:** reference

### Requirement

- Treat this rule as workflow orchestration; detailed policy is delegated to
  referenced rules.
- Validate required inputs before planning:
  - implementation request,
  - target architecture rules,
  - architecture-detection result.
- Resolve output mode using `sr-output-mode-resolution`.
- If implementation is already in progress and a new file becomes necessary,
  pause execution, run placement, then continue with placement result.
- Select one primary feature owner and one strategy for the run
  (`follow-existing`, `introduce-boundaries`, or `migrate-as-you-touch`).
- Run this sequence in order:
  1. discover existing homes and conventions via `rpl-discovery-conventions`,
  2. apply scope caps and expansion behavior via `rpl-scope-governor`,
  3. apply access/fallback controls via `rpl-access-control`,
  4. resolve defaults and pause behavior via `rpl-default-bias`,
  5. enforce migration safety via `rpl-migration-safety`,
  6. emit contract-compliant output via `rpl-output`.
- Enforce shared architecture and ownership constraints through inherited shared
  rules (for example `sr-layer-contracts`, `sr-features-no-cross-deps`,
  `sr-layout-shell-placement`, `sr-no-duplicate-ui-patterns`).
- Produce explicit artifact records with purpose, action, layer, and path, plus
  concise rationale per touched layer.
- If no placement change is needed, emit no-op placement output (`artifacts: []`
  and `file_actions: []`) with stay-in-place rationale.

### Forbidden

- Skipping referenced sub-rules and substituting ad-hoc policy.
- Emitting placement artifacts without selected strategy and owner.
- Finalizing placement while unresolved blocking violations remain.
- Continuing implementation after discovering a new-file requirement without
  running placement first.

### Notes

- This rule coordinates decision flow; rule-specific thresholds and guardrails
  live in the referenced policy modules.
