# Master Spec: 005 React Implementation Discipline

This document aggregates sections that map to spec `005-skill-react-implementation-discipline`.

## Contents

- [Document Structure](#document-structure)
- [Appendix A: Shared Project Setup and Tooling](#appendix-a-shared-project-setup-and-tooling)
- [Appendix B: Relevant Specs/Skills Repository Layout](#appendix-b-relevant-specsskills-repository-layout)
- [Consolidated Additions](#consolidated-additions)
- [Product Scope (v1)](#product-scope-v1)
- [Top-level Structure](#top-level-structure)
- [Import Rules (Dependency Direction)](#import-rules-dependency-direction)
- [Folder Specs](#folder-specs)
- [Enforcement Heuristics](#enforcement-heuristics)
- [File Size Guidance](#file-size-guidance)
- [Definition of Done Checks](#definition-of-done-checks)
- [Agent Access and Change Control](#agent-access-and-change-control)
- [Scope Governor](#scope-governor)
- [Skill Model](#skill-model)

---
## Document Structure

- The normative implementation-discipline baseline begins at
  `## Consolidated Additions` and continues through the end of this document.
- Appendix sections below were migrated from former project-structure baseline docs to keep
  setup and layout context co-located with this spec.
- Shared cross-spec entities used by specs `002`-`005` are:
  - `skills/.shared/policy/` (shared policy baseline)
  - `skills/.shared/templates/` (shared templates)
  - `skills/.shared/schemas/` (shared base schemas)
- If appendix text ever conflicts with normative spec text, the normative
  sections take precedence.

## Appendix A: Shared Project Setup and Tooling

### Build requirements

#### Goals

- Ensure every skill has:
  - `SKILL.md` with frontmatter
  - `AGENTS.md` generated from `rules/`
- Ensure `AGENTS.md` is up to date in PRs
- Optionally validate example JSON outputs against schemas

#### Node version

- Use Node `20` LTS.

### `package.json` recommended scripts

```json
{
  "name": "react-discipline-skills",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "npm run build:agents",
    "build:agents": "node tools/build/compile_agents.mjs",
    "check": "npm run check:agents && npm run check:frontmatter && npm run check:examples",
    "check:agents": "node tools/build/compile_agents.mjs --check",
    "check:frontmatter": "node tools/build/validate_frontmatter.mjs",
    "check:examples": "node tools/build/validate_examples.mjs"
  }
}
```

Notes:

- `build:agents` writes `AGENTS.md`.
- `check:agents` runs in `--check` mode and fails if generated output differs.

### Build script spec: `compile_agents.mjs`

#### Responsibilities

For each production skill under `skills/*/` and the shared baseline at
`skills/.shared/policy/`:

1. If it has `rules/`:
   - read files in lexicographic order
   - concatenate into `AGENTS.md`
   - generate TOC from headings (recommended)
   - prepend a `DO NOT EDIT` header
2. Support:
   - `--check` mode: do not write; compare expected vs existing `AGENTS.md` and
     exit non-zero if different
   - default mode: write changes

#### Behavior requirements

- Deterministic ordering
- Stable TOC generation
- Preserve newline normalization (`\n`)
- Only touch `AGENTS.md` files

### Script spec: `validate_frontmatter.mjs`

#### Responsibilities

For each production `skills/*/SKILL.md` and `skills/.shared/policy/SKILL.md`:

- parse frontmatter
- require keys:
  - `name`
  - `description`
  - `version`
  - `license`
  - `metadata.category`
  - `metadata.stability`
- fail if missing

### Script spec: `validate_examples.mjs`

#### Responsibilities

If `schemas/output.schema.json` exists in a skill folder:

- validate every `examples/*.json` file against it
- fail on mismatch

### GitHub Actions CI baseline

Use `.github/workflows/ci.yml` to:

- install dependencies
- run `npm run check` (generated `AGENTS.md` freshness, frontmatter validation,
  and example validation)

Recommended baseline:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Check generated agents + validate skill metadata
        run: npm run check
```

Optional policy: do not auto-commit generated files in CI. Prefer failing the
build and requiring `npm run build:agents` locally.

### Developer workflow baseline

1. Edit `rules/*.md` (source of truth).
2. Run `npm run build:agents`.
3. Commit:
   - updated `AGENTS.md`
   - rule changes

CI should fail if `AGENTS.md` is stale.

## Appendix B: Relevant Specs/Skills Repository Layout

```text
repo/
  skills/
    .shared/
      policy/
        SKILL.md
        rules/
        AGENTS.md
        examples/
          policy_usage.example.md
        schemas/
          policy.schema.json
      templates/
        00_OVERVIEW_TEMPLATE.md
        SKILL_TEMPLATE.md
        AGENTS_TEMPLATE.md
        RULE_TEMPLATE.md
      schemas/
        skill_base.schema.json
    react-implementation-discipline/
      SKILL.md
      rules/
        00_overview.md
        10_<topic>.md
        20_<topic>.md
      AGENTS.md
      examples/
        diff.example.patch
      schemas/
        output.schema.json
  specs/
    001-agent-policy-v1/
      master_spec.md
    002-skill-react-architecture-detection/
      master_spec.md
    003-skill-react-placement-layering/
      master_spec.md
    004-skill-react-reuse-update-new/
      master_spec.md
    005-skill-react-implementation-discipline/
      master_spec.md
      spec.md
      plan.md
      tasks.md
      research.md
      data-model.md
      quickstart.md
      implementation-tracker.md
      contracts/
        implementation-discipline-output-contract.md
        implementation-discipline-output.schema.json
  tools/
    build/
      compile_agents.mjs
      validate_frontmatter.mjs
      validate_examples.mjs
```

> Normative implementation-discipline baseline starts below.



## Consolidated Additions

The following implementation-skill details are retained from legacy guidance
and aligned to the current `005` contract.

### Implementation Skill Inputs

Required inputs per run:

- `revised_plan`: approved plan with file targets/actions and layer intent.
- `detection_result`: architecture context and repository-convention signals.
- `reuse_decisions`: finalized reuse/update/new decisions and constraints.
- `repo_context`: repository read/search context needed for convention/boundary
  validation.

Optional inputs:

- `diff_preference` (snippet-first vs unified-diff preference).
- `strictness` (`strict` default, optional relaxed mode when explicitly
  allowed).
- `max_lines_policy` overrides (when explicitly provided).

### Implementation Output Mode Baseline

Implementation output should stay review-friendly and machine-consumable:

- existing-file updates default to patch/snippet output
- use unified diff when edits are multi-region or high-risk to misapply
- new files return full content
- avoid returning unrelated full existing files

Strict result-type/schema/validation-summary behavior is governed by the `005`
contract and schema artifacts.

### Implementation Sequence Guidance

Preferred bottom-up implementation sequence:

1. `api/dto` types
2. `api/endpoints` transport functions
3. feature domain/adapters
4. feature hooks
5. shared UI updates (when required)
6. feature sections
7. pages

This ordering minimizes rework and keeps data-flow ownership predictable.

### Hard Stop Conditions

Stop and revise before final output when implementation would require:

- domain knowledge in shared `ui/**`
- endpoint fetching outside canonical endpoint ownership
- leaky shared-composite generalization beyond safe thresholds
- touched files above 400 lines without extraction/split path
- touched files above 600 lines

If unresolved, return blocked output with required fixes instead of forcing a
non-compliant implementation path.

### Implementation Non-goals

- no repo re-architecture during routine implementation
- no unrelated cleanup refactors/renames
- no new tooling/dependency introductions unless explicitly requested
- no upstream planning-decision redefinition

## Product Scope (v1)

This repository's production scope is fixed to four execution skills:

1. `react-architecture-detection`
2. `react-placement-and-layering`
3. `react-reuse-update-new`
4. `react-implementation-discipline`

`agent-policy-v1` is the shared policy baseline for these four skills and is
not counted as a production execution skill.


## Top-level Structure

```text
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
  store/
  core/
  lib/
  hooks/
  config/
```


## Import Rules (Dependency Direction)

Definition: the "canonical endpoint layer" means `api/endpoints/**` or the gravity-detected equivalent API module (for example `src/services/api/**` in legacy repositories).
The canonical endpoint layer is determined once per task by Architecture Detection and must be reused consistently in all boundary checks and enforcement logic for that task.

Allowed dependency flow:

- `pages` -> `features`, `ui`, `hooks`, `lib`, `core`, `store`
- `features` -> `api`, `ui`, `hooks`, `lib`, `store`
- `ui` -> `ui`, `hooks`, `lib` (NOT `api`, NOT `features`, NOT `store`, NOT `pages`)
- `api` -> `api` (and possibly `config`) (NOT `react`, NOT `react-dom`, NOT `ui`, NOT `features`, NOT `pages`, NOT `store`)
- `store` -> `lib`, `config` (optionally `api` if you must) (NOT `ui`)
- `core` -> everything (composition/setup only)
- `hooks` -> `lib` (and `ui` only if UI-related hook like `useMediaQuery`) (NOT `features`, NOT `pages`, NOT `store`, NOT `api` unless documented in exactly one canonical policy location (for example `ARCHITECTURE.md` or `src/config/agentOverrides.ts`))
- `lib` -> `lib` (pure only)
- `config` -> `config` (and `lib`)

Forbidden dependency examples:

- `ui/**` importing from `features/**`
- `ui/**` importing from `api/**`
- `ui/**` importing from `pages/**`
- `api/**` importing React or anything from `ui/**`
- `api/**` importing from `pages/**` or `store/**`
- `lib/**` importing React
- `features/**` importing from `pages/**` (features must not depend on routing)
- `pages/**` importing from the repository's canonical endpoint layer (`api/endpoints/**` or gravity-equivalent API home) directly (use feature hooks)
- `hooks/**` importing from `features/**`, `pages/**`, `store/**`, or `api/**` unless documented in exactly one canonical policy location (for example `ARCHITECTURE.md` or `src/config/agentOverrides.ts`)

Alias policy for import boundaries:

- If a path alias (for example `@/`) exists, all boundary/import rules apply equally to both `src/**` and alias paths.
- If no path alias exists, do not introduce one unless explicitly requested.

Generic fetch-hook exception policy:

- The only exception allowing `hooks/**` to import from `api/**` is a documented generic fetch-hook convention.
- That convention must be documented in exactly one canonical policy location (for example `ARCHITECTURE.md` or `src/config/agentOverrides.ts`).
- Multiple competing policy locations invalidate the exception.
- If no such canonical documentation exists, `hooks/**` -> `api/**` remains forbidden.
- The generic fetch-hook exception is defined once and referenced everywhere; no implicit exceptions exist.


### Search for Existing Implementations

#### Existing Domain Modules

- Check whether `features/<domain>/` already exists.
- Reuse existing `sections/`, `hooks/`, and `domain/` folders before adding new modules.

#### Existing UI Building Blocks

- Search existing primitives (Button/Input/Card/etc.) and composites (FilterBar/TableShell/ModalShell/etc.) first.

#### Existing API Capabilities

- Follow existing `api/client/` usage patterns.
- Reuse endpoint modules in `api/endpoints/` and DTOs in `api/dto/` where possible.

#### Existing State Patterns

- For server-state, confirm React Query conventions and QueryClient wiring in `core/`.
- For client-state, follow current `store/` or local-state conventions already used by the domain.

#### Naming Conventions and Exports

- Match established file naming, export style, error handling style, and DTO/domain typing style.
- Do not invent a new style when an existing pattern already exists.
- If naming is unclear, file names must still encode what the module is (for example `XPage`, `XSection`, `useXxx`, `*Dto`).
- Use one concept per role and avoid mixed synonyms in the same repo (for example pick one of `Page`/`Route`/`Screen` and stay consistent).
- Prefer searchable names where file name and primary export match so `rg <Name>` finds both quickly.
- Keep naming deterministic for discovery workflows:
  - `*Page.tsx` for pages
  - `*Section.tsx` for feature sections
  - `use*.ts` for hooks
  - `*.dto.ts` + `*Dto` for DTOs
  - `api/endpoints/*` for endpoint modules
- Prefer named exports for components, hooks, utilities, and page modules to reduce rename/import drift.
- Allow `export default` only when framework conventions require it (for example Next.js route modules) or when the existing local area already uses default exports consistently.
- Use `PascalCase` for React component files and component exports.
- Use `useXxx` camelCase for hook files and hook exports, with file name matching hook name.
- Avoid dotted suffix conventions like `.page.tsx` or `.route.tsx` unless framework rules or existing repo conventions already require them.
- Keep tests colocated with source using `*.test.tsx` for components and `*.test.ts` for non-UI modules/utilities.
- Default to explicit imports and avoid introducing new barrel files (`index.ts`) unless the repo already uses them consistently.
- If an area already uses barrels, keep usage consistent within that area and avoid mixing barrel and deep-path imports unpredictably.


### Change Planning Output

Before code changes, provide:

#### File Touch Plan Format

- A clear list of planned file actions (`Create`, `Update`, `Reuse`).
- Include concrete file paths/modules for each action.
- If any file move/rename is planned, include `old path -> new path` and explicit import-update targets before applying changes.

#### Layer Justification

- Add 1-2 sentences per touched layer.
- Explain why the layer is correct and why adjacent layers were not chosen.

#### Reuse Decision Notes

- For each reused or updated existing module, explicitly mark `reuse as-is`, `updated`, or `new`.
- Include a short reason for each decision.

#### Structured Plan Output (JSON + Notes)

- Planning output should be structured first, with compact explanatory notes.
- Use a machine-readable JSON object plus a `notes[]` field.
- Keep `notes[]` concise (max five items) and include only high-leverage information:
  - Major tradeoffs.
  - Material uncertainties.
  - Constraints that influenced placement.
  - Important risks avoided.

#### Implementation Output Format

- Updated files: default to changed snippets only.
- Automatically switch to unified diff when:
  - Edits span multiple non-adjacent regions in one file.
  - Changes touch imports, exports, and logic together.
  - Snippets are likely to be misapplied without stronger patch context.
- New files: output full file content.
- Existing files: do not output full file content unless explicitly requested, or the file is very small (about under 60 lines) and the whole file changed.
- If a new file exceeds about 250 lines, prefer splitting responsibilities rather than outputting a giant file.


### Guardrails Against Chaotic Changes

Avoid:

- Inline utility functions in pages/sections when they belong in `domain/` or `lib/`.
- New `shared/` or `common/` dumping-ground folders.
- Fetching inside hooks that bypasses `api/endpoints`.
- Mega components with many mode/flag props.
- "Refactor for future" changes without immediate value.
- Mixing structural migration moves with feature behavior work in one task unless explicitly requested.


### Migration-aware Prime Directive

- Do not introduce a second architecture in parallel.
- Either follow the current structure or introduce the target structure in a clearly isolated migration step.
- Avoid "half-half" placement where old and new architecture are mixed in the same feature scope without a migration boundary.
- Treat the target architecture as a direction to converge toward, not as a reason to break local consistency.
- Optimize for local consistency now and gradual convergence over time.


### Migration Strategy Selection

Choose one strategy per change:

#### Strategy A Follow Existing

Use when:

- The repo already has a clear local pattern.
- Structural migration would add churn.
- The task is small or urgent.

Rule: place new files where similar files already live.

#### Strategy B Introduce Target Structure at Boundaries

Use when:

- The repo is messy/flat or only partially structured.
- You can introduce the target structure without breaking current mental models.
- The new structure can stay isolated and self-consistent.

Rule: introduce target structure only for new domain modules while leaving old areas untouched.

#### Strategy C Migrate as You Touch

Use when:

- Standardization is already underway.
- You are already editing that area.
- Moving code reduces confusion immediately.

Rule: move code only when touching it and when the move creates immediate clarity; avoid mass relocation unless explicitly requested.

#### Default Strategy Profile Balanced

Use this profile by default unless the user explicitly selects another migration mode.

- Never create a second home for the same concern.
- If no strong gravity exists for a concern, establish one preferred home and keep new work there.
- Introduce target structure at feature/route boundaries only when it does not create competing homes.
- Default mode: no file moves/renames. Create new files and update existing files in place.
- Enable move/rename operations only when explicitly instructed for that task.
- When move mode is explicitly enabled, use migrate-as-you-touch only for small, immediate-clarity moves (default: about three files or fewer), with complete import updates in the same change.
- In a single move-enabled task, do not move files across multiple concerns at once (for example UI + API + pages).

#### Task Type Split (Feature vs Migration)

- Feature task: no moves/renames; only additions and updates.
- Migration task: moves/renames allowed only in explicit migration scope, with complete import updates.
- Do not mix feature behavior changes with structural migration in one task unless explicitly requested.


### Clarification and Pause Rules

Use questions sparingly. Default to execution.

#### When to Pause

Pause and ask only if at least one is true:

1. You cannot proceed safely without clarification.
2. Multiple architectural paths are equally valid.
3. The choice would create long-term structural impact.

Otherwise, proceed using deterministic defaults.

#### Architecture Detection Pause Triggers

Ask only when architecture detection is genuinely ambiguous, for example:

- Mixed routing systems (for example both Next-style and React Router patterns).
- Competing UI homes (for example both `components/` and `ui/` as active roots).
- Competing API homes (for example both `api/` and `services/` as active roots).
- Repository size/shape prevents confident classification.

If confidence is high, do not pause.

#### Placement and Layering Pause Triggers

Ask only when ownership cannot be inferred safely, for example:

- Feature owner is unclear.
- A change appears cross-domain but is not clearly infrastructure.
- Creating a new feature home may conflict with existing gravity.

If ownership is clear, place directly and proceed.

#### Reuse vs Update vs New Pause Triggers

Ask only when intent is unclear and structural cost is meaningful, for example:

- Updating an existing composite likely requires several new props/options.
- It is unclear whether behavioral divergence is intentional.
- UX differences might be deliberate and long-lived.

If abstraction cost is clearly high, default to a feature-local section/module instead of forcing generalization.

#### Execution and Validation Pause Triggers

Implementation should almost never pause. Pause only when:

- The planned change violates import rules and no clean alternative exists.
- The target area contains conflicting patterns that block safe placement.
- Scope expands unexpectedly and cannot be safely reduced to the scope-governor minimum change path.

Otherwise, implement.

#### Optional Pause Modes

Use `balanced` by default unless user configuration says otherwise:

- `strict`: pause on any structural ambiguity.
- `balanced` (default): pause only when both `confidence < 0.7` and `impact = structural`.
- `autonomous`: pause only when both `confidence < 0.5` and `impact = structural`.


### When Not to Ask

Do not pause for minor decisions, including:

- Minor naming choices.
- Small harmless prop additions.
- Cases where the repository pattern is already clear.
- Cases where a safe default exists.
- Whether to apply tiny micro-optimizations (for example `useMemo` in non-critical paths).
- Tiny refactors that do not affect architectural boundaries.
- Styling details when style conventions are already clear.
- Component naming when a local naming pattern already exists.

Over-asking reduces delivery flow and should be treated as a failure mode.


### Rule of Deterministic Default

Each skill should have a deterministic default bias:

| Situation | Default Action |
| --- | --- |
| Ambiguous feature owner | Pick the most specific domain |
| UI pattern unclear | Keep logic in the feature section |
| Reuse vs generalize unclear | Duplicate section-level implementation |
| Multiple state options | Prefer local state first |
| Unsure about store usage | Avoid adding global store state |
| Unsure about abstraction | Keep implementation concrete |
| API placement unclear | Use the existing API home |
| Folder placement unclear | Follow gravity and nearest established home |
| Naming unclear | Match nearest neighbor naming |

Ask only when the wrong default choice would create structural debt.


### Clean Pause Protocol

When pausing for clarification:

1. State the ambiguity clearly.
2. Present two or three concrete options.
3. State the recommended default.
4. Stop and wait for confirmation.

Keep pauses terse and non-rambling.


### Question Quality Filters

Do not ask:

- Vague questions (for example "How should this be structured?").
- Philosophical architecture questions during implementation.
- Style questions when the repository already shows a consistent style.

Questions must be:

- High-leverage.
- Structural.
- Blocking.


### Final Pause Threshold

Pause only when the cost of guessing wrong is greater than the cost of interrupting.

Operational rule:

- Pause only if both are true:
  - `confidence < 0.7`
  - `impact = structural`
- `confidence` in pause logic is decision-safety confidence and is separate from gravity confidence used for placement.

Structural impact includes decisions that would:

1. Create or rename a top-level folder.
2. Introduce a second competing home for the same concern (for example UI/API/store).
3. Change dependency-direction rules.
4. Move files across architectural layers.
5. Generalize shared composites using domain flags.
6. Introduce new global store state.
7. Change server-state strategy (for example React Query vs store ownership).
8. Exceed scope-governor hard limits without explicit override.

Pause decision matrix:

| Confidence | Impact | Action |
| --- | --- | --- |
| `>= 0.7` | Any | Proceed |
| `< 0.7` | Local | Proceed with deterministic default |
| `< 0.7` | Structural | Pause and ask |


### Fallback Technology Defaults

Use these only when the repository is new or ambiguous for the concern.

#### Golden Rule

- If the repository already uses a stack/convention, follow it.
- Only apply defaults when there is no clear existing home or convention.

#### Server-state

- Default: TanStack Query (React Query).
- React Query cache (or repository-equivalent server-state cache) is the canonical source of server-state.
- Keep query hooks in `features/<domain>/hooks/`.
- Keep transport calls in `api/endpoints/`.
- Keep DTO-to-domain mapping in `features/<domain>/domain/` or `features/<domain>/adapters/`.
- Global store must not mirror server data unless explicitly justified by one of:
  - Performance-critical caching.
  - Offline-first requirement.
  - Explicit architectural decision for that repository.

#### Client-state

- Default: local state first.
- Use `store/` for truly global state (for example cross-route or app-wide state).
- Prefer Zustand for lightweight global client state unless an existing store stack is already established.
- Do not mirror server-state into global store unless explicitly justified by performance-critical caching, offline-first requirements, or an explicit architectural decision.

#### Routing

- Default for plain React apps: React Router.
- If the repo is a Next.js app, follow Next.js App Router conventions.
- Do not introduce a competing routing model in the same codebase.

#### Styling

- Default for greenfield apps: Tailwind.
- If the repo already uses CSS Modules, styled-components, or another established styling system, follow it.
- Do not introduce Tailwind mid-repo unless doing an explicit migration.

#### UI Component Library

- Default: no UI library unless one is already in use.
- If a library is desired for speed + control, prefer shadcn/ui as a pragmatic default.
- Treat UI library choice as high-gravity: avoid mixing multiple UI libraries in one codebase.
- If using a heavy UI library (for example MUI/Chakra), keep `ui/primitives/` as thin wrappers where needed and keep ownership consistent.

#### Forms

- Default: react-hook-form.
- Keep form state/validation orchestration in feature-level code, not in `ui/primitives/`.

#### Validation and Schemas

- Default: Zod.
- Validate at boundaries (API DTO parsing and form boundaries) before mapping to domain models.
- Apply runtime validation selectively:
  - Required for auth/session endpoints, core business flows, and historically unstable payloads.
  - Optional for stable internal endpoints where backend and frontend are tightly coupled and versioned together.
- Placement:
  - DTO shape schemas in `api/dto/**`.
  - Domain invariant schemas in `features/<domain>/domain/**`.

#### HTTP Client

- Default: native `fetch` with a thin shared wrapper in `api/client/`.
- If the repo already uses axios/ky (or equivalent), follow existing convention.
- Keep the wrapper focused on shared concerns: headers, error normalization, and base request behavior.
- Normalize transport errors to one `ApiError` shape:
  - `{ status?: number; code?: string; message: string; details?: unknown; cause?: unknown }`
- Default retry posture:
  - Query-like GET requests: retry only for network failures and `5xx`, with a small cap (default: `2`).
  - Mutations/non-idempotent writes: no automatic retries unless explicitly requested.
- Support cancellation via `AbortSignal` passthrough from callers to endpoint wrappers/client requests.

#### Build Tool

- Default for greenfield plain React: Vite.
- If using Next.js, follow Next.js defaults.
- If legacy CRA is already present, follow existing setup for that repo; do not start new CRA projects.

#### Date and Localization

- Default to native `Date` and `Intl.DateTimeFormat`.
- Do not add a date library unless the domain needs heavy date math/time-zone workflows or broad multi-screen parsing/formatting consistency.
- If a date library becomes necessary, prefer `date-fns` unless the repository already standardizes on another option.

#### Identifier Strategy

- Default to string identifiers across layers (`id: string`).
- Prefer backend-generated IDs for persisted entities.
- Use client-generated IDs only for optimistic UI or local drafts, then reconcile with canonical backend IDs.
- Branded ID types are optional and should be adopted only when the repository explicitly opts into stronger nominal typing.


### Implementation Defaults

#### Feature Flag Strategy

- Centralize feature flags in `config/featureFlags.ts`.
- Evaluate feature flags at composition boundaries (`pages/**` and `features/*/sections/**`), not inside deep UI primitives.
- Default to build-time/env-driven flags (`config/env.ts` as the access boundary).
- Use remote/runtime flag providers only when the repository already has that operational setup.

#### UI Styling Extension Conventions

- UI primitives and most composites should accept `className?: string`.
- If class merging is used, provide one shared helper (`lib/cn.ts`) and reuse it consistently.
- Follow the repository's existing styling system; do not introduce a second styling system mid-repository.

#### Accessibility Baseline

- Baseline accessibility is required for reusable UI components:
  - Input labels (or `aria-label` when a visible label is not appropriate).
  - Keyboard operability.
  - Visible focus states.
  - Semantic HTML where possible.
- If the repository already uses accessibility-focused UI primitives (for example Radix/shadcn patterns), follow those conventions.
- Do not introduce a new accessibility library by default.

#### Performance Posture

- Default to simple, readable implementations.
- Do not add `useMemo`, `useCallback`, or `React.memo` unless there is a concrete reason:
  - Demonstrably expensive rendering/computation.
  - Referential stability is required for correctness or controlled re-renders.
- Keep expensive data shaping in feature domain/section layers, not in UI primitives.

#### Repository Topology Assumption

- Default to single-app workflow rooted at one `src/`.
- If repository signals monorepo mode (`apps/`, `packages/`, `pnpm-workspace.yaml`, `turbo.json`), switch behavior automatically.
- In monorepo mode, apply placement and dependency rules per app root (for example `apps/web/src/**`).

#### Module Boundary Tooling Posture

- Start with spec-level boundary enforcement (import audits and review checks).
- Add lint/tool-based boundary rules only when explicitly requested as dedicated hardening work.
- Suitable tooling options include `no-restricted-imports`, `import/no-restricted-paths`, and `eslint-plugin-boundaries`.
- For broad compatibility, prefer `no-restricted-imports` with folder-based `overrides` as the baseline enforcement mechanism.
- Prefer `import/no-restricted-paths` when zone-style `from -> to` constraints are easier to maintain than many path patterns.
- If import aliases are used (for example `@/`), mirror all boundary patterns using alias paths instead of raw `src/**` paths.
- `eslint-plugin-boundaries` is a good fit when element/layer declarations are easier to maintain than many path-pattern overrides.
- Practical lint hardening for transport boundaries:
  - Use `no-restricted-globals` to block direct `fetch` in `src/**/*`, with explicit exclusions for `api/endpoints/**` (and `api/client/**` when that folder owns transport wrappers).
  - Use `no-restricted-imports` to block direct `axios`/`ky` (or equivalent HTTP clients) outside `api/client/**`.

#### Environment Access Policy

- `config/env.ts` is the single access point for environment values.
- Do not read `process.env.*` or `import.meta.env.*` outside `config/env.ts`.
- Multiple deployment environments should use `.env.*` files, but app code consumes env values only via typed exports from `config/env.ts`.
- Lint enforcement pattern: apply `no-restricted-properties` to block `process.env` in `src/**/*` with `src/config/env.ts` excluded.
- For Vite-based projects, optionally enforce the same boundary for `import.meta.env` with `no-restricted-syntax` if needed.

#### Logging Policy

- Do not commit `console.log` or `console.debug` in production code.
- Use `lib/logger.ts` with `logger.debug/info/warn/error` as the default logging interface.
- `console.error` is allowed only inside logger implementation.
- Logger behavior may be level-gated or no-op in production builds.
- Lint enforcement pattern: prefer repo-wide `no-console: error` with an override allowing console only in `src/lib/logger.ts`.

#### Codegen Policy

- Default to handwritten DTOs and endpoint wrappers.
- Do not introduce code generation in normal feature tasks unless explicitly requested.
- If codegen is adopted, isolate generated clients in `api/client/generated/**` and keep handwritten `api/endpoints/**` wrappers for boundary control.

#### Storybook and Component Docs Policy

- Storybook/component docs are optional.
- If Storybook already exists, add lightweight stories for new primitives and composites.
- If Storybook is not already present, do not add it as part of normal feature work.
- Add Storybook only as an explicit decision to invest in design-system workflows.


## Folder Specs

### `src/pages/`

**Purpose:** Route entry points. Thin orchestrators.

**Allowed to contain:**

- Route-level composition of sections/panels
- Page-level state that affects the whole page
- Route params parsing + navigation concerns
- Top-level error/loading boundaries for the route

**Must NOT contain:**

- API calls/fetching logic (no `fetch`, and no direct imports from the repository's canonical endpoint layer such as `api/endpoints/**` or gravity-equivalent API home)
- Domain mapping logic
- Large markup trees (prefer composing sections/components)

**Imports allowed:**

- `features/**`, `ui/**`, `core/**`, `hooks/**`, `lib/**`, `store/**`

**Naming:**

- Default: `XPage.tsx`
- Use `XRoute.tsx` only if that naming pattern is already established in the repo.
- Framework-required route file names (for example Next.js `page.tsx`) override this rule.

### `src/features/`

**Purpose:** Domain ownership. This is where meaning lives (tasks/projects/etc).

**Allowed to contain:**

- Domain sections (smart-ish components)
- Feature hooks (React Query hooks, feature state hooks)
- Domain logic and types for the feature
- Feature-specific adapters mapping DTO -> domain -> view models (if needed)
- Feature-local state (Zustand slice/reducer) if not global

**Must NOT contain:**

- Global routing definitions (no route tables)
- Cross-domain shared feature logic (move this to `lib` or to a dedicated shared domain module if truly needed)
- UI primitives (belongs in `ui/primitives`)
- Generic UI patterns that could be used anywhere (belongs in `ui/composites`)

**Imports allowed:**

- `api/**`, `ui/**`, `hooks/**`, `lib/**`, `store/**`, `config/**`

**Naming:**

- Section components in `features/<domain>/sections/` should use `XSection.tsx`.
- Feature hooks in `features/<domain>/hooks/` should use `useXxx.ts` with matching `useXxx` exports.
- Domain types in `features/<domain>/domain/` should use plain names (for example `Project`), not default names like `ProjectModel` or `ProjectType`.
- DTO-to-domain mapper files should use `<thing>.mapper.ts` naming and export explicit mapper functions (for example `mapProjectDtoToProject`).
- Only introduce extra representations such as `Entity`/`ViewModel` when multiple representations are actually needed.

**Recommended internal structure per feature (optional, not required):**

```text
features/projects/
  sections/
  hooks/
  domain/
  state/      (optional)
  adapters/   (optional)
```

### `src/ui/primitives/`

**Purpose:** Dumb UI building blocks. Maximum reuse.

**Allowed to contain:**

- Pure presentational React components (Button, Input, Card, Badge, Icon wrappers, Typography)
- Styling plus minimal formatting
- Accessibility behavior (aria, keyboard handling)

**Must NOT contain:**

- Fetching or server state
- Feature/domain knowledge (no `Task` or `Project` naming)
- App-wide state usage
- Direct imports from `features/**`, `api/**`, `store/**`

**Imports allowed:**

- `ui/**` (other primitives), `hooks/**` (generic UI hooks), `lib/**` (formatting utilities)

**Naming:**

- Use semantic component names without extra suffix noise (for example `Button.tsx`, `Input.tsx`, `Card.tsx`), not names like `ButtonPrimitive.tsx`.

### `src/ui/composites/`

**Purpose:** Reusable UI patterns. Opinionated about UI shape, not domain meaning.

**Allowed to contain:**

- Composition of primitives into reusable patterns (for example `FilterBar`, `ModalShell`, `DataTableShell`, `MasterDetailLayout`, `Toolbar`, `EmptyStatePanel`)
- Slots/composition points to inject content (children, render sections)
- Generic state internal to the pattern (open/close, selection UI state)

**Must NOT contain:**

- Domain naming and behavior (no `TaskList`, `ProjectRow`)
- Direct API calls
- Direct imports from `features/**`
- Business rules (for example scoring or task sorting)

**Imports allowed:**

- `ui/primitives/**`, `ui/composites/**`, `hooks/**`, `lib/**`

**Naming:**

- Use semantic composite names without a `Composite` suffix (for example `FilterBar.tsx`, `ModalShell.tsx`, `DataTableShell.tsx`).

### `src/api/`

**Purpose:** Transport-level backend access. No React.

**Layer invariant:**

- `api/**` exports transport functions and DTOs only.
- `api/**` must not export domain models or domain-mapped types.
- DTO -> domain mapping must happen in `features/**`.

#### `src/api/client/`

**Allowed:**

- `fetch` wrappers, axios instances, interceptors, auth headers
- Retry logic, base URL, request helpers
- Error normalization to a shared `ApiError` shape
- Request cancellation support (for example `AbortSignal` passthrough)

**Forbidden:**

- React imports
- UI imports
- Domain mapping

#### `src/api/dto/`

**Allowed:**

- Types representing raw request/response payloads
- Only DTOs (wire format), not domain models

**Forbidden:**

- UI-specific types
- Domain-specific computed properties

**Naming:**

- DTO type names should use a `Dto` suffix (for example `ProjectDto`, `CreateProjectRequestDto`, `ProjectsListResponseDto`).
- Prefer resource-grouped DTO files by default (for example `api/dto/projects.dto.ts`) unless an existing repo pattern requires a different shape.

#### `src/api/endpoints/`

**Allowed:**

- Functions calling backend endpoints
- Return DTO types or throw normalized typed errors (`ApiError` with `message` and optional `status`, `code`, `details`, `cause`)
- No React Query, no hooks
- Organize endpoint files by resource/intent (for example `projects.ts`, `tasks.ts`) rather than splitting files by HTTP verb by default.

**Forbidden:**

- React imports
- Feature imports
- UI imports
- Mapping DTO -> domain (belongs in features/adapters)

**Imports allowed (in all `api/**`):**

- `api/**`, `config/**`, and maybe `lib/**` for generic helpers like `assertNever` or `Result`

#### API Contract Source of Truth

- Default: handwritten endpoint wrappers in `api/endpoints/**` with DTO definitions in `api/dto/**`.
- Keep domain mapping in `features/*/domain/**` or `features/*/adapters/**`.
- Adopt OpenAPI-generated clients only when backend contracts are stable and shared across multiple apps/teams.
- If adopted, place generated client code in `api/client/generated/**` and keep `api/endpoints/**` as thin wrappers over it to preserve boundary, error handling, and call sites.

### `src/store/`

**Purpose:** Global client-state only (not server cache).

**Allowed:**

- App-wide state: auth session, user prefs, theme mode, global UI flags
- Zustand/Redux store setup and slices

**Forbidden:**

- Storing server-state as a source of truth or mirroring server cache without explicit justification (prefer React Query cache)
- UI components
- Feature-specific state that does not need to be global

**Imports allowed:**

- `lib/**`, `config/**`, optionally `api/**` (rare; prefer injecting services)

If mirroring server data in global store is proposed, the change must explicitly justify one of:

- Performance-critical caching.
- Offline-first requirement.
- Explicit architectural decision for that repository.

#### State Persistence Policy

- Persist only user preferences and lightweight UI state (for example theme, density, column visibility, last selected workspace), typically via `localStorage`.
- Prefer URL query parameters for shareable/bookmarkable state (for example filters, search, sorting).
- Do not persist ephemeral UI state (for example modal open/close flags or transient selections).
- Do not persist server-state snapshots in global store unless explicitly justified by performance-critical caching, offline-first requirements, or a documented architectural decision; React Query cache remains the source of truth.

### `src/core/`

**Purpose:** App wiring and infrastructure.

**Allowed:**

- Providers (`QueryClientProvider`, `RouterProvider`, `ThemeProvider`)
- App shell layout
- Router setup
- Query client creation/config
- Error boundaries (app-level)
- Dependency injection setup (if any)

**Forbidden:**

- Feature logic
- UI primitives/composites definitions

**Imports allowed:**

- Any, but core should mostly compose, not implement domain logic.

### `src/lib/`

**Purpose:** Pure, framework-agnostic utilities.

**Allowed:**

- Pure functions: formatting, parsing, math helpers, date helpers
- Type helpers
- Generic algorithms

**Forbidden:**

- React imports
- API calls
- Feature/domain-specific logic (unless it is truly cross-domain and stable)

### `src/hooks/`

**Purpose:** Cross-domain hooks only.

**Allowed:**

- Generic hooks: `useDebounce`, `useLocalStorage`, `useEventListener`, `useMediaQuery`

**Forbidden:**

- Imports from `features/**` (feature hooks belong in `features/<domain>/hooks/**`)
- Imports from `pages/**`
- Imports from `store/**`
- Imports from `api/**`, unless documented in exactly one canonical policy location (for example `ARCHITECTURE.md` or `src/config/agentOverrides.ts`)

**Naming:**

- File name should match the hook export: `useXxx.ts` -> `useXxx`.
- Default to one hook per file to keep ownership and searchability predictable.

### `src/config/`

**Purpose:** Centralized configuration.

Canonical config files:

- `src/config/env.ts` -> the only allowed environment access point.
- `src/config/featureFlags.ts` -> centralized feature flag registry.
- Optional: `src/config/routes.ts` -> route constants.

**Allowed:**

- Env parsing/validation (for example `env.ts`)
- Feature flags
- Route constants (paths)
- Build-time and runtime config

**Forbidden:**

- Domain logic
- UI components

### Cross-layer Error Handling Standard

Use three-stage ownership for errors:

1. `api/endpoints/**`: throw a normalized typed error (`ApiError`) with `message` and optional `status`, `code`, `details`, and `cause`, with no UI concerns.
2. `features/*/hooks/**`: expose errors in a consistent hook result shape; do not trigger toasts/snackbars for query-loading failures inside hooks.
3. `pages/**` and `features/*/sections/**`: choose the user-facing UI behavior.

Default UI behavior:

- Queries/page-load failures: render an inline error panel with a `Retry` action.
- Mutations: use toast/snackbar feedback only for action outcomes when that app pattern already exists; otherwise keep feedback inline near the action.


## Enforcement Heuristics

A file is in the wrong folder if:

- It imports something forbidden by the import rules.
- Its name contains domain terms but it lives in `ui/**` (for example `TaskRow.tsx` in `ui/composites`).
- It calls `fetch` outside the repository's canonical endpoint layer (`api/endpoints/**` or gravity-equivalent API home).
- It uses React Query outside feature hooks (exception: core provider setup).


## File Size Guidance

### General Principle

The higher the abstraction level, the smaller the file should be.

Because:

- High-level files orchestrate.
- Low-level files implement detail.

### Recommended Max Lines Per Folder

These are soft caps, not hard compile failures.

#### `pages/`

**Max:** 120-150 lines

Why:

- Pages should compose sections.
- If a page exceeds this, it is probably doing too much markup, too much state, or business logic.

Smell signs:

- Inline fetch
- 5+ `useEffect` calls
- Large conditional trees

If over 150 lines, extract a section.

#### `features/*/sections/`

**Max:** 200-250 lines

These files may:

- Coordinate hooks
- Manage local UI state
- Compose primitives/composites

If over 250 lines:

- Extract smaller sub-sections
- Move logic into hooks
- Move mapping into adapters

If it reaches 400+ lines, it is becoming a mini-page.

#### `features/*/hooks/`

**Max:** 150-200 lines

If it grows beyond that:

- Split into smaller hooks
- Move non-React logic into `domain/` or `lib/`

Hooks should orchestrate, not implement heavy algorithms.

#### `features/*/domain/`

**Max:** 200 lines per file

Pure logic can sometimes be longer, but:

- If one file grows huge, it likely contains multiple concepts
- Split by responsibility (`scoring.ts`, `grouping.ts`, `validation.ts`)

#### `ui/primitives/`

**Max:** 150 lines

These should stay tight and focused.

If a single primitive (for example `Button`) becomes very large, split variants or concerns into separate files.

#### `ui/composites/`

**Max:** 200-250 lines

Composites can be slightly larger because they compose primitives.

If larger:

- Extract internal pieces
- Avoid embedding feature-specific decisions

#### `api/endpoints/`

**Max:** 80-120 lines

Each file should ideally contain:

- Related endpoints only
- Thin wrappers around HTTP

If 300+ lines, split by resource or operation.

#### `lib/`

**Max:** 120-200 lines

Pure utilities can be longer, but if a file has many unrelated helpers, split it.

Avoid mega utility files.

#### `store/`

**Max:** 150-250 lines per slice

If a store grows:

- Split by slice/domain
- Avoid one global mega-store

#### `core/`

**Max:** 150 lines per file

Core should mostly wire providers.

If it grows too large:

- Split router setup
- Split provider setup

### Absolute Red Flag Numbers

If any file exceeds:

- 400 lines: architecture smell
- 600+ lines: refactor required

This usually indicates:

- Too many responsibilities
- Missing extraction layers
- Fear of moving code

### Responsibility Metric

Line count is secondary to responsibility boundaries.

Ask:

- Does this file have more than one reason to change?
- Does it mix orchestration, logic, and UI?
- Is its responsibility hard to explain in one sentence?

If yes, split it.

### Practical Recommendation

Prefer this rule over strict line caps:

No file should require scrolling more than 3 screen heights to understand its main responsibility.


## Definition of Done Checks

### Baseline Priorities

- Catch expensive failures early (broken builds, type errors, layering drift).
- Keep checks deterministic and aligned with this architecture spec.
- Prefer high-signal checks over slow/fragile checks.

### Architecture Boundary Audit (Always)

Must pass:

- No forbidden imports per the import rules in this spec.
- `ui/**` does not import `features/**`, `api/**`, `store/**`, or `pages/**`.
- `api/**` does not import React (`react`, `react-dom`) and does not import `ui/**`, `features/**`, `pages/**`, or `store/**`.
- `features/**` does not import `pages/**`.
- `hooks/**` does not import `features/**`, `pages/**`, or `store/**`; `hooks/**` importing `api/**` is allowed only when documented in exactly one canonical policy location (for example `ARCHITECTURE.md` or `src/config/agentOverrides.ts`).
- `pages/**` does not import from the repository's canonical endpoint layer (`api/endpoints/**` or gravity-equivalent API home) directly; route-level data access goes through feature hooks.
- No fetching outside the repository's canonical endpoint layer (`api/endpoints/**` or gravity-equivalent API home).
- `api/**` exports only transport functions and DTOs; DTO -> domain mapping stays in `features/**`.
- No domain terms in `ui/**` component names or file names.

### TypeScript Correctness (When Tooling Exists)

Must pass:

- `tsc` (or framework equivalent) has zero errors.

If tooling cannot run, still:

- Treat `strict: true` as the target quality bar unless the repository explicitly defines a different policy.
- Keep types explicit where practical.
- Avoid `any` by default; prefer `unknown` plus narrowing when dynamic data must be handled.
- Mirror existing typing conventions in the repo.

If `@typescript-eslint` is configured, recommended strict baseline includes:

- `@typescript-eslint/no-explicit-any` -> `error`
- `@typescript-eslint/consistent-type-imports` -> `error`
- `@typescript-eslint/no-unused-vars` -> `error`
- `@typescript-eslint/no-floating-promises` -> `error`
- `@typescript-eslint/await-thenable` -> `error`
- `@typescript-eslint/no-misused-promises` -> `error`
- `@typescript-eslint/consistent-type-definitions` -> choose one style (`type` or `interface`) and enforce consistently

### Lint Check (When ESLint Exists)

Must pass:

- `eslint` (or repo lint command) completes cleanly.
- `eslint-disable` is last resort only; keep it single-line scoped and include a short reason comment.

Recommended lint hygiene rules (when plugins are available):

- `import/no-cycle` -> `warn` or `error`
- `import/no-duplicates` -> `error`
- `import/newline-after-import` -> `error`
- `import/order` -> optional; enforce only if repository already uses a stable import ordering convention
- If you can only enforce a minimal high-impact set, prioritize boundary rules, `@typescript-eslint/no-explicit-any`, and `no-console` (with logger-file override).

Recommended complexity guardrails:

- Keep `max-lines` folder-scoped and prefer `warn` over `error` for legitimate exceptions.
- Add `max-lines-per-function`, `complexity`, `max-params`, and `max-depth` as warnings to surface oversized components/functions early.

### Runtime Safety Essentials (Always)

Change must include:

- Loading state handling when server data is involved.
- Error state handling (at least a minimal safe fallback).
- Empty state handling for list/collection views.
- No unhandled promise rejections.
- No fire-and-forget fetching in UI layers.

### Query Correctness (When Using TanStack Query)

Must pass:

- Use stable query keys (avoid inline key objects that change every render).
- Ensure invalidation or cache updates are correct after mutations when required.
- Do not duplicate server-state in store unless explicitly justified.
- React Query cache (or repository-equivalent server cache) is the canonical source of server-state.
- Any server-state mirroring into global store must include explicit justification: performance-critical caching, offline-first requirement, or a documented architectural decision.
- Keep retry behavior intentional:
  - Queries: retry only network/`5xx` failures with a small cap (default `2`).
  - Mutations: no automatic retry unless explicitly required.

### Minimal Churn / Scope Guard (Always)

Must pass:

- Touch only files in the implementation plan unless deviations are explained.
- Avoid refactors unrelated to the request.
- Do not add new dependencies unless explicitly requested.

### Optional Checks (Enable When Relevant)

#### Unit/Integration Tests (If Test Suite Exists)

Run or update relevant tests when:

- Adding pure domain logic.
- Adding critical transformations (for example DTO -> domain mappings).
- Adding critical reducers/store slices.
- Delivering a bug fix.

Rule:

- If tests already exist, update/add relevant coverage.
- Do not force a new test stack in repos without an established testing setup.

#### E2E Tests (Rare)

Run E2E checks only when both are true:

- The repo already has Playwright/Cypress (or equivalent) configured.
- The change affects key user flows.

### LLM-friendly DoD Order (Recommended)

Use this sequence for highest payoff:

1. Boundary audit.
2. Type check.
3. Lint.
4. Loading/error/empty state coverage.
5. Query key and invalidation sanity.
6. Scope/minimal churn audit.
7. Tests (when present).

### Done Policy Summary

Required always:

- Boundary rules satisfied.
- No fetching outside endpoint layer.
- Loading/error/empty handled where relevant.
- Plan-followed, minimal-churn changes.

Required when tooling is available:

- TypeScript compile/check passes.
- ESLint (or repo lint command) passes.

Required only when an existing test suite exists:

- Relevant tests are updated or added.


## Agent Access and Change Control

### Default Access Model

- Detection/reuse/planning stages should have repo read/search access.
- Default write mode should remain controlled: output diffs/snippets/patches for review rather than applying direct edits automatically.
- Direct write mode is optional and should be explicitly enabled per task.

### Why Repo Read/Search Is Required

- Architecture detection depends on real repository signals (routing, UI homes, API homes, state stack, naming/export conventions).
- Reuse decisions depend on code search (existing composites, DTOs, endpoint wrappers) to avoid duplication and drift.
- Without read/search capability, the agent should assume higher uncertainty and avoid structural assumptions.

### Minimum Read/Search Capabilities

The agent should be able to:

1. List the file tree under `src/`.
2. Search patterns (for example `fetch(`, `axios`, `useQuery`, router setup identifiers).
3. Read file contents on demand.
4. Read tooling/config files (`package.json`, `tsconfig.json`, ESLint config, router entry/setup files).

### Fallback Context Bundle (No Direct Repo Access)

When direct repo access is unavailable, provide a context bundle containing:

1. File tree (top-level plus `src/` depth about 3-4).
2. `package.json`.
3. Router entry files (for example `main.tsx`, `App.tsx`, router config).
4. API client location currently in use.
5. One or two examples each of:
   - Primitive component.
   - Composite component.
   - Feature section.
   - Feature hook.
   - Endpoint module.

### Write Control Policy

- Default: no direct writes; produce patch/snippet output for review and controlled application.
- Keep changes reviewable and intentional; avoid silent churn.
- If direct writes are enabled, still enforce plan-followed scope and minimal churn rules.
- Do not auto-edit architecture/specification documents (`ARCHITECTURE.md`, `specs/**/master_spec.md`, `spec/**`) during regular implementation tasks.
- Update architecture/specification documents only when explicitly requested; treat those edits as dedicated documentation scope.


## Scope Governor

### Hard Defaults (Required Unless Explicit Override)

- Max files touched: 8.
- Max new files: 4.
- Max moved/renamed files: 0 (unless migration mode is explicitly enabled).
- Max new dependencies: 0 (must be explicitly requested).
- Max new top-level folders: 0 (must be explicitly requested).

### Soft Default Behavior (When Caps Are Exceeded)

When work appears to exceed caps:

- Implement the smallest viable version that fits within hard defaults.
- Provide a short follow-up scope list for what would be done next.
- Do not stall waiting for vague clarification if safe minimum delivery is possible.

### Expand Scope Escape Hatch

If extra scope would materially improve completeness, return a structured expansion request:

```json
{
  "scope_expansion_needed": [
    { "why": "shared composite missing", "would_touch": 2 },
    { "why": "tests missing", "would_touch": 3 }
  ]
}
```

Rules:

- Keep each item concrete (`why`, `would_touch`).
- Continue delivering the in-cap result in the same task.
- Expand only after explicit user approval.

### Cap Rationale

- `8` touched files matches a typical thin vertical slice in this architecture.
- `4` new files covers common bundle patterns (for example section + hook + endpoint + DTO).
- `0` moves by default minimizes migration churn and review risk.
- `0` new dependencies by default prevents high-gravity tooling/style/type drift.
- The cap set protects against refactor creep, abstraction creep, and dependency creep.
- These limits keep review time, commit size, and risk bounded by default.


## Skill Model

Use `4` execution skills plus `1` shared policy configuration layer.

### Execution Skills

#### Architecture Detection

- Primary output: repository classification, gravity map, and migration strategy.

#### Placement and Layering

- Primary output: file touch plan and layer assignments.

#### Reuse vs Update vs New

- Primary output: refined implementation plan with per-artifact reuse decisions.

#### Implementation Discipline

- Primary output: disciplined implementation updates with boundary and quality-gate compliance.

### Shared Policy Configuration Layer

- One shared config provides constraints/defaults to all execution skills (for example pause thresholds, technology defaults, naming conventions, scope governor, and logging/env/codegen/storybook policies).
- Policy/config updates should not be modeled as new execution skills.

### Execution Guidance

- Implementation discipline remains mandatory and is represented by an explicit execution skill.
- Shared policy, DoD checks, and task execution workflows continue to constrain all execution skills.
- The production skill set remains fixed at:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`

### Optional Extension Skills

- Optional, explicit-addition skills may be used for automation-heavy workflows:
  - Boundary tooling generator (for example ESLint boundary rule setup).
  - Repo context bundler (for constrained/no-read environments).
  - Migration executor (controlled file moves/renames in dedicated migration scope).
