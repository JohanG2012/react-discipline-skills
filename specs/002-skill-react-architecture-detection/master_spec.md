# Master Spec: 002 React Architecture Detection

This document aggregates sections that map to spec `002-skill-react-architecture-detection`.

## Contents

- [Document Structure](#document-structure)
- [Appendix A: Shared Project Setup and Tooling](#appendix-a-shared-project-setup-and-tooling)
- [Appendix B: Relevant Specs/Skills Repository Layout](#appendix-b-relevant-specsskills-repository-layout)
- [Product Scope (v1)](#product-scope-v1)
- [Agent Access and Change Control](#agent-access-and-change-control)
- [Architecture Detection](#architecture-detection)

---
## Document Structure

- The normative architecture-detection baseline begins at `## Product Scope (v1)`
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
    react-architecture-detection/
      SKILL.md
      rules/
        00_overview.md
        10_<topic>.md
        20_<topic>.md
      AGENTS.md
      examples/
        output.example.json
      fixtures/
        repo_tree_flat.txt
        repo_tree_mixed.txt
      schemas/
        output.schema.json
  specs/
    001-agent-policy-v1/
      master_spec.md
    002-skill-react-architecture-detection/
      master_spec.md
      spec.md
      plan.md
      tasks.md
      research.md
      data-model.md
      quickstart.md
      implementation-tracker.md
      contracts/
        architecture-detection-output-contract.md
        architecture-detection-output.schema.json
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

> Normative architecture-detection baseline starts below.



## Product Scope (v1)

This repository's production scope is fixed to four execution skills:

1. `react-architecture-detection`
2. `react-placement-and-layering`
3. `react-reuse-update-new`
4. `react-implementation-discipline`

`agent-policy-v1` is the shared policy baseline for these four skills and is
not counted as a production execution skill.


### Migration-aware Prime Directive

- Do not introduce a second architecture in parallel.
- Either follow the current structure or introduce the target structure in a clearly isolated migration step.
- Avoid "half-half" placement where old and new architecture are mixed in the same feature scope without a migration boundary.
- Treat the target architecture as a direction to converge toward, not as a reason to break local consistency.
- Optimize for local consistency now and gradual convergence over time.


### Migration-aware Architecture Detection

Before deciding placement in a mixed or legacy repo, scan for existing architecture signals.

#### Required Detection Inputs

- `repo_root`: repository path (or implied current root).
- `target_architecture`: target structure/rules used for evaluation.
- `task_scope`: one of:
  - `small_change`
  - `feature_change`
  - `new_route`
  - `refactor`

#### Optional Detection Hints

- `framework_hint`: `next | vite | cra | remix | unknown`.
- `router_hint`: `react-router | tanstack-router | next-app-router | unknown`.
- `state_hint`: `react-query | redux | zustand | unknown`.

#### Scan Routing and Entry Points

- Look for existing route entry patterns (`pages/`, `routes/`, Next `app/`, router setup in `src/router*` or `App.tsx`).

Concrete routing signal examples:

- Next.js:
  - `src/app/**/page.tsx` or `app/**/page.tsx`
  - `next.config.*`
  - imports from `next/navigation` or `next/router`
- Remix:
  - `app/routes/*`
  - `remix.config.*`
- React Router / TanStack Router:
  - `RouterProvider`, `createBrowserRouter`
  - `Routes`, `Route`
  - `@tanstack/router`

#### Scan UI Conventions

- Identify current component conventions (`components/`, `shared/`, `common/`, `ui/`).
- Detect design-system structures like `atoms/` and `molecules/`.

#### Scan Data Access Conventions

- Identify existing backend-access homes (`api/`, `services/`, `client/`).
- Confirm current server-state and state-management stack (for example QueryClientProvider, Redux, Zustand).

#### Scan Domain Boundaries

- Detect existing domain partitioning (`features/`, `modules/`, `domains/`) or absence of boundaries (flat structure).

#### Classify Current Repo Shape

Classify the repository as:

1. Already close to target architecture (for example `features`, `ui`, `api` already present).
2. Different but internally structured (for example route-based/components-based).
3. Flat/ad-hoc (concerns mixed together).

#### Determine Clear Existing Home

Treat a concern home as "clear" when at least one signal is true:

- Most related files already live there (about 70% or more).
- Most imports for that concern resolve there.
- Recent active edits in that concern consistently use that location.

If no home is clear, treat the repo as ambiguous for that concern and use fallback defaults.

#### Architecture Detection Output Contract

Architecture detection must output a single JSON object with these fields:

- `routing.type`
- `ui.home`
- `api.home` (this value is the canonical endpoint layer used by boundary checks for that task)
- `domain.organization`
- `gravity_map`
- `alignment_score` (0-100)
- `strategy`
- `notes[]`

`alignment_score` (`0-100`) is a derived presentation score; gravity confidence (`0.0-1.0`) drives placement thresholds.
Include `alignment.blockers` and `alignment.next_migration_step` in downstream-ready output so subsequent skills can reuse migration context without recomputation.

Gravity decisions are owned by Architecture Detection (Skill 1) and must be reused by subsequent skills in the same task.
Subsequent skills must not recompute or override gravity within the same task unless a pause is triggered and explicitly resolved.

#### Skill 1 Non-goals

- No feature implementation.
- No file moves/renames as part of detection.
- No new folder creation during detection output generation.
- No refactors during detection.

#### Bootstrap Phase (New/Early Repo)

Trigger:

- Architecture Detection (Skill 1) classifies the repository as `flat/ad-hoc`.
- Gravity confidence is a normalized score from `0.0` to `1.0`, where `>= 0.7` indicates a clear existing home.
- No clear homes exist for UI/API/routing/domain (gravity confidence `< 0.7` for each concern).

Allowed folder creation during bootstrap:

- Create only from the canonical set:
  - `pages/`
  - `features/`
  - `ui/primitives/`
  - `ui/composites/`
  - `api/client/`
  - `api/dto/`
  - `api/endpoints/`
  - `core/`
  - `lib/`
  - `hooks/`
  - `config/`
- Create `store/` only when truly global client-state is required.

Bootstrap rules:

- Prefer minimal bootstrap: create only folders needed for the current task.
- Do not create speculative structure that is unused by the current task.

Exit condition:

- Once a canonical home exists for a concern, creation of alternative homes for that concern is forbidden without explicit migration mode.


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


### Two-Architectures Anti-pattern

Avoid mixed placement where two locations are both treated as correct for the same concern.

- Bad examples:
  - Some shared UI in `src/ui/primitives/` and other shared UI in `src/components/common/`.
  - Some backend access in `src/api/endpoints/` and other backend access in `src/services/api/`.
- Rule:
  - If the repository already has "the place", use it.
  - If it does not, introduce one place and apply it consistently.


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

## Architecture Detection

- Primary output: repository classification, gravity map, and migration
  strategy.
