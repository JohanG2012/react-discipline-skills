# Implementation Defaults

## Summary
Defines shared implementation posture defaults inherited by downstream skills.

---

## Rule: Implementation Defaults
**Rule ID:** apv-implementation-defaults  
**Priority:** MUST  
**Applies to:** __TARGET_SKILL__  
**Inherited from:** shared-rules  
**Rationale:** Aligns downstream implementation behavior on quality, environment
access, logging, and tooling posture.

### Requirement

- Feature flags must be centralized in `config/featureFlags.ts` and evaluated at
  composition boundaries.
- Reusable UI components should support class extension patterns consistently
  (for example `className` with shared merge helper where applicable).
- Accessibility baseline is required for reusable UI.
- Performance posture is readability-first; memoization optimizations require
  concrete justification.
- Repository topology must be detected (single-app vs monorepo) and rules
  applied per app root when monorepo signals exist.
- Module-boundary tooling posture is spec-first:
  - Start with import-boundary review checks.
  - Add lint/tool enforcement only when explicitly requested as dedicated
    hardening scope.
  - Mirror alias paths in boundary lint rules when aliases are present.
- Environment access must be centralized through `config/env.ts`.
- Logging should use shared logger abstractions; avoid committed debug logging.
- Codegen is opt-in only; default to handwritten endpoint/DTO ownership.
- Storybook/docs are optional and should follow existing setup when present.

### Forbidden

- Direct environment reads outside `config/env.ts`.
- Committing `console.log`/`console.debug` in production code paths.
- Introducing codegen or docs platforms as implicit scope expansion.
- Adding boundary/tooling stacks implicitly in routine feature scope.
