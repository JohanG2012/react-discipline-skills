## 0. Purpose

This policy defines the **target architecture**, **allowed dependencies**, **defaults**, and **operational constraints** for LLM-driven development in a React + TypeScript codebase.

Goals:
1) Keep UI reusable and side-effect free.  
2) Keep data access predictable and centralized.  
3) Keep domain ownership in features, not in globals.  
4) Prevent “shared/common/utils soup”.  
5) Ensure deterministic behavior: minimal churn, consistent naming, controlled questioning.

Non-goals:
- This policy does not implement code.
- This policy does not mandate tooling changes (ESLint rules may be added separately as a dedicated task).

Repository execution-skill scope for this initiative:
- `react_architecture_detection`
- `react_placement_and_layering`
- `react_reuse_update_new`
- `react_implementation_discipline`

`agent-policy-v1` is the shared baseline policy for all four skills and is not
counted as a production execution skill.

---

## 1. Target Top-Level Architecture

Preferred structure (when not conflicting with existing repo “gravity”):

```

src/
pages/
features/
ui/
primitives/
composites/
api/
client/
dto/
endpoints/
store/          // only if global client-state is needed
core/           // providers, router, query client, app shell
lib/
hooks/          // truly generic hooks only
config/

```

Terminology:
- **Page**: route entry point, thin orchestrator.
- **Section**: feature-owned, domain-aware UI orchestration.
- **Primitive**: dumb UI building block, maximum reuse.
- **Composite**: reusable UI pattern (opinionated UI shape, domain-agnostic).
- **DTO**: raw wire format type from/to API.
- **Domain model**: feature-owned meaning/logic representation.

---

## 2. Dependency Direction Rules

Allowed dependency flow:
- `pages` → `features`, `ui`, `hooks`, `lib`, `core`, `store`
- `features` → `api`, `ui`, `hooks`, `lib`, `store`, `config`
- `ui` → `ui`, `hooks`, `lib` (NOT `api`, NOT `features`, NOT `store`, NOT `pages`)
- `api` → `api`, `config`, optionally `lib` (NOT `react`, NOT `ui`, NOT `features`, NOT `pages`, NOT `store`)
- `store` → `lib`, `config`, optionally `api` (NOT `ui`, NOT `pages`)
- `core` → any (composition/setup only; avoid domain logic)
- `hooks` → `lib`, optionally `ui` for UI-related hooks (NOT `api` unless explicitly allowed by repo conventions; prefer feature hooks)
- `lib` → `lib` only (pure; no React; no API calls)
- `config` → `config`, optionally `lib`

Forbidden examples:
- `ui/**` importing from `features/**` ❌
- `ui/**` importing from `api/**` ❌
- `api/**` importing React or anything from `ui/**` ❌
- `lib/**` importing React ❌
- `features/**` importing from `pages/**` ❌
- `pages/**` importing directly from `api/endpoints/**` ❌ (must go through feature hooks)

---

## 3. Ownership & Placement Rules

### 3.1 pages/
- Purpose: route entry points, thin orchestration.
- Must not: fetch data directly; contain heavy domain logic; render huge markup trees.
- Should: compose sections; handle route params; top-level error boundaries if needed.

### 3.2 features/
- Purpose: domain ownership (tasks/projects/finance/etc).
- Contains: sections, feature hooks, domain logic, adapters/mappers, feature-local state.
- Must not: depend on routing layer (`pages/**`); define UI primitives; implement generic UI patterns that belong in `ui/composites`.

### 3.3 ui/primitives/
- Purpose: dumb UI components (Button, Input, Card).
- Must not: include domain naming/behavior; fetch; import from features/api/store/pages.
- Should: accept `className?: string` (unless not applicable); implement baseline a11y.

### 3.4 ui/composites/
- Purpose: reusable UI patterns (FilterBar, ModalShell, DataTableShell, MasterDetailLayout).
- Must not: include domain naming/behavior; import from features/api/store/pages; include business rules.
- **Hard rule:** no domain mode flags (e.g., `variant="tasks|projects"` is forbidden).

### 3.5 api/
- Purpose: transport-only backend access (no React).
- `api/client/`: HTTP client wrapper, auth header injection, retries, base URL.
- `api/dto/`: DTO types (wire format), optionally DTO validation schemas if chosen.
- `api/endpoints/`: endpoint functions returning DTOs; no React Query, no hooks; no DTO→domain mapping.

### 3.6 store/
- Purpose: global **client-state** only (prefs, auth session, global UI flags).
- Must not: store server-state as source of truth (prefer TanStack Query cache).
- Must not: import UI.

### 3.7 core/
- Purpose: app wiring (providers, router setup, query client, app shell).
- Must avoid: domain logic implementation.

### 3.8 lib/
- Purpose: pure, framework-agnostic utilities.
- Must not: import React; call API; encode feature-specific domain logic.

### 3.9 hooks/
- Purpose: cross-domain generic hooks only (debounce, media query, local storage).
- Feature hooks belong in `features/<domain>/hooks/`.

### 3.10 config/
- Purpose: env/config/flags and route constants (paths).
- **Hard rule:** env access is centralized (see §9.2).

---

## 4. Migration & “Follow Gravity” Policy

### 4.1 Gravity Policy Strength
Mode: **Balanced** (default)

Rules:
1) **Never create a second home** for the same concern (UI/API/store/routing).  
2) If the repo already has a clear home for a concern, **follow it**.  
3) If there is **no clear home**, establish the preferred structure as the new home.  
4) Allow small migration only when explicitly enabled (see §8).

### 4.2 Strategy Selection (used by Architecture Detection)
- `follow-existing`: repo has clear structure; avoid duplicates; small/urgent tasks.
- `introduce-boundaries`: repo is flat/messy; introduce preferred structure for new domain modules without refactoring existing code.
- `migrate-as-you-touch`: only when explicitly enabled; move limited files while modifying them.

---

## 5. Output & Verbosity Policy

### 5.1 Plans (Skills 1–3)
- Output format: **single JSON object** (machine-consumable) with a `notes[]` field.
- `notes[]` max length: **5** items.
- No long prose outside the JSON object.

### 5.2 Implementation (Skill 4)
Default:
- Updated files: **changed snippets only** (show only modified blocks).
- New files: **full file content**.

Fallback:
- Use **unified diff** if changes are scattered across a file (imports + exports + multiple regions) such that snippets could be misapplied.

Never:
- Output full existing files unless explicitly requested or file is tiny and fully changed.

---

## 6. Question / Pause Policy (Confidence Threshold)

A skill may pause to ask the user only if:

**(confidence < 0.7) AND (decision impact is structural)**

Structural impact includes:
- creating/renaming top-level folders
- creating a second home for UI/API/store/routing
- changing dependency direction rules
- moving files across architectural layers
- introducing global state
- changing server-state approach
- adding new dependencies
- touching >6 files unexpectedly

Otherwise:
- proceed with deterministic defaults (see §7).

Pause protocol (when asking):
1) state ambiguity clearly
2) present 2–3 options
3) recommend one default
4) stop and wait

---

## 7. Deterministic Defaults (When Not Asking)

When ambiguous and not structural-impact:
- Feature owner: choose the most specific domain mentioned.
- Reuse vs generalize: **duplicate sections** rather than adding flags to composites.
- State: prefer local state → feature state → global store (in that order).
- Data fetching: prefer `api/endpoints` + feature hooks; never fetch in UI.
- Folder placement: follow gravity map; if none, use preferred structure.
- Performance: readability first; optimize only when needed.
- Error UI: inline error with retry for queries; mutation feedback follows repo pattern.

---

## 8. File Movement Policy

Default: **No moves/renames**.

Moves are allowed only when explicitly enabled (migration task or user instruction) with constraints:
- max moved files per task: **3**
- must update all imports
- must not create duplicate homes
- must provide a move plan (old → new) before applying

---

## 9. Canonical Tech Choices (Defaults-Only)

Rule: follow existing repo choices if detectable; otherwise use these defaults.

### 9.1 Server-state
Default: **TanStack Query (React Query)**

### 9.2 Client-state
Default: local-first; use **Zustand** only for truly global client-state.

### 9.3 Routing
Default (plain React): **React Router**  
If Next.js detected: follow Next.js router conventions.

### 9.4 Styling
Default: Tailwind (greenfield only).  
Never introduce a new styling system mid-repo unless explicitly requested.

### 9.5 Forms
Default: **react-hook-form** (if forms are needed and no existing approach is present).

### 9.6 Validation
Default: **Zod** (selective boundary validation; see §10.2).

### 9.7 HTTP client
Default: native `fetch` via `api/client` wrapper.

### 9.8 UI library
Default: none.  
If repo uses a UI library (e.g., shadcn/ui, MUI), follow it.

---

## 10. Data & API Policies

### 10.1 Where data fetching happens
- HTTP calls happen only in `api/endpoints/**` (or gravity-equivalent).
- Feature hooks call endpoints.
- Sections call feature hooks.
- Pages compose sections.

### 10.2 DTO validation
Policy: **selective boundary validation**.
- Validate critical/unstable endpoints (auth, core flows, permission-sensitive).
- Skip validation for stable, tightly-coupled internal endpoints.
- DTO shape validation lives in `api/dto/**`.
- Domain invariants validation lives in `features/<domain>/domain/**`.

### 10.3 Error handling standard
- `api/client` normalizes errors into `ApiError`:
  - `{ status?: number; code?: string; message: string; details?: unknown; cause?: unknown }`
- Endpoints throw `ApiError` (no UI).
- Feature hooks surface error shape consistently (no UI).
- Sections/pages render errors (inline with retry). Toasts reserved for mutation feedback if repo uses them.

### 10.4 Retry policy
- Queries (GET): retry only for network errors / 5xx; cap retries (e.g., 2).
- Mutations: no automatic retry by default.

### 10.5 Cancellation
- Endpoint wrappers support optional `AbortSignal` where feasible.

---

## 11. Naming Conventions

### 11.1 Components and exports
- Components: PascalCase file names and symbols.
- Prefer **named exports** everywhere.
- Allow default exports only where framework forces it or repo convention demands it.

### 11.2 Pages vs Sections vs Hooks
- Pages: `XPage.tsx` in `src/pages/` (or framework routing file names as required).
- Sections: `XSection.tsx` in `features/<domain>/sections/`.
- Hooks: `useXxx.ts` one hook per file.

### 11.3 API naming
- Endpoints: `api/endpoints/<resource>.ts` exporting `getX`, `createX`, etc.
- DTO types: `XxxDto` suffix, grouped per resource in `api/dto/<resource>.dto.ts` (default).

### 11.4 Barrels (index.ts)
Default: avoid barrels unless repo already uses them consistently.

---

## 12. File Size & Complexity Guidelines (Soft Caps)

Soft caps (warn-level mindset):
- pages: 120–150 lines
- feature sections: 200–250
- feature hooks: 150–200
- ui/primitives: 150
- ui/composites: 200–250
- api/endpoints: 80–120
- lib: 120–200
- core: 150
- store slices: 150–250

Red flags:
- >400 lines: architecture smell, split recommended
- >600 lines: refactor required before proceeding

---

## 13. Scope Governor

Default limits:
- max files touched: **8**
- max new files: **4**
- max moved/renamed files: **0** (unless migration enabled)
- new dependencies: **0** (must be explicitly requested)
- new top-level folders: **0** (must be explicitly requested)

If limits would be exceeded:
- implement the smallest viable change within caps
- return a structured “scope expansion needed” list

---

## 14. Logging Policy

- `console.*` is forbidden in committed code by default.
- Use `lib/logger.ts` wrapper (`logger.debug/info/warn/error`).
- Console is allowed only inside `lib/logger.ts` (if needed).

---

## 15. Environment / Config Access Policy

- All environment access must go through `config/env.ts`.
- No `process.env.*` or `import.meta.env.*` outside `config/env.ts`.

---

## 16. Codegen Policy

Default: **no code generation**.  
If adopted later:
- generated clients live in an isolated folder (e.g., `api/client/generated/**`)
- handwritten endpoints wrap generated code to preserve boundaries.

---

## 17. Storybook / UI Docs Policy

Default: no Storybook requirement.  
If Storybook exists:
- add stories for new primitives/composites when relevant (lightweight).

---

## 18. Definition of Done (DoD)

Always required:
- boundary audit passed (no forbidden imports)
- fetch is only in endpoints (or gravity-equivalent)
- loading/error/empty states handled where applicable
- minimal churn: only planned files touched (exceptions explained)
- scope governor respected (or scope expansion reported)

Required if tooling available:
- TypeScript compile succeeds (tsc/framework equivalent)
- ESLint passes

Tests:
- Add/update tests only if the repo already has a test harness, or if logic is critical and harness exists.

---

## 19. Enforcement Heuristics

A file is likely in the wrong place if:
- it imports from a forbidden layer
- it contains domain naming but lives under `ui/**`
- it calls HTTP directly outside endpoints
- it uses React Query outside feature hooks (except provider setup in core)
- pages import endpoints directly

---

## 20. Policy Evolution

- Any change to this policy increments version (v1 → v2).
- Policy changes are explicit and should not be auto-edited by agents unless requested.
- Shared-policy exceptions require repo maintainer approval and explicit rationale.
- Shared-policy exceptions must not include expiry metadata; they remain active
  until explicitly revoked or superseded by a newer policy version.

---
