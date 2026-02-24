# Scope Governor Alignment

## Summary
Defines how reuse planning must honor hard scope caps and request explicit
approval when expanded scope is materially beneficial.

---

## Rule: Scope Cap Enforcement
**Rule ID:** rru-scope-governor  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Prevents refactor creep and keeps decision packages reviewable.

### Requirement

- Reuse planning must honor baseline hard defaults inherited from shared policy:
  - max files touched: `8`
  - max new files: `4`
  - max moved/renamed files: `0` unless migration mode is explicit
  - max new dependencies: `0` unless explicitly requested
  - max new top-level folders: `0` unless explicitly requested
- If a materially better plan exceeds caps, emit `scope_expansion_needed[]`
  entries with:
  - `why` (concrete reason)
  - `would_touch` (estimated additional files)
- Even when expansion is requested, output must still provide the in-cap
  minimal decision package.
- When caps are exceeded, include a short follow-up scope list describing what
  additional scope would be done after approval.

### Forbidden

- Expanding decision scope beyond hard defaults without explicit expansion
  signaling.
- Treating speculative refactors as valid cap-expansion justification.
- Emitting expansion requests without a bounded file-touch estimate.

### Notes

- Scope expansion is an explicit approval path, not an implicit default.
