# Enforcement Heuristics

## Summary
Defines shared heuristics for identifying placement violations and validating
folder-fit decisions.

---

## Rule: Enforcement Heuristics
**Rule ID:** sr-enforcement-heuristics  
**Priority:** SHOULD  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Provides consistent review heuristics across downstream skills
without over-prescribing implementation details.

### Requirement

- Treat a file as likely misplaced when one or more signals appear:
  - It imports forbidden layer dependencies.
  - It contains domain terms while living in reusable `ui/**` homes.
  - It performs network fetches outside canonical endpoint modules.
  - It performs DTO-to-domain mapping inside `api/**`.
- Use a simple placement sanity map in reviews:
  - Endpoint call -> `api/endpoints/*`
  - React Query hook -> `features/<domain>/hooks/*`
  - DTO -> domain mapping -> `features/<domain>/domain|adapters/*`
  - Reusable primitives/composites -> `ui/primitives|composites/*`
  - Route orchestration -> `pages/*`
  - Shared config/env -> `config/*`

### Forbidden

- Ignoring clear layer-violation signals during conformance checks.
