# Mega-File Triage and Extraction Plan

## Summary
Defines mandatory triage and extraction sequencing when touched files exceed
safe size/responsibility thresholds.

---

## Rule: Mega-File Triage and Extraction Plan
**Rule ID:** sr-mega-file-triage  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents unsafe edits and chaotic refactors when a file is far
beyond size/responsibility thresholds.

### Requirement

- Trigger this rule when any touched file is:
  - over 600 LOC (hard stop threshold), or
  - over 400 LOC with clear multi-responsibility signals, or
  - explicitly flagged as an offender (for example, a 1500 LOC component), or
  - below threshold but showing clear prior extraction pattern with obvious
    same-pattern leftovers.
- Freeze behavior and shrink the risk surface:
  - treat work as refactor-only unless the user explicitly requests behavior
    changes,
  - default to no functional changes and preserve output, props, and side
    effects,
  - plan extraction as safe incremental steps, not a rewrite.
- Establish a bounded extraction target:
  - declare `anchor_component` (path plus export),
  - declare `extraction_budget` (how many files may change under scope caps),
  - declare `end_state_goal` as anchor file <= 250-400 LOC (or <= 600 LOC if
    explicitly timeboxed) plus stable module boundaries,
  - if scope caps prevent ideal end state, deliver in-cap reduction and include
    `scope_expansion_needed[]`.
- Continue extraction when prior-pattern signals exist, even below thresholds:
  - if an anchor file shows prior extraction signs (for example colocated
    `*.utils.ts`, `*.types.ts`, `components/*`, `*.hooks.ts`, or equivalent
    pattern files) and remaining code matches the same extraction pattern,
    continue extracting those leftovers,
  - dropping below 400/600 LOC is not a stop condition by itself,
  - stop when same-pattern leftovers are exhausted or when scope caps are hit;
    when caps block completion, emit `scope_expansion_needed[]`.
- Execute extraction ordering in this exact sequence:
  1. Step A, non-React pure logic first:
     - extract constants, pure helpers, and component-local types first,
     - keep component-only helpers/types/constants local to the component
       module folder,
     - promote to `lib/**` only when reused by 2+ domains and pure,
     - promote to `features/<domain>/domain/**` only when domain behavior is
       encoded.
  2. Step B, local subcomponents second:
     - extract clear presentational JSX chunks (especially repeated blocks),
     - keep subcomponents component-local unless cross-feature reuse is clear,
     - prefer folderization such as:
       - `ComponentName/ComponentName.tsx` (anchor),
       - `ComponentName/components/ComponentNameHeader.tsx`,
       - `ComponentName/components/ComponentNameRow.tsx`,
     - subcomponents must be prefixed for grepability (`ComponentNameRow`, not
       `Row`).
  3. Step C, hook extraction third:
     - extract complex derived state/effect/event wiring to
       `ComponentName/ComponentName.hooks.ts` or `useComponentNameState.ts`,
     - move hooks to `features/<domain>/hooks/**` only when feature-level and
       not component-scoped.
  4. Step D, split feature ownership last:
     - do not use mega-file triage as a shortcut for architecture migration,
     - keep folderization in the same gravity home unless migration mode is
       explicitly enabled,
     - propose cross-layer/home moves only after decomposition and only under
       explicit migration scope.
- Safety checks are required after each extraction step:
  - TypeScript still compiles (or would compile under existing TS config),
  - imports remain boundary-compliant (no forbidden-layer imports),
  - anchor component public API (props/exports) is unchanged unless explicitly
    requested,
  - no runtime behavior change unless explicitly requested,
  - tests are updated only when behavior changes and a suite already exists
    (extraction-only does not require new tests).
- Output contract when triggered must include:
  - phased A->D plan with file-touch list per phase,
  - explicit plan declaration: `in_cap_minimal_reduction` (default) or
    `scope_expansion_needed`,
  - implementation preference: unified diff for mega anchor-file edits and full
    content for newly extracted files.
- Practical default phased template:
  1. folderize anchor and extract constants/utils/types,
  2. extract obvious presentational subcomponents,
  3. extract state/effect logic into local hooks,
  4. optionally promote reused helpers to `lib/**` or `features/**` only when
     reuse criteria is satisfied.

### Forbidden

- Creating new `shared/common` dumping-ground directories.
- Adding new domain logic to `ui/**`.
- Introducing data fetching outside the canonical endpoint layer.
- Performing bulk formatting churn on the entire anchor file during extraction.
- Adding new flags/modes to force reuse, especially in shared composites.
- Introducing new barrels where the local area does not already use barrels.
- Stopping extraction only because line count dropped below thresholds while
  clear same-pattern leftovers remain and scope budget still allows extraction.
