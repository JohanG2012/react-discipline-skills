
---

# Skill 2: React Placement & Layering

## Purpose

Given:

* an implementation request (feature/change),
* the target folder spec,
* and the current repo’s detected “gravity map” + strategy (from Skill 1),

produce:

* a **file touch plan** (create/update/reuse),
* a **layer classification** for each artifact,
* and **placement decisions** that respect either:

  * the existing structure (follow gravity), or
  * your preferred structure (introduce boundaries / migrate-as-you-touch),

while enforcing import direction rules and avoiding duplicate architectures.

This skill **does not write the full code**. It plans placement.

---

# Inputs

### Required

* `request`: natural language description of what to implement
* `target_arch_spec`: your folder architecture spec + import rules
* `detection_result`: output from Skill 1 (gravity_map + strategy + notes)

### Optional

* `constraints`:

  * `"avoid_new_folders": true|false` (default true)
  * `"max_files_touched": number` (default: none)
  * `"prefer_api_root": true` (you do)
  * `"prefer_react_query": true|false` (if known)
* `existing_artifacts`: (optional) list of existing components/files the user mentions

---

# Output Contract

Return a structured plan:

```json
{
  "skill": "react_placement_and_layering",
  "strategy_used": "follow-existing|introduce-boundaries|migrate-as-you-touch",
  "feature_owner": "projects",
  "artifacts": [
    {
      "purpose": "route entry",
      "action": "create|update|reuse",
      "layer": "pages",
      "path": "src/pages/ProjectsPage.tsx",
      "depends_on": ["src/features/projects/sections/ProjectsListSection.tsx"]
    }
  ],
  "import_guardrails": [
    "ui/* must not import from features/*",
    "api/* must not import React"
  ],
  "notes": [
    "Reuse existing FilterBar composite; do not create new one."
  ]
}
```

No prose required beyond `notes`.

---

# The Decision Procedure (LLM checklist)

## Step 1 — Interpret the request into “needs”

The skill must extract a checklist of needs:

### Possible needs

* Route/page needed? (new route or existing)
* Feature domain owner? (tasks/projects/etc)
* Data access needed?
* UI pattern needed?
* New primitive needed?
* New global state needed?
* New config/env needed?

Output these as `requirements[]`.

---

## Step 2 — Choose the owner feature (single owner)

Even if multiple screens are affected, pick one **primary domain owner**.

Rules:

* If the change touches “Projects” behavior → `projects`
* If cross-domain (auth, telemetry) → `core` or `services` (but per your structure, prefer `core`/`api/client`)

If truly cross-domain and not infra:

* create a new shared domain module only if explicitly requested (rare)

---

## Step 3 — Determine target placement using “strategy_used”

This is where Skill 1’s output matters.

### If strategy is `follow-existing`

* Use the `gravity_map` paths as truth.
* Place new artifacts next to existing similar ones.
* Do not introduce `src/ui` if UI currently lives in `src/components`.

### If strategy is `introduce-boundaries`

* Create your preferred structure only for the new domain module:

  * `src/features/<owner>/...`
* Keep existing UI/API homes if they already exist; don’t duplicate.
* Example: if API exists at `src/services/api`, use it; don’t create `src/api` unless the repo has no API home.

### If strategy is `migrate-as-you-touch`

* When editing a file anyway, you may move it into the preferred folder **if**:

  * it reduces confusion now,
  * the move is local (few imports),
  * and it doesn’t create duplicates.

---

## Step 4 — Classify each new/changed artifact into a layer

### Layer classification rules (strict)

**pages**

* route entry point
* composes sections
* minimal markup
* no fetch

**features/<x>/sections**

* domain-aware orchestration
* calls feature hooks
* composes composites/primitives

**features/<x>/hooks**

* React Query hooks, mutations, feature state hooks
* calls `api/endpoints`

**features/<x>/domain / adapters**

* pure domain logic + mapping
* DTO → domain conversion

**ui/primitives**

* dumb components
* no domain naming
* no API
* minimal derived logic

**ui/composites**

* reusable UI patterns
* domain-agnostic
* uses primitives, slots, generic state

**api/client**

* http client config only

**api/dto**

* raw payload types only

**api/endpoints**

* endpoint calls returning DTO
* no React

**store**

* global client-state only

**core**

* providers, router setup, app shell

**lib**

* pure utilities

**hooks**

* cross-domain hooks only

**config**

* env/config/flags/routes constants

---

## Step 5 — Enforce import guardrails before finalizing plan

For each artifact, the skill must confirm:

* Any UI component in `ui/**` does not import from:

  * `features/**`, `api/**`, `store/**`

* Any `api/**` file does not import React

* `pages/**` does not call endpoints directly

* Fetch happens only in `api/endpoints/**` (or existing repo equivalent if following gravity)

If plan violates guardrails → revise plan.

---

# What this skill should look up in the codebase

Even though it’s “planning”, it must check existence to avoid duplication:

1. **Existing route file(s)** for the feature
2. **Existing sections** in the feature
3. **Existing composites** matching the needed UI pattern
4. **Existing primitives** for required controls
5. **Existing endpoints/DTOs** for the backend call
6. **Existing store slices** if global state is needed
7. **Existing naming/export conventions**

This lookup should be reflected in the plan as `action: reuse|update` rather than creating new.

---

# Reuse vs new (limited scope inside Skill 2)

Skill 2 shouldn’t do full “reuse analysis” (that’s Skill 3), but it should apply one simple rule:

✅ Reuse if clearly already exists.
✅ Update if small + obvious.
✅ Otherwise create new but in correct layer.

If ambiguity is high, Skill 2 should flag it in `notes` and create the safest minimal new artifact.

---

# Example outputs (tiny)

### Example 1: “Add Projects list page using existing backend endpoint”

Plan:

* `pages/ProjectsPage.tsx` (create)
* `features/projects/sections/ProjectsListSection.tsx` (create)
* `features/projects/hooks/useProjectsQuery.ts` (create)
* `api/dto/ProjectDto.ts` (create or reuse)
* `api/endpoints/projects.ts` (update or create)
* reuse `ui/composites/DataTableShell.tsx` if exists

---

# Non-goals

This skill does NOT:

* refactor widely
* create “shared” folders
* invent new conventions
* implement code fully

It produces a placement plan that keeps the repo coherent.

---

