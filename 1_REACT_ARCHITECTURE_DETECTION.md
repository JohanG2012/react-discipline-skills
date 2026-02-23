
---

# Skill 1: React Architecture Detection

## Purpose

Given a codebase, detect:

1. how the repo is currently organized (routing, UI, domain/features, API/data, state),
2. whether it matches the target architecture,
3. which migration strategy to use (Follow existing vs Introduce target vs Migrate-as-you-touch),
4. a “folder ownership map” the other skills will follow.

This skill **does not implement features**. It only produces a map + decision.

---

# Inputs

### Required

* `repo_root`: path (or implied root)
* `target_architecture`: the preferred structure (your spec)
* `task_scope`: one of:

  * `"small_change"` (1–3 files)
  * `"feature_change"` (new capability)
  * `"new_route"`
  * `"refactor"`

### Optional

* `framework_hint`: `"next" | "vite" | "cra" | "remix" | "unknown"`
* `router_hint`: `"react-router" | "tanstack-router" | "next-app-router" | "unknown"`
* `state_hint`: `"react-query" | "redux" | "zustand" | "unknown"`

---

# Detection Steps (LLM reasoning checklist)

## Step A — Identify routing system

Search for these signals (in order):

### Next.js

* `src/app/**/page.tsx`
* `app/**/page.tsx`
* `next.config.*`
* `next/navigation`, `next/router`

### Remix

* `app/routes/*`
* `remix.config.*`

### React Router / TanStack Router

* `RouterProvider`, `createBrowserRouter`
* `Routes`, `Route`
* `@tanstack/router`

**Output:**

* `routing.type`: `"next-app-router" | "next-pages-router" | "react-router" | "remix" | "tanstack-router" | "unknown"`
* `routing.entry_points`: list of route entry files/folders

---

## Step B — Identify where UI components live

Detect if any of these exist and are used widely:

* `src/components/`
* `src/shared/`
* `src/common/`
* `src/ui/`
* Atomic design: `atoms/`, `molecules/`, `organisms/`

Also detect if there’s a design system (shadcn etc).

**Output:**

* `ui.home`: preferred existing location (single winner)
* `ui.substructure`: primitives/composites-ish pattern if present
* `ui.dump_drawer_risk`: boolean (if `shared/common` exists and is huge)

---

## Step C — Identify domain organization (features/modules)

Detect whether domain exists as:

* `src/features/`
* `src/modules/`
* `src/domains/`
* or none (flat pages + components)

**Output:**

* `domain.organization`: `"features" | "modules" | "routes" | "flat" | "mixed"`
* `domain.homes`: list of likely domain folders

---

## Step D — Identify data access (API/services)

Detect where fetch logic lives by scanning for:

* `fetch(`, `axios`, `ky`, `graphql-request`
* `/api/`, `/services/`, `/clients/`, `/lib/http`

Classify into:

* centralized API client
* endpoint modules
* hooks doing fetch directly
* components doing fetch directly

**Output:**

* `data_access.pattern`: `"root-api" | "services" | "feature-owned" | "inline-fetch" | "mixed"`
* `data_access.home`: best current location
* `data_access.violations`: e.g. “fetch in components”

---

## Step E — Identify state management

Detect:

* React Query: `QueryClientProvider`, `useQuery`
* Redux Toolkit: `configureStore`, slices
* Zustand: `create(` from zustand
* Jotai/Recoil/etc

**Output:**

* `state.server`: `"react-query" | "swr" | "custom" | "none" | "unknown"`
* `state.client`: `"redux" | "zustand" | "context" | "local-only" | "unknown"`
* `state.home`: where store lives

---

## Step F — Identify existing conventions + “gravity”

This is crucial.

The skill must choose **one home per concern** based on:

* number of files already there
* import frequency (what most code imports from)
* naming patterns (page.tsx, *.route.tsx, etc.)

**Output:**
A “gravity map”:

* routing home
* ui home
* domain home
* api home
* store home
* utils/lib home

---

# Decision: Choose strategy A/B/C

## Strategy A: Follow existing

Choose if:

* repo has clear structure already (even if not your preferred)
* adding your structure would create duplicates (`components/` + `ui/` etc.)
* task scope is small

## Strategy B: Introduce target at boundaries

Choose if:

* repo is flat/messy
* there is no strong gravity for UI/API
* task scope is a new feature/new route

## Strategy C: Migrate-as-you-touch

Choose if:

* repo is partially aligned
* you’re changing the area anyway
* moving reduces confusion immediately

**Output:**

* `strategy`: `"follow-existing" | "introduce-boundaries" | "migrate-as-you-touch"`
* `rationale`: short bullet list

---

# Output Contract (what the skill returns)

This should be *machine-consumable* for other skills.

```json
{
  "skill": "react_architecture_detection",
  "routing": {
    "type": "react-router",
    "entry_points": ["src/main.tsx", "src/router.tsx"]
  },
  "ui": {
    "home": "src/components",
    "substructure": "flat",
    "dump_drawer_risk": true
  },
  "domain": {
    "organization": "flat",
    "homes": ["src/pages"]
  },
  "data_access": {
    "pattern": "services",
    "home": "src/services",
    "violations": ["fetch-in-components", "fetch-in-hooks-without-api-layer"]
  },
  "state": {
    "server": "react-query",
    "client": "zustand",
    "home": "src/store"
  },
  "gravity_map": {
    "pages_or_routes": "src/pages",
    "domain_modules": "src/features",
    "ui_primitives": "src/components/ui",
    "ui_composites": "src/components/composites",
    "api": "src/services/api",
    "store": "src/store",
    "pure_utils": "src/lib",
    "generic_hooks": "src/hooks",
    "app_setup": "src/core"
  },
  "strategy": "follow-existing",
  "notes": [
    "Do not create src/ui because src/components is already dominant.",
    "Keep API in src/services/api to avoid duplicate homes."
  ]
}
```

---

# “Target architecture alignment” output

It should also score how close the repo is:

* `alignment.score` from 0–100
* `alignment.blockers`: e.g. “two competing UI folders”
* `alignment.next_migration_step`: 1 recommended step, not 10

Example:

* “Create `src/core` and move providers there” *or*
* “Create `src/features/<newDomain>` for new work only”

---

# What it should NOT do

* No refactors
* No creating folders
* No moving files
* No implementing features

Only detection + mapping + strategy.

---
