# Master Spec: 004 React Reuse vs Update vs New

This document aggregates sections that map to spec `004-skill-react-reuse-update-new`.

## Contents

- [Document Structure](#document-structure)
- [Appendix A: Shared Project Setup and Tooling](#appendix-a-shared-project-setup-and-tooling)
- [Appendix B: Relevant Specs/Skills Repository Layout](#appendix-b-relevant-specsskills-repository-layout)
- [Consolidated Additions](#consolidated-additions)
- [Product Scope (v1)](#product-scope-v1)
- [Import Rules (Dependency Direction)](#import-rules-dependency-direction)
- [Agent Access and Change Control](#agent-access-and-change-control)
- [Scope Governor](#scope-governor)
- [Skill Model](#skill-model)

---
## Document Structure

- The normative reuse-decision baseline begins at `## Consolidated Additions`
  and continues through the end of this document.
- Appendix sections below were migrated from former project-structure baseline docs to keep
  setup and layout context co-located with this spec.
- Shared cross-spec entities used by specs `002`-`005` are:
  - `shared/` (shared policy baseline)
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
    "build:agents": "node scripts/generators/generate_agents.mjs",
    "check": "npm run check:agents && npm run check:frontmatter && npm run check:examples",
    "check:agents": "node scripts/generators/generate_agents.mjs --check",
    "check:frontmatter": "node scripts/validators/validate_frontmatter.mjs",
    "check:examples": "node scripts/validators/validate_examples.mjs"
  }
}
```

Notes:

- `build:agents` writes `AGENTS.md`.
- `check:agents` runs in `--check` mode and fails if generated output differs.

### Build script spec: `generate_agents.mjs`

#### Responsibilities

For each production skill under `skills/*/` and the shared baseline at
`shared/`:

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

For each production `skills/*/SKILL.md` and `shared/SKILL.md`:

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
  shared/
    policy/
      SKILL.md
      rules/
        00_overview.md
        10_<topic>.md
        20_<topic>.md
  templates/
    00_OVERVIEW_TEMPLATE.md
    SKILL_TEMPLATE.md
    AGENTS_TEMPLATE.md
    RULE_TEMPLATE.md
  skills/
    react-reuse-update-new/
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
    004-skill-react-reuse-update-new/
      master_spec.md
      spec.md
      plan.md
      tasks.md
      research.md
      data-model.md
      quickstart.md
      implementation-tracker.md
      contracts/
        reuse-decision-output-contract.md
        reuse-decision-output.schema.json
  scripts/
    generators/
      generate_agents.mjs
    validators/
      validate_frontmatter.mjs
      validate_examples.mjs
      validate_handoffs.mjs
    lib/
      schema_validator.mjs
      utils.mjs
    fixtures/
      handoffs/
```

> Normative reuse-decision baseline starts below.



## Consolidated Additions

The following reuse-skill details are retained from legacy guidance and aligned
to the current `004` contract.

### Reuse Skill Inputs

Required inputs per run:

- `detection_result`: upstream architecture context (`gravity_map`, strategy,
  conventions).
- `placement_plan`: upstream placement artifacts/paths/layers to refine.
- repository discovery/search context (`repo_index` or equivalent read/search
  capability).

Optional inputs:

- `reuse_thresholds` overrides:
  - `max_new_props_for_update` (default `2`)
  - `max_flags_allowed_composites` (default `0`)
  - `max_generic_flags_allowed_primitives` (default `1`)
  - `max_abstraction_risk_score` (default `6`)

### Reuse Output Baseline

Reuse output must stay machine-consumable. At minimum, successful decision
output must include:

- one final decision per needed artifact
- concrete target path (or explicit blocked/not-found status)
- concise reasons and score profile
- revised downstream-ready plan artifacts
- explicit anti-leakage guardrails

Strict schema/version/result-type behavior is governed by the `004` contract
and schema artifacts.

### Discovery Lookup Order

For each needed artifact, perform discovery in this order:

1. exact/near-name candidate lookup
2. pattern/behavior candidate lookup
3. underlying primitive building-block lookup
4. endpoint/DTO/hook lookup

Every step must record concrete evidence paths or explicit `not_found`.

### Scoring Interpretation

Fit-score interpretation:

- `10`: identical behavior
- `7-9`: minor wiring/extension
- `4-6`: significant differences
- `0-3`: wrong abstraction

Decision thresholds:

- prefer `reuse` when fit/cost/coupling/divergence are safely low (for example
  fit `>= 8`, complexity `<= 3`, coupling `<= 3`, divergence `<= 4`)
- prefer `update` when fit is acceptable (for example `>= 6`) and threshold
  constraints remain satisfied
- prefer `new` when fit is low or update would violate thresholds/leakage safety

### Reuse Non-goals

- no direct feature implementation
- no architecture migration decisions (owned upstream)
- no broad refactors unrelated to the request
- no forced over-generalization through domain-mode flag patterns

## Product Scope (v1)

This repository's production scope is fixed to four execution skills:

1. `react-architecture-detection`
2. `react-placement-and-layering`
3. `react-reuse-update-new`
4. `react-implementation-discipline`

`agent-policy-v1` is the shared policy baseline for these four skills and is
not counted as a production execution skill.


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


### Reuse Decision Scoring Heuristic

When deciding reuse/update/new, score:

- Complexity cost (how many new props/flags are needed).
- Coupling risk (domain leakage or cross-feature dependency).
- Divergence probability (likelihood UX/behavior diverges later).
- Locality benefit (reduced blast radius by keeping logic in-feature).

Decision shortcut:

- Low complexity + low coupling risk -> reuse or small update.
- High flag cost + high divergence probability -> create a new feature section while reusing shared primitives/composites where possible.


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
