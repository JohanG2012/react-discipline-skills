# Discovery and Convention Audit

## Summary
Defines the mandatory repository discovery and convention checks that must be
completed before final reuse/update/new decisions.

---

## Rule: Discovery Coverage and Convention Fit
**Rule ID:** rru-discovery-conventions  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Prevents duplicate artifacts and style drift by forcing
evidence-based discovery in the active repository.

### Requirement

- Discovery must examine existing homes before proposing new artifacts:
  - check whether `features/<domain>/` already exists before proposing a new
    domain module home
  - domain modules (`features/<domain>/sections`, `hooks`, `domain`)
  - UI primitives and composites
  - API client, endpoints, and DTO modules, following existing `api/client`
    usage patterns
  - state conventions (server-state, local-state, global store), including
    server-state cache wiring patterns (for example QueryClient usage in core
    wiring) when present
- Discovery must verify established naming/export conventions in the active area
  before proposing new paths, including:
  - one concept per role (avoid mixed `Page`/`Route`/`Screen` synonyms in one
    area)
  - deterministic role naming (`*Page`, `*Section`, `use*`, `*Dto`)
  - deterministic API placement naming (`api/endpoints/*` for endpoint modules)
  - file-name and primary-export alignment for searchable names
  - established error-handling style and DTO/domain typing style consistency
  - component naming (`PascalCase` file + export) and hook naming (`useXxx`
    camelCase file + export)
  - avoiding dotted suffix patterns (for example `.page.tsx` / `.route.tsx`)
    unless existing local conventions require them
  - stable export style consistency (prefer named exports; allow default exports
    only where framework conventions or established local area conventions
    require them)
  - avoidance of introducing barrels where area conventions do not use them
  - explicit-import consistency where local area conventions already use it, and
    no mixed barrel/deep-path imports in the same area
  - colocated test naming compatibility (`*.test.tsx` / `*.test.ts`) and
    colocated placement when tests already exist in the target area
- If naming is unclear, file names must still encode module role clearly (for
  example: page/section/hook/dto identity).
- If conventions are ambiguous, choose nearest-neighbor conventions and keep
  names searchable (file name and primary export aligned).
- Each decision must remain traceable to concrete discovery evidence or explicit
  `not_found`.

### Forbidden

- Proposing new modules before checking existing domain and shared homes.
- Inventing a new naming/export style in an established area.
- Treating naming uncertainty as justification for structural churn.

### Notes

- Convention checks are a discovery responsibility, not an implementation
  formatting concern.
