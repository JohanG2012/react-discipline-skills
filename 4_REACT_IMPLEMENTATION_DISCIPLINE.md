
---

# Skill 4: React Implementation Discipline

## Purpose

Implement the change **exactly according to the revised plan**, while enforcing:

* folder rules + import direction
* minimal diffs and minimal churn
* consistent patterns already used in the repo
* file size/complexity limits
* no architecture drift
* safe reuse/extension of existing components

This skill writes code.

---

# Inputs

### Required

* `revised_plan` (from Skill 3)

  * list of files to create/update, with target paths + layer classification
* `detection_result` (from Skill 1)

  * repo conventions: router, state, UI patterns, error handling
* `reuse_decisions` (from Skill 3)

  * which files to reuse/update and what minimal updates are allowed
* `repo_context`

  * the relevant existing files’ contents (or ability to search/read)

### Optional

* `diff_preference`

  * you personally like “only updated snippets”; the skill can output changes as diffs or patch-style
* `strictness`

  * `strict` (default) | `lenient`
* `max_lines_policy`

  * the soft caps you defined

---

# Output Contract

Two modes:

## Mode A — Patch output (recommended)

Return:

* list of changed files
* unified diffs (or “updated snippets only”) for each file

## Mode B — File output (only if needed)

Return full files only when:

* new files are created
* or repo requires it

**Never** output unrelated full files.

---

# Core Constraints (what it must enforce)

## 1) Plan fidelity

* Only touch files in `revised_plan`, unless:

  * a compile error forces a minimal additional touch
  * or an import/export requires adding a barrel export

If additional files are touched, list them and explain why (1 line).

---

## 2) Import boundary enforcement

Before finalizing, check each modified file for forbidden imports:

* `ui/**` must not import `features/**`, `api/**`, `store/**`
* `api/**` must not import React
* `pages/**` must not call `api/endpoints/**` directly
* feature hooks may import `api/**` but not `pages/**`

If a boundary violation is needed, revise approach instead of breaking rules.

---

## 3) Minimal churn policy

Avoid “refactor because nice”.
Do not:

* rename unrelated files
* reorder exports everywhere
* reformat whole files
* switch libraries
* change patterns not required for the task

Keep diffs tight.

---

## 4) File size discipline (soft caps)

If implementation would exceed caps:

* extract into the next lower layer
* split sections/hooks
* move pure logic into `domain/` or `lib/`

Soft caps:

* pages: 120–150
* sections: 200–250
* composites: 200–250
* hooks: 150–200
* endpoints: 80–120
* primitives: 150

Red flags:

* > 400 lines: must split
* > 600 lines: hard stop, refactor required

---

## 5) Consistency with repo conventions

The skill must inspect the closest existing analog and copy the style:

* naming
* exports (default vs named)
* error handling shape
* React Query key conventions
* file naming (`.tsx` vs `.ts`)
* path aliases (`@/` vs relative)

**No invented patterns** if repo already has one.

---

# Implementation Procedure (LLM checklist)

## Step 1 — Read the relevant neighbors

For every file to be created/updated, inspect:

* nearest sibling files in same folder
* a similar feature/hook/component

Goal: match conventions.

Output: none; this is internal discipline.

---

## Step 2 — Implement from bottom-up

Apply in this order to avoid rework:

1. `api/dto` types (if needed)
2. `api/endpoints` functions (thin, DTO-returning)
3. feature domain/adapters (mapping, pure functions)
4. feature hooks (React Query integration)
5. UI primitives/composites updates (if required by reuse decisions)
6. feature sections (compose hooks + UI)
7. pages (compose sections)

---

## Step 3 — Keep UI generic where required

When editing `ui/composites`:

* use slots/children
* do NOT add domain props or enums
* do NOT import domain types

When editing `ui/primitives`:

* allow small ergonomic props
* do NOT add “mode flags”

---

## Step 4 — Avoid leaky abstractions

If you feel tempted to add:

* `variant`
* `mode`
* `context`
  …stop and instead:
* keep it in a section
* or add a slot
* or duplicate a section

---

## Step 5 — Ensure predictable data flow

* endpoints return DTO
* feature maps DTO → domain (if you have domain models)
* section renders domain
* page composes sections

No “fetch inside component”.

---

## Step 6 — Wire exports minimally

If repo uses barrels, update the nearest barrel only.
If not, avoid adding new `index.ts` unless already used.

---

## Step 7 — Quick validation checks (LLM-level)

Before final output, ensure:

* no circular imports were introduced
* no forbidden imports
* new code references existing types correctly
* query keys stable
* loading/error states handled consistent with repo

If tests exist:

* add or adjust only if needed by the change

---

# What it should do when it hits ambiguity

If two patterns exist in repo (messy):

* follow Skill 1 strategy:

  * `follow-existing`: mimic the area you’re modifying
  * `introduce-boundaries`: keep new code consistent within the new module
  * `migrate-as-you-touch`: move only the touched file if it reduces confusion

If still ambiguous:

* choose the **lowest-churn** option.

---

# What it should output (format guidance)

The skill should output:

1. **Changed files list**
2. For each file:

   * if updated: only the changed snippets or a unified diff
   * if new: full file content
3. A short “Discipline report” (bullets) containing only:

   * boundary checks passed
   * any exceptions (extra touched files) and why

Example:

* “No UI→feature imports added.”
* “Added 1 new prop to FilterBar; no mode flags introduced.”

---

# Non-goals

This skill does NOT:

* re-architect the repo
* rename folders
* do “cleanup refactors”
* add new tooling

It implements the requested change cleanly.

---

## Optional: add a “Stop conditions” section (useful for LLM)

The skill must STOP and revise plan (not push forward) if it would require:

* domain knowledge inside `ui/**`
* endpoint fetch outside `api/**`
* more than 2 new props to make a composite reusable
* > 400 line file without extracting

---
