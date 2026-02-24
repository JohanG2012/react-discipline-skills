# Master Spec: 003 React Placement and Layering

This document aggregates sections that map to spec `003-skill-react-placement-layering`.

## Contents

- [Document Structure](#document-structure)
- [Appendix A: Shared Project Setup and Tooling](#appendix-a-shared-project-setup-and-tooling)
- [Appendix B: Relevant Specs/Skills Repository Layout](#appendix-b-relevant-specsskills-repository-layout)
- [Consolidated Additions](#consolidated-additions)
- [Product Scope (v1)](#product-scope-v1)
- [Top-level Structure](#top-level-structure)
- [Import Rules (Dependency Direction)](#import-rules-dependency-direction)
- [Folder Specs](#folder-specs)
- [Where to Put X Cheatsheet](#where-to-put-x-cheatsheet)
- [Agent Access and Change Control](#agent-access-and-change-control)
- [Scope Governor](#scope-governor)
- [Placement and Layering](#placement-and-layering)

---
## Document Structure

- The normative placement/layering baseline begins at `## Consolidated
  Additions` and continues through the end of this document.
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
    react-placement-and-layering/
      SKILL.md
      rules/
        00_overview.md
        10_<topic>.md
        20_<topic>.md
      AGENTS.md
      examples/
        output.example.json
      schemas/
        output.schema.json
  specs/
    001-agent-policy-v1/
      master_spec.md
    002-skill-react-architecture-detection/
      master_spec.md
    003-skill-react-placement-layering/
      master_spec.md
      spec.md
      plan.md
      tasks.md
      research.md
      data-model.md
      quickstart.md
      implementation-tracker.md
      contracts/
        placement-plan-output-contract.md
        placement-plan-output.schema.json
  tools/
    build/
      compile_agents.mjs
      validate_frontmatter.mjs
      validate_examples.mjs
```

> Normative placement/layering baseline starts below.



## Consolidated Additions

The following placement-skill details are retained here from legacy planning
notes and aligned to the current `003` contract.

### Placement Skill Inputs

Required inputs per run:

- `request`: natural-language implementation request.
- `target_arch_spec`: applicable folder/layer rules and import boundaries.
- `detection_result`: architecture-detection output (gravity map + strategy + notes).

Optional inputs:

- `constraints` such as:
  - `avoid_new_folders`
  - `max_files_touched`
  - `prefer_api_root`
  - `prefer_react_query`
- `existing_artifacts`: user-provided candidate files/components.

### Placement Output Baseline

Placement output must stay machine-consumable. At minimum, successful planning
output must include:

- selected strategy
- feature owner
- artifact actions (`create | update | reuse`) with layer/path context
- import guardrails
- concise decision notes

Strict schema/version/result-type requirements are governed by the `003`
feature contract and schema artifacts.

### Placement Non-goals

- no direct feature implementation
- no broad refactors unrelated to the request
- no invention of new conventions when local conventions already exist
- no ad-hoc shared/common dumping-ground creation

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


### Decide the Shape of the Work

#### Classify the Request

Use one or more categories:

1. New page/route
2. New feature capability
3. New UI element
4. New API endpoint/backend integration
5. Refactor/reuse improvement
6. Bug fix

#### Pick a Domain Owner

- Choose one owning feature domain (`features/tasks`, `features/projects`, etc.).
- If no domain owner fits (for example auth/telemetry), place work in `core/` or `api/client/` unless another existing layer already owns it.

#### Map the Layers to Touch

- Page orchestration -> `pages/`
- Domain UI section -> `features/<x>/sections/`
- Domain logic -> `features/<x>/domain/`
- Fetching -> `api/endpoints/` (+ DTOs)
- Reusable UI pattern -> `ui/composites/`
- Primitive UI element -> `ui/primitives/`
- Cross-domain hook -> `hooks/`
- Pure helpers -> `lib/`
- App setup/provider -> `core/`
- Global client state -> `store/`

#### List Planned File Touches

- List the files/modules you expect to touch before implementing.


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


### Decision Ladder (Reuse vs Update vs New)

#### Step 1 Reuse as-is

Prefer direct reuse when:

- Existing behavior matches with minimal glue.
- No mode flags are required.
- Reuse does not introduce domain leakage.

#### Step 2 Update Existing

Update an existing module only when:

- The change is small.
- Reusability improves without meaningfully increasing complexity.
- Existing callers are not broken (or are easy to update).
- The abstraction stays clean.

Allowed examples:

- Add a small primitive prop such as `disabledReason` or `iconSlot`.
- Make composites more composable via slots/children/render props.
- Extract pure helpers into `lib/` for cross-feature reuse.

Avoid:

- Domain mode flags in shared components (for example `variant="tasks|projects|finance"`).
- Adding many options to force one component to do everything.

Rule of thumb: if reuse needs more than about two new options/props, do not generalize; prefer section-level duplication.

#### Step 3 Create New

Create a new module when:

- Existing code is too opinionated for the new use case.
- Reuse would require leaky flags/branches.
- Behavior is likely to diverge over time.

Guidance:

- Duplicating a feature section is acceptable.
- Duplicating primitives/composites is usually a design smell; prefer extending shared building blocks instead.


### Layer-specific Reuse Guidance

#### UI primitives

- Reuse almost always.
- If missing, create a primitive.
- If close, make small primitive updates rather than introducing domain-specific copies.

#### UI composites

- Reuse only for true UI patterns.
- Generalize via slots, children, or render props.
- Do not introduce domain modes in composites.
- If UI shape is shared but meaning differs by domain, inject content instead of encoding business meaning.

#### Feature sections

- Tailored duplication is acceptable inside feature sections.
- Reuse a section within the same feature when multiple routes/screens need the same domain presentation.

#### Feature domain

- Prefer reuse within the feature domain.
- Move logic to `lib/` only when it is truly cross-domain and stable.

#### API endpoints and DTOs

- Endpoints should return DTOs.
- If multiple features consume one endpoint, keep endpoint ownership in `api/endpoints` and perform mapping per feature (adapters/domain).

#### Store

- Use `store/` for global client state only.
- Do not duplicate server-state in store when React Query is the server-state source of truth.


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


### Minimum Required Decisions

Before implementation, decide at minimum:

1. Feature owner (domain).
2. Whether a route/page is involved.
3. Data sources (which endpoints and DTOs already exist).
4. State type (`server-state` via React Query cache, local client state, or global store state).
5. UI needs (available primitives/composites, and whether the shape should be a new composite or remain section-specific).


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


### Concrete Placement Rules

#### Follow Gravity

- If a concern already has a working home in this repository, use it.
- Prefer extending established paths over introducing parallel paths.
- Examples:
  - If API calls already live in `src/services/`, continue there for this change.
  - If reusable UI already lives in `src/components/ui/`, use that instead of creating a second UI home.

#### Avoid Duplicate Homes

- Before introducing a new folder for a concern, check existing homes first.
- For UI, check whether the repo already uses one of: `src/components/ui/`, `src/shared/ui/`, `src/common/components/`, or `src/ui/`.
- For backend access, check whether the repo already uses one of: `src/api/`, `src/services/`, or `src/client/`.
- If an existing home is active, extend it unless this change is an explicit migration with a clear boundary.

#### Introduce New Structure Only If Isolated

- Introduce a new target folder shape only when new code can remain mostly self-contained.
- Isolation requires:
  - Clean, predictable imports.
  - Consistent naming conventions.
  - Minimal dependency on unrelated legacy internals.
- If this isolation is not possible yet, defer structural introduction and follow existing placement.

#### Prefer Aliases Over Early Moves

- Early in migration, avoid broad file moves.
- Prefer adding a new boundary/facade while old code stays in place.
- Let new code depend on existing modules through stable imports, then extract/move incrementally later.
- This reduces churn and lowers breakage risk.
- If the repository already defines a path alias such as `@/` -> `src/`, use that alias for new imports.
- If path aliases are not already configured, keep relative imports; do not introduce alias configuration as part of routine feature tasks unless explicitly requested.

#### Maintain a Migration Map

- Keep a short, explicit map of current authoritative homes (for example UI/API/domain placement).
- Example map:
  - "UI primitives currently live in `src/components/ui/`."
  - "API calls currently live in `src/services/api/`."
  - "Feature domain logic currently lives in `src/modules/`."
- Use this map consistently for placement decisions until an explicit migration step changes it.


### Two-Architectures Anti-pattern

Avoid mixed placement where two locations are both treated as correct for the same concern.

- Bad examples:
  - Some shared UI in `src/ui/primitives/` and other shared UI in `src/components/common/`.
  - Some backend access in `src/api/endpoints/` and other backend access in `src/services/api/`.
- Rule:
  - If the repository already has "the place", use it.
  - If it does not, introduce one place and apply it consistently.


### Placement Decision Tree

Use this quick flow before creating new folders:

1. Does an existing folder already serve this concern (UI/API/domain)?
   - Yes -> use it.
   - No -> continue.
2. Is there already a clear but different architecture in this repo?
   - Yes -> follow it for this change (Strategy A).
   - No -> continue.
3. Is the change large enough to justify establishing a new home?
   - Yes -> introduce target structure only for new isolated scope (Strategy B).
   - No -> keep placement minimal and near existing structure.
4. Would this create duplicate homes for the same concern?
   - Yes -> do not introduce the new home yet.
   - No -> introduce it and stay consistent.


### Decision Explanation Format

Before implementation, explicitly state:

- Current architecture signals:
  - "UI currently lives in X."
  - "API access currently lives in Y."
  - "Routing/entry currently lives in Z."
- Chosen direction:
  - "I will follow the existing structure for this change because ..."
  - Or: "The repo lacks a clear pattern, so I will introduce a new isolated home for this new scope while leaving old code untouched."

Keep this short and concrete.


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


## Where to Put X Cheatsheet

- Endpoint call -> `api/endpoints/*`
- React Query hook -> `features/<domain>/hooks/*`
- Map DTO -> domain -> `features/<domain>/adapters/*` or `features/<domain>/domain/*`
- Button/Input/Card -> `ui/primitives/*`
- Filter bar/modal shell/table shell -> `ui/composites/*`
- Route component -> `pages/*`
- QueryClient/providers -> `core/*`
- Pure helper -> `lib/*`
- Generic hook -> `hooks/*`
- App config/env -> `config/*`
- Global UI prefs/auth -> `store/*`


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


## Placement and Layering

- Primary output: file touch plan and layer assignments.
