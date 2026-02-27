# Side Effects, Error Handling, JSX Density, Time Semantics, Hidden Controls

## Summary
Adds hard governance for browser side-effect boundaries, catch-block handling,
JSX logic density, time-derived state semantics, and hidden interactive control
accessibility behavior.

---

## Rule: Browser Side-Effects and Routing Boundary
**Rule ID:** sr-browser-side-effects-boundary  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents hidden routing/app side-effects from leaking into
UI/feature components and keeps navigation/history ownership deterministic.

### Requirement

- Direct browser side-effect APIs must stay in explicit boundaries:
  - allowed homes:
    - `src/pages/**` (route orchestration),
    - `src/core/**` (app wiring/infrastructure),
    - `src/lib/**` (pure helpers only; no direct side effects),
    - `src/hooks/**` (generic cross-domain hooks only when documented).
- Feature UI components (`features/**/sections/**`, feature components, `ui/**`)
  must treat navigation/history/event dispatch as inputs or call approved
  boundary helpers.
- Side-effect API examples covered by this rule include:
  - `window.history.*`,
  - `window.location.*` (including hash),
  - `window.dispatchEvent`, `CustomEvent`,
  - imperative `document.*` operations (except ref-safe measurement and
    interaction support),
  - direct `localStorage`/`sessionStorage` unless canonical helper/hook policy
    explicitly allows boundary access.
- Allowed exceptions:
  - `ui/**` DOM interaction for accessibility/interaction only (focus
    management, layout measurement via refs, event propagation control),
  - feature components can request navigation via callback props from
    pages/sections or a single documented canonical navigation helper/hook.
- Deterministic default:
  - lift navigation/refresh side effects to `pages/**` or `core/**`,
  - otherwise use one documented boundary helper in exactly one canonical policy
    location.

### Forbidden

- `ui/**` directly calling `window.history`, `window.location`, or dispatching
  global events.
- Feature components mutating URL/history directly outside `pages/**`.
- Adding new global custom-event names without explicit architectural request
  and ownership documentation.

---

## Rule: Empty Catch and Swallowed Error Discipline
**Rule ID:** sr-no-empty-catch  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Silent failures destroy debuggability and make behavior
nondeterministic.

### Requirement

- `catch {}` and empty `catch (e) {}` blocks are not allowed.
- Every caught error must do one explicit outcome:
  1. handle/recover,
  2. log via repository logger abstraction (`lib/logger.ts` or canonical
     equivalent),
  3. rethrow,
  4. ignore only with a short safety rationale comment and only for truly
     non-impactful best-effort behavior.
- Swallowing is allowed only when both are true:
  - operation is best-effort and non-critical,
  - short comment explains safety rationale.
- Deterministic default:
  - when unsure, log (`warn` or `error` based on user impact) and continue with
    safe fallback.

### Forbidden

- Empty catch blocks.
- Swallowing errors in transport/endpoint layers (`api/**`) without
  normalization.
- Swallowing errors for business-critical flows (mutations, persistence, auth).

---

## Rule: JSX Logic Density and Handler Extraction
**Rule ID:** sr-jsx-logic-density  
**Priority:** SHOULD  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents JSX from becoming an execution script and improves
readability/testability without premature performance optimization.

### Requirement

- JSX should remain declarative; readability takes precedence over referential
  purity ceremony.
- Allowed inline patterns:
  - inline arrow functions that delegate to named handlers,
  - single-expression inline calls with no hidden control flow.
- Extraction is required in touched code when any are true:
  - handler contains branching or multiple statements,
  - component JSX contains more than about four inline arrow handlers,
  - inline handler contains domain logic,
  - inline handler exceeds one screen line in practical readability terms,
  - inline handler contains async work or multi-step side effects.
- Deterministic default:
  - extract to a named `handleX` function for readability,
  - do not introduce `useCallback` unless referential stability is truly
    required by memoized children or equivalent constraints.

### Forbidden

- Multi-branch or async logic embedded directly inside JSX handlers.
- Repeating complex inline functions across sibling elements.
- Extracting handlers reflexively into `useCallback` without a real stability
  need.
- Async IIFEs inside JSX handlers.

---

## Rule: Time and "Now" Semantics in Derived State
**Rule ID:** sr-time-derived-state  
**Priority:** SHOULD  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents hidden time dependencies that create stale values,
flaky tests, and inconsistent behavior.

### Requirement

- Logic that depends on current time must use explicit semantics:
  - snapshotted now (captured once), or
  - live now (explicit tick/clock source).
- Allowed patterns:
  1. snapshot now once per open/session/action and use that stable value in
     derived computations,
  2. live now from existing `useNow()`/tick hook or parent-owned clock input.
- Deterministic default:
  - prefer snapshot-now for menus/transient interactions unless live updates are
    explicitly required.

### Forbidden

- Calling `new Date()` inside memoized logic without explicit snapshot/live
  ownership.
- Time-dependent behavior changing across renders without owned time source
  semantics.

---

## Rule: Hidden Interactive Controls and Accessibility Contract
**Rule ID:** sr-hidden-interactive-controls  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents invisible/focus-trap controls and accessibility
regressions from CSS hiding patterns.

### Requirement

- When interactive elements are visually hidden (`hidden`, `opacity-0`,
  `sr-only`, similar), focusability/clickability must be intentional:
  - if non-interactive while hidden, remove from interaction path (conditional
    render or remove tab focus and equivalent accessibility signaling),
  - if screen-reader-only, use proper `sr-only` patterns, not `hidden`.
- Hover-revealed controls are allowed only when keyboard users can reach them as
  intended or equivalent focus reveal patterns exist.
- Deterministic default:
  - prefer conditional rendering when control should not exist while hidden.

### Forbidden

- Hidden interactive controls left in DOM as active controls without explicit
  accessible reveal strategy.
- Controls hidden from users but still carrying active click/focus behavior.
