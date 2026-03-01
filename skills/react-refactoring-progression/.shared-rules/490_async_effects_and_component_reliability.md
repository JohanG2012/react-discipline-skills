# Async, Effects, and Component Reliability

## Summary
Defines mandatory anti-pattern guards for effect modeling, async concurrency,
event discipline, list identity, pagination safety, and responsibility splits.

---

## Rule: No Run-Once Effect Hacks
**Rule ID:** sr-effects-run-once-hacks  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Preserves strict dependency modeling and avoids fragile
run-once behavior under StrictMode and refactor churn.
**Covers:** No Run-Once Effect Hacks.
**Index mode:** reference

### Requirement

- Treat an effect as suspect when any is true:
  - it uses manual run-suppression guards (`didRun`, `hasInitialized`,
    `isFirst`, `mountedRef`, `ranOnceRef`) to prevent reruns,
  - it omits real dependencies and relies on a guard to simulate correctness,
  - it depends on props/state but runs with empty deps via guard logic.
- Remediation ladder (smallest first):
  1. model real dependencies explicitly and include required inputs,
  2. for "once per mount" intent, make logic idempotent instead of guard-hacked,
  3. for "once per key change" intent, make the key an explicit dependency,
  4. when async is involved, apply async gating and race-protection rules.

### Forbidden

- Guard flags whose only purpose is to silence effect reruns instead of
  modeling dependencies.
- `react-hooks/exhaustive-deps` suppression without a documented invariant and
  boundary-safe reasoning.

---

## Rule: Async Gating Must Not Rely on State Alone
**Rule ID:** sr-async-gating-not-state-only  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** React state updates are not a reliable mutex for fast, repeated
trigger sources.
**Covers:** Async Gating Must Not Rely on State Alone.
**Index mode:** reference

### Requirement

- Treat async duplicate-prevention as suspect when:
  - it relies only on state flags (`loading`, `isFetching`, `isSubmitting`) in
    the same component/hook,
  - rapid multi-trigger sources exist (for example scroll + click,
    intersection + click, rerender + effect) and only state prevents repeats.
- Remediation ladder:
  1. use an in-flight guard that updates synchronously (ref/lock) for fast
     trigger paths,
  2. reset guard in `finally` and keep reset robust on errors,
  3. prefer TanStack Query mutation/query primitives when available.

### Forbidden

- Treating React state as a mutex for preventing duplicate async calls in
  multi-trigger scenarios.

---

## Rule: Async Race and Out-of-Order Response Protection
**Rule ID:** sr-async-race-protection  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents stale async responses from corrupting current UI/data
state.
**Covers:** Async Race and Out-of-Order Response Protection.
**Index mode:** reference

### Requirement

- Treat async flow as suspect when:
  - multiple async calls can overlap and update the same state target,
  - list pagination/entity updates are applied without ordering guards,
  - request results are applied without verifying they are still current.
- Remediation ladder:
  1. abort stale requests where possible (`AbortController`) and ignore abort
     errors,
  2. use request IDs (monotonic counter) and accept only the latest response,
  3. for paginated lists, guard merges by cursor/token continuity.

### Forbidden

- Applying async responses to state when a newer request has been issued for
  the same logical target.

---

## Rule: Async Event Handler Discipline
**Rule ID:** sr-async-event-handler-discipline  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps JSX declarative and async error handling consistent across
boundaries.
**Covers:** Async Event Handler Discipline.
**Index mode:** reference

### Requirement

- Treat async UI event handling as suspect when:
  - multi-step inline async functions are embedded in JSX events,
  - similar async actions exist with divergent error handling,
  - errors are swallowed or surfaced inconsistently.
- Remediation ladder:
  1. extract named handlers (`handleX`) and keep JSX declarative,
  2. normalize errors at correct boundaries:
     - transport normalization in endpoint layer,
     - hook-level error shape in feature hooks,
     - user-facing feedback decisions in sections/pages,
  3. ensure consistent retry/recovery affordances (no silent fail path).

### Forbidden

- Multi-step async flows embedded directly in JSX handlers.
- Duplicate async action flows in one scope with divergent error handling.

---

## Rule: Observer and Listener Stability
**Rule ID:** sr-observer-listener-stability  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents performance churn and duplicate side-effects from
frequent teardown/recreate cycles.
**Covers:** Observer and Listener Stability.
**Index mode:** reference

### Requirement

- Treat observer/listener setup as suspect when:
  - registration is recreated frequently due to high-churn dependencies that do
    not require recreation,
  - callback identity churn causes repeated teardown/recreate loops,
  - rapidly changing state flags drive observer lifecycle instead of refs.
- Remediation ladder:
  1. create observer/listener once per stable target (stable ref + options),
  2. move fast-changing gating flags into refs,
  3. keep global side-effectful listener registration in `pages/**` or
     `core/**`; feature/UI consume as input.

### Forbidden

- Recreating observers/listeners on every render or high-churn state changes
  when ref-based gating can stabilize lifecycle.

---

## Rule: React List Key Stability
**Rule ID:** sr-react-list-key-stability  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Stable keys preserve identity semantics during list updates and
avoid subtle UI/state bugs.
**Covers:** React List Key Stability.
**Index mode:** reference

### Requirement

- Treat list key strategy as suspect when:
  - index keys are used for dynamic lists,
  - keys are derived from unstable/non-unique fields (timestamps, random IDs,
    collision-prone concatenations),
  - list order/content can reorder, insert, or remove.
- Remediation ladder:
  1. use stable entity identifiers as keys,
  2. if backend lacks stable IDs, map to stable client-side keys at feature
     domain boundary,
  3. for generated placeholder rows (for example skeletons), use deterministic
     keys scoped to render intent.

### Forbidden

- Index keys for dynamic lists where order/content can change.

---

## Rule: Pagination Cursor Must Be Opaque
**Rule ID:** sr-pagination-cursor-opaque  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Opaque cursor semantics prevent duplicate/skip bugs caused by
field-coupled client pagination.
**Covers:** Pagination Cursor Must Be Opaque.
**Index mode:** reference

### Requirement

- Treat pagination as suspect when:
  - next cursor is computed from business fields
    (`createdAt`/`updatedAt`/`id` heuristics),
  - client assumes ordering uniqueness without explicit invariant,
  - "load more" derives cursor from last item fields.
- Remediation ladder:
  1. prefer backend-provided opaque cursor/token,
  2. if field-based pagination is unavoidable, require explicit tie-break
     ordering rules documented in one canonical location and enforce stable sort,
  3. guard merges against duplicates/skips.

### Forbidden

- Treating a single business field as a safe cursor where collisions/reordering
  can occur.

---

## Rule: Component Responsibility Split
**Rule ID:** sr-component-responsibility-split  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents orchestration-heavy god components and keeps ownership
split between hooks and presentation.
**Covers:** Component Responsibility Split.
**Index mode:** reference

### Requirement

- Treat component responsibility as suspect when one component owns two or more
  of:
  - fetching,
  - pagination orchestration,
  - multiple mutations,
  - routing side-effects,
  - heavy derived state,
  - major rendering composition.
- Apply remediation ladder:
  1. move fetching/pagination orchestration into feature hooks,
  2. keep layout/composition in section component,
  3. extract non-trivial row/card rendering into leaf components,
  4. apply mega-file triage ordering when size thresholds are exceeded.

### Forbidden

- Expanding one component to own full data orchestration and UI across multiple
  flows when a hook split is feasible.

---

## Rule: Error Gating Isolation
**Rule ID:** sr-error-gating-isolation  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps failures scoped so unrelated feature flows remain usable and
recoverable.
**Covers:** Error Gating Isolation.
**Index mode:** reference

### Requirement

- Treat error gating as suspect when:
  - one error flag disables unrelated actions,
  - feature-global error state blocks independent requests,
  - retry semantics are unclear due to broad gating.
- Remediation ladder:
  1. scope errors to the owning operation,
  2. ensure retries reset only relevant error state,
  3. for truly global broken states, use explicit boundary component with clear
     recovery.

### Forbidden

- Using one error flag to block unrelated flows in the same screen/feature.
