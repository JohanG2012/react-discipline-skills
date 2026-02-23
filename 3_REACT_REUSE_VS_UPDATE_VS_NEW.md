
---

# Skill 3: React Reuse vs Update vs New

## Purpose

Given a proposed plan (what needs to be built and where), decide for each needed artifact:

* **Reuse as-is**
* **Update existing to support reuse**
* **Create new**

…and output a refined plan with:

* concrete reuse targets (exact files)
* update proposals (minimal diffs)
* new artifacts only where justified
* explicit avoidance of leaky “mode flag” abstractions

This skill is the gatekeeper that prevents:

* duplicating primitives/composites unnecessarily
* over-generalizing sections
* creating “one component to rule them all”
* spreading domain logic into UI layers

---

# Inputs

### Required

* `detection_result` (Skill 1)

  * `gravity_map`, `strategy`, existing conventions
* `placement_plan` (Skill 2)

  * artifacts list with paths + layers + purposes
* `repo_index` (or ability to search repo)

  * file list and/or searchable content

### Optional

* `reuse_thresholds` (tunable)

  * `max_new_props_for_update`: default 2
  * `max_flags_allowed`: default 0 for composites, 1 for primitives (rare)
  * `max_abstraction_risk_score`: default 6/10

---

# Output Contract

```json
{
  "skill": "react_reuse_update_new",
  "decisions": [
    {
      "needed_artifact": "ui/composites/FilterBar",
      "decision": "reuse|update|new",
      "target_path": "src/ui/composites/FilterBar.tsx",
      "changes": [
        {
          "type": "update",
          "summary": "Add optional rightSlot prop for actions; no domain flags",
          "files": ["src/ui/composites/FilterBar.tsx"]
        }
      ],
      "reasoning": {
        "fit": 8,
        "coupling_risk": 2,
        "divergence_risk": 3,
        "complexity_cost": 2
      }
    }
  ],
  "revised_plan": { "...same shape as placement_plan..." },
  "guardrails": [
    "No domain flags in ui/composites",
    "Duplicate sections over making composites multi-mode"
  ]
}
```

Numbers are relative scores (0–10). No extra prose beyond concise summaries.

---

# Core Concepts (the rules it enforces)

## The “Reuse Ladder”

For each required capability/component, evaluate in order:

1. **Reuse as-is** (best)
2. **Update existing** (only if small + improves generality cleanly)
3. **Create new** (when reuse/update would cause leakage or flags)

---

# What it must search for (repo lookups)

For each planned artifact, search in this order:

## A) Exact or near-name match

* `FilterBar`, `Toolbar`, `Modal`, `Table`, `Card`, `Button`
* feature equivalents: `ProjectsListSection`, `ProjectRow`, etc.

## B) Pattern match

Look for components with similar responsibilities even if names differ:

* “search input + chips + sort” → could already exist
* “empty/loading/error shell” → could exist

## C) Underlying primitives

If no composite matches, see if primitives exist to compose it.

## D) Existing API endpoints/DTOs/hooks

* endpoint already exists?
* DTO already exists?
* query hook already exists?

The output must reference actual found paths, or explicitly say “not found”.

---

# Decision Heuristics (deterministic scoring)

Each candidate is scored on four axes (0–10):

## 1) Fit score

How close is it to what we need?

* 10: identical
* 7–9: minor prop wiring
* 4–6: significant differences
* 0–3: wrong abstraction

## 2) Complexity cost

How many changes are needed to reuse?

* props needed
* flags needed
* conditionals introduced

## 3) Coupling risk

Will reuse force unrelated domains to depend on each other?

* domain terms in UI
* feature importing another feature
* API leaking into UI

## 4) Divergence risk

Likelihood the two usages will want to diverge in UX soon.

* if yes: reuse becomes a future fight

---

# Hard Rules (non-negotiable)

## Rule 1: No domain flags in `ui/composites`

Forbidden:

* `variant="tasks|projects|finance"`
* `mode="project|task"`

If you need that, create:

* a domain **section** that composes the composite
* or a domain-specific component inside the feature

Allowed:

* generic slots: `leftSlot`, `rightSlot`, `toolbar`, `actions`
* generic behavior: `isLoading`, `error`, `onRetry`

---

## Rule 2: Prefer duplicating sections over generalizing them

If reuse is between:

* `features/tasks/sections/*`
* and `features/projects/sections/*`

Default: **duplicate**, and share only:

* primitives/composites
* pure functions
* generic hooks

Only reuse a section across routes if it’s within the same domain.

---

## Rule 3: Only update primitives/composites if it stays simple

Update allowed if:

* ≤ 2 new props
* no new “mode” flags
* no domain knowledge introduced
* existing users won’t break (or easy to update)

If it needs more: create a new composite OR keep logic in section.

---

## Rule 4: Endpoint reuse is encouraged; mapping reuse is not guaranteed

* Reuse endpoint calls if same endpoint
* DTOs can be shared
* Mapping DTO → domain belongs to feature (may differ)
  So do not centralize mapping unless stable and cross-domain.

---

# Decision Outcomes

For each needed artifact, choose one:

## ✅ Reuse

Choose if:

* Fit ≥ 8
* Complexity cost ≤ 3
* Coupling risk ≤ 3
* Divergence risk ≤ 4

## ✅ Update existing

Choose if:

* Fit ≥ 6
* Required changes are small (≤ 2 props or a small slot addition)
* Coupling risk stays low
* Doesn’t introduce “variant/mode” flags in composites

## ✅ New

Choose if:

* Fit is low OR
* update would require multiple flags OR
* divergence risk is high OR
* reuse causes coupling/domain leakage

---

# Refining the plan (what the skill produces)

The skill must output:

1. **Revised plan**

* replace “create new FilterBar” with “reuse existing FilterBar”
* or “update existing FilterBar + compose in section”

2. **Update list**

* minimal changes required
* which files
* what props/slots/interfaces

3. **New artifacts list**

* only what remains necessary
* with justification (“existing options would introduce mode flags”)

---

# Examples (how it should decide)

## Example A: Two features both need a filter toolbar

* Existing `ui/composites/Toolbar.tsx` exists but lacks `rightSlot`.
  Decision: **Update composite** (add `rightSlot`), then reuse.

## Example B: Projects section vs Tasks section look similar

Decision: **Duplicate section**, reuse primitives/composites.

## Example C: Need a “MasterDetailLayout”

If there’s already `SplitPane` composite:
Decision: **Reuse** or **Update** with small prop if needed.

---

# Non-goals

This skill does NOT:

* implement full code (Skill 4 does)
* restructure folders (Skill 1/2 decide strategy)
* do large refactors

It only decides reuse/update/new and produces a refined plan.

---

