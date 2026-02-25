# Master Spec: React Refactoring Progression (Optional Extension Skill)

This document aggregates sections migrated from root `SPEC.md` for
`react-refactoring-progression`.

## Contents

- [Document Structure](#document-structure)
- [Appendix A: Shared Project Setup and Tooling](#appendix-a-shared-project-setup-and-tooling)
- [Appendix B: Relevant Specs/Skills Repository Layout](#appendix-b-relevant-specsskills-repository-layout)
- [Status](#status)
- [Position in Skill Model](#position-in-skill-model)
- [Core Philosophy](#core-philosophy)
- [Execution Modes](#execution-modes)
- [Refactor Progression Ladder](#refactor-progression-ladder)
- [Behavior Preservation Rules](#behavior-preservation-rules)
- [Refactor Governor](#refactor-governor)
- [Scope Controls](#scope-controls)
- [Output Contract (Plan-Only)](#output-contract-plan-only)
- [Interaction With Other Skills](#interaction-with-other-skills)
- [Promotion Path](#promotion-path)
- [Decisions Locked for v1](#decisions-locked-for-v1)
- [Remaining Open Questions](#remaining-open-questions)
- [Primary Detection Target](#primary-detection-target)
- [Step Ordering Rule](#step-ordering-rule)
- [Anti-Pattern Detection (v1)](#anti-pattern-detection-v1)
- [Additional Anti-Patterns (v1)](#additional-anti-patterns-v1)
- [Semantic Duplication Detection (Structural Abstraction Candidates)](#semantic-duplication-detection-structural-abstraction-candidates)
- [Refactor Progression Model (Finalized)](#refactor-progression-model-finalized)

---
## Document Structure

- The normative baseline for this document begins at `## Status` and continues
  through `## Refactor Progression Model (Finalized)`.
- This document captures migrated blocks from root `SPEC.md` in sequential
  passes.
- Appendix text provides setup/layout context; if appendix wording conflicts
  with normative sections, normative sections take precedence.

## Appendix A: Shared Project Setup and Tooling

### Build requirements

#### Goals

- Ensure every skill has:
  - `SKILL.md` with frontmatter
  - `AGENTS.md` generated from `rules/`
- Ensure generated `AGENTS.md` stays current in pull requests.
- Validate schema-bound examples when output schemas exist.

#### Node version

- Use Node `20` LTS.

### `package.json` recommended scripts

```json
{
  "scripts": {
    "build": "npm run build:agents",
    "build:agents": "node scripts/generators/generate_agents.mjs",
    "check": "npm run check:frontmatter && npm run check:shared && npm run check:agents && npm run check:examples && npm run check:handoffs"
  }
}
```

### Developer workflow baseline

1. Edit rule sources under `shared/rules` and/or `skills/*/rules`.
2. Run `npm run build:agents`.
3. Run `npm run check`.
4. Commit source updates and generated `AGENTS.md` artifacts together.

## Appendix B: Relevant Specs/Skills Repository Layout

```text
repo/
  SPEC.md
  master_spec.md
  shared/
    SKILL.md
    rules/
  skills/
    react-architecture-detection/
    react-placement-and-layering/
    react-reuse-update-new/
    react-implementation-discipline/
    react-refactoring-progression/   (optional extension; when enabled)
  specs/
    001-agent-policy-v1/
    002-skill-react-architecture-detection/
    003-skill-react-placement-layering/
    004-skill-react-reuse-update-new/
    005-skill-react-implementation-discipline/
  scripts/
    generators/
    validators/
```

> Normative baseline starts below.

## Status

Draft v1 - Optional Extension Skill

## Position in Skill Model

### Classification

- Type: Optional Extension Skill.
- Does NOT modify the fixed production execution set:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`

### Purpose in Ecosystem

This skill augments implementation quality by providing:

- deterministic refactor prioritization
- progressive alignment toward architectural standards
- opportunistic improvements within bounded scope

It does NOT:

- replace implementation discipline
- recompute architecture gravity
- perform placement decisions
- modify the constitution or shared baseline

## Core Philosophy

> Improve code safely, locally, and progressively.

Refactoring must be:

1. behavior-preserving by default
2. scope-bounded
3. architecture-aligned
4. ordered by leverage

Escalation is allowed only when:

- lower tiers are exhausted
- a compliance violation blocks correctness
- explicit migration scope is enabled

## Execution Modes

### Mode A - Opportunistic (Default)

Used automatically as a planning consult at the end of
`react-implementation-discipline`, for both:

- micro mode
- standard mode

Constraints:

- only files already touched by the primary implementation plan (or the bounded
  micro-change file set)
- no new files (unless folderization threshold is hit and stays within the same
  gravity home)
- no moves/renames
- no routing changes
- no new dependency introduction
- no behavior change

Goal:
"Leave the file better than you found it" (within touched files only).

Allowed changes:

- dead code removal
- import cleanup
- naming clarity improvements
- local helper extraction (same file or colocated)
- type tightening
- boundary conformance fixes (non-structural)

### Mode B - Dedicated Refactor Task

Explicitly requested refactor session.

May:

- touch multiple files (within scope governor)
- propose move actions (`<=3` unless migration mode enabled)
- propose folderization
- propose scope expansion

Must:

- follow refactor progression ladder
- start at lowest tier
- escalate only when justified

## Refactor Progression Ladder

### Tier 0 - Safety and Correctness (Always First)

- remove dead code
- remove unused imports
- fix obvious type issues
- simplify redundant conditionals
- improve unclear variable naming (local only)

Risk: Very Low  
Behavior change: None

### Tier 1 - Boundary Conformance

- fix forbidden imports
- align fetching to canonical endpoint layer
- move misplaced helpers to correct layer
- normalize error ownership alignment

Risk: Low-Medium  
Behavior change: None

### Tier 2 - Responsibility and Structure

- split oversized components (`>250-300` lines)
- folderize when threshold is hit
- extract repeated local logic
- normalize section vs composite separation

Risk: Medium  
Behavior change: None

### Tier 3 - Safe Abstraction Upgrades

- extract reusable composite with slots (not flags)
- extract shared domain helpers (used in `>=2` places)
- normalize patterns across the same feature domain

Risk: Medium  
Behavior change: None

Constraints:

- `<=2` new props for update
- no domain flags in shared composites
- divergence risk must be low

### Tier 4 - Systemic Migration (Explicit Only)

- cross-home file moves
- router/state architecture changes
- global structure realignment

Requires:

- explicit migration scope
- move-cap compliance
- scope-expansion approval

Risk: High

## Behavior Preservation Rules

### Default Invariants (Behavior-Preserving = TRUE only if all hold)

#### Backend contract invariants (Hard)

- do not change frontend-backend contract
- no changes to endpoints, HTTP methods, request/response shapes, params,
  headers, or payload schemas
- refactoring may relocate transport logic (within canonical endpoint-layer
  rules) but must not alter request semantics

#### UI/UX invariants (Hard)

- do not change rendered UI in major user-noticeable ways
- do not introduce UI/UX breakage or new bugs
- allowed: very small visual consistency adjustments unlikely to be user-noticed
  (for example consolidating visually-equivalent controls)

#### Behavioral invariants (Hard)

- no changes to external component contracts (props/events) unless strictly
  equivalent and callers remain compatible
- no changes to route paths or navigation behavior
- no changes to query keys or caching semantics
- no changes to user-facing error/empty/loading behavior

### Proof and Validation Expectations

- if a project has tests:
  - prefer test-first posture for refactor work that can affect UI/UX
  - ensure relevant UI/UX behavior is covered before refactoring
  - all tests must pass after changes
- always:
  - boundary audit must pass
  - type correctness must remain valid
  - no new lint/type/test failures are introduced

If any invariant cannot be guaranteed:

- mark the refactor step as not behavior-preserving and require explicit
  approval (or exclude that step).

## Refactor Governor

Escalation conditions:

1. A lower-tier improvement blocks compliance.
2. No meaningful Tier 0-1 improvements remain.
3. Explicit refactor task is declared.

Never escalate for:

- aesthetic cleanup
- style-only churn
- "refactor for future" reasoning

### Anti-"refactor for vibes" enforcement

Every refactor step must include:

- `why_now`
- one of:
  - `unblocks` (what it enables/unblocks)
  - `reduces_future_cost` (what future complexity/drift it prevents)
  - `standard_alignment` (how it moves code closer to the repository's
    intended react-* skill standards, improving future agent effectiveness)

## Scope Controls

### Dedicated Refactor Task (Mode B)

Default caps (inherited from shared baseline unless explicitly overridden):

- max files touched: 8
- max new files: 4
- max moved/renamed files: 0 (unless explicit migration scope)
- max new dependencies: 0
- max new top-level folders: 0

If materially better completeness exceeds caps:

- emit `scope_expansion_needed[]` with (`why`, `would_touch`) and keep an
  in-cap plan

### Opportunistic Mode (Mode A)

Scope is strictly bounded to the already-touched file set from
`react-implementation-discipline` execution.

- allowed files = exactly the files already modified in the primary task
- opportunistic mode must not add any new files to the touched set
- opportunistic mode inherits the size of the primary touched set:
  - if the primary task touched 1 file, opportunistic may refactor in that 1
    file
  - if the primary task touched N files by explicit approved scope override,
    opportunistic may refactor within those N files

Additional constraints (opportunistic):

- no moves/renames
- no routing changes
- no new dependencies
- new files are disallowed except when folderization is mandatory by rule
  (e.g., `>400` lines) and stays within the same gravity home

## Output Contract (Plan-Only)

```json
{
  "schema_version": "1.0.0",
  "skill": "react-refactoring-progression",
  "version": "1.0.0",
  "result_type": "refactor_plan|validation_error|dependency_error",
  "refactor_mode": "opportunistic|dedicated",
  "plan": {
    "touch_budget": {},
    "steps": [
      {
        "tier": 0,
        "title": "Remove unused imports",
        "files": [],
        "change_type": "safety",
        "risk": "low",
        "behavior_change": "none",
        "why_now": "improves clarity without risk"
      }
    ],
    "scope_expansion_needed": []
  },
  "notes": []
}
```

This skill does not emit implementation patches.
`react-implementation-discipline` consumes this plan when allowed.

## Interaction With Other Skills

- must not recompute gravity
- must respect placement decisions and canonical endpoint layer
- must not override reuse decisions
- must not implement directly

Default usage:

- `react-implementation-discipline` consults this skill at the end of execution
  (micro or standard) to generate an opportunistic refactor plan limited to
  already-touched files

Standalone usage:

- may be invoked as a dedicated refactor task when explicitly requested

## Promotion Path

If this skill becomes always-on and mandatory in pipeline:

- reclassify as production execution skill in v2
- update fixed execution skill list
- update shared baseline

Until then:

- remains optional extension
- no constitutional changes required

## Decisions Locked for v1

1. Classification: Optional extension skill.
2. Output mode: Plan-only.
3. Default invocation: `react-implementation-discipline` consults this skill at
   end of execution (micro + standard) to produce an opportunistic refactor
   plan.
4. Opportunistic mode never expands the touched-file set (except the explicit
   test-file exception below).
5. Tier C+ findings in opportunistic mode never block
   `react-implementation-discipline` completion; they are surfaced as follow-up
   suggestions only.
6. Folderization in opportunistic mode:
   - mandatory when a touched component exceeds `~400` lines
   - also allowed at `~250-300` lines when it clearly reduces responsibilities
7. Opportunistic plan step cap: default 5 steps (highest leverage first).
8. Tests: in opportunistic mode, test files may be created/updated without
   counting toward the refactor skill's touched-file budget, as long as:
   - no new dependencies are introduced
   - tests remain directly relevant to the touched behavior
   - changes stay small (default: `<=2` test files) unless explicit scope
     expansion is requested

### Definition: "Clearly reduces responsibilities" (250-300 line folderization)

Folderization at `~250-300` lines is allowed only when at least one is true and
the split is behavior-preserving:

- the file has 2+ distinct responsibilities (for example orchestration + heavy
  rendering helpers + data shaping)
- the file contains 3+ meaningful internal subcomponents that can be separated
  cleanly
- there is a non-trivial local helper pile (formatting/derived-state/keyboard
  handling) that is component-scoped and can be isolated into `*.utils.ts` /
  `*.types.ts` within the component folder
- the change reduces the main component file to a single clear responsibility
  and materially improves readability (`<= ~200` lines target for the main file
  after split)

## Remaining Open Questions

None.

## Primary Detection Target

The primary purpose of this skill is to identify and plan refactor steps for
issues that violate or drift from the standards enforced/assumed by Skills 1-4:

- `react-architecture-detection` (Architecture Detection): gravity/home drift,
  competing concern homes, unclear canonical endpoint layer usage
- `react-placement-and-layering` (Placement & Layering): misplaced artifacts,
  wrong layer ownership, duplicate homes
- `react-reuse-update-new` (Reuse vs Update vs New): leaky abstractions, flag
  explosions, unsafe generalization, missed reuse opportunities that cause drift
- `react-implementation-discipline` (Implementation Discipline): boundary
  violations, endpoint bypass, unsafe fetching locations, missing runtime state
  handling patterns

Non-goal:

- the skill should not propose refactors that are purely aesthetic or
  preference-driven

## Step Ordering Rule

Refactor step ordering is risk-based only:

- low risk / behavior-preserving / local steps first
- higher risk / more structural steps last

No additional deterministic ordering within a tier is required beyond:

- tier ordering (A -> B -> C -> D)
- risk ordering within the produced step list

## Anti-Pattern Detection (v1)

### Anti-Pattern #1: Implicit Visibility in Shared Presentational Component

#### Definition

A shared presentational component (in `ui/primitives/**` or
`ui/composites/**`) conditionally renders itself (`return null`) based on
props, while the parent assumes it will render.

#### Why This Is a Problem

- hidden control flow
- blurred responsibility ownership
- increased abstraction weight in shared UI
- reduced compositional clarity
- weakens alignment with Skills 1-4 boundaries

#### Refactor Rule

Visibility must be owned by the component that owns the state controlling it.

Refactor pattern:

- move conditional rendering to parent
- make shared presentational child render deterministically based on required
  props

#### Detection Heuristic

Flag when all are true:

- component lives in `ui/primitives/**` or `ui/composites/**`
- component conditionally returns `null`
- condition is based on external props it does not own
- component is not explicitly a boundary/guard wrapper

#### Tier Classification

- Tier A (low risk, behavior-preserving)
- opportunistic mode eligible
- should be ordered early in refactor progression

## Additional Anti-Patterns (v1)

### Anti-Pattern #2: Fetch Outside Canonical Endpoint Layer

#### Definition

Network/transport logic (for example `fetch`, `axios`, or equivalent) exists
outside the canonical endpoint layer defined by architecture detection.

#### Why This Is a Problem

- violates canonical endpoint ownership
- couples UI or feature layers directly to transport
- breaks boundary expectations from Skills 1-4
- reduces refactor safety and backend contract isolation

#### Refactor Rule

- move transport logic into `api/endpoints/**` (or gravity-equivalent home)
- expose data access via feature-level hooks

#### Tier Classification

- Tier B if localized
- Tier C if widely distributed

### Anti-Pattern #3: Domain Leakage into Shared UI

#### Definition

Shared UI components (`ui/primitives/**` or `ui/composites/**`) contain
domain-specific knowledge, naming, imports, or behavioral flags.

#### Examples

- domain-named components inside shared UI
- mode/variant props encoding domain meaning
- importing feature/domain types into shared UI

#### Why This Is a Problem

- breaks clean layering
- encourages flag explosion
- increases divergence risk
- weakens reuse guarantees

#### Refactor Rule

- move domain-aware components into feature-owned sections
- or remove domain knowledge and inject content via slots/children

#### Tier Classification

- Tier B (boundary alignment)

### Anti-Pattern #4: Server-State Mirrored into Global Store Without
Justification

#### Definition

Server-state data (for example React Query cache data) is duplicated into
`store/**` without explicit performance-critical, offline-first, or
architectural justification.

#### Why This Is a Problem

- breaks single source of truth
- creates synchronization bugs
- adds unnecessary coupling
- violates state-discipline rules

#### Refactor Rule

- remove redundant store mirror
- use canonical server-state cache as source of truth

#### Tier Classification

- Tier B if localized
- Tier C if systemic

## Semantic Duplication Detection (Structural Abstraction Candidates)

### Purpose

Detect hard-to-see structural duplication (semantic duplication) that reduces
alignment with Skills 1-4, and propose safe, bounded refactor steps.

This is not "find copy/paste". It is:

> Identify two or more implementations with the same underlying responsibility
> that could be expressed as one abstraction without leakage or prop explosion.

### Scope and Safety

- planning only (no implementation patches)
- must not recommend changes that violate shared policy (no domain flags in
  shared UI, no new homes, no transport in UI, etc.)
- opportunistic mode may only propose changes inside the already-touched file
  set; all other recommendations become follow-up scope

### Duplicate Pattern Definition (Candidate Qualifies Only if All Hold)

1. Responsibility equivalence (same abstract problem).
2. Variation expressibility (differences are representable as `<=2` small
   props/slots OR by extracting a feature-local section/hook).
3. Abstraction safety (no domain logic in `ui/**`, no domain mode flags in
   shared composites, no transport in UI).
4. Divergence risk is acceptable.

### Required Discovery Coverage

The skill should look for candidates across:

- layout skeletons (header/filters/content/pager)
- data-state boundaries (loading/error/empty trees)
- interaction state machines (menus/modals/confirm flows)
- config schemas (table columns, form field schemas)
- hook orchestration (query + mapping + retry/invalidate)
- domain-parallel components (TaskRow vs ProjectRow style)
- mapping pipelines (DTO -> domain normalization patterns)

### Normalization Rule (How Comparison Works)

Before comparing candidates, conceptually normalize away:

- identifier names
- literal strings
- import paths that are domain-specific
- minor wrapper differences

Compare on:

- JSX tree shape
- conditional decision tree shape
- hook usage flow
- state-machine transitions

### Two-Signal Guardrail

A cluster may be labeled a duplication candidate only if it has at least 2
independent similarity signals (for example, responsibility equivalence +
decision tree similarity).

### Extraction Target Rules (Recommend Exactly One)

- `keep_separate`
- `extract_ui_primitive`
- `extract_ui_composite`
- `extract_feature_section`
- `extract_feature_hook`
- `extract_lib_utility`

Constraints:

- recommend `ui/composite` only when differences can be expressed with
  slots/children and do not require domain mode flags
- prefer "one level up": within-feature duplication -> feature extraction first;
  cross-feature duplication -> UI extraction only if leakage risk is low

### Cost/Risk Scoring (Required)

For each candidate cluster, include:

- `abstraction_cost` (new props/slots count, touch estimate)
- `leakage_risk` (low/medium/high)
- `divergence_risk` (low/medium/high)
- `refactor_radius` (local <=3 files, medium 4-8, large >8)

Default heuristics:

- if new props needed >2 OR domain flags are required, do not recommend shared
  UI extraction
- if divergence risk is high, default `keep_separate` or feature-local
  extraction
- large radius recommendations must be follow-up scope

### Required Output per Cluster (Plan Step Metadata)

Every semantic-duplication recommendation must include:

- `why_now`, and one of `unblocks` | `reduces_future_cost` |
  `standard_alignment`
- `recommended_next_step` (one sentence)
- a short description of variation points (no code dumps)

## Refactor Progression Model (Finalized)

### Opportunistic Mode (Auto-consulted by
`react-implementation-discipline`)

Scope is strictly bounded to the already-touched file set from
`react-implementation-discipline`.

Constraints:

- may only operate within files already modified in the primary task
- may not introduce new files (except mandatory folderization within the same
  gravity home when required by rule)
- no moves/renames
- no routing changes
- no new dependencies
- no behavior change

Allowed tiers:

#### Tier A - Reuse Alignment (`react-reuse-update-new` level)

- remove duplication
- simplify abstraction
- extract tiny helper (in-place only)
- reduce flag noise

#### Tier B - Implementation Hygiene (`react-implementation-discipline` level)

- dead code removal
- naming clarity
- local boundary fixes (no moves)
- normalize loading/error handling (no UX change)

Not allowed in opportunistic mode:

- layer changes
- endpoint relocation
- cross-home adjustments
- architectural boundary introduction

### Dedicated Refactor Mode

Used when refactor is explicitly requested.

Default caps (unless explicitly overridden):

- max files touched: 8
- max new files: 4
- max moved/renamed files: 0 (unless migration scope is explicitly enabled)
- no new dependencies without approval

Allowed tiers:

#### Tier A - Reuse Alignment

#### Tier B - Implementation Hygiene

#### Tier C - Placement Corrections (`react-placement-and-layering` level)

- move helpers to correct layer
- extract composite safely
- folderize oversized components
- align endpoint ownership

#### Tier D - Architecture Convergence (`react-architecture-detection` level)

- eliminate duplicate homes
- introduce boundary module
- routing pattern migration
- gravity shifts

Tier D requires explicit migration mode and approval.

### Escalation Order

From lowest risk / least structural impact to highest:

1. Reuse Alignment (`react-reuse-update-new` level)
2. Implementation Hygiene (`react-implementation-discipline` level)
3. Placement Corrections (`react-placement-and-layering` level)
4. Architecture Convergence (`react-architecture-detection` level)

Opportunistic mode is limited to tiers 1-2.
Dedicated mode may escalate to tiers 3-4.
