# Mega-File Triage and Extraction Plan

## Summary
Defines mandatory triage and extraction sequencing when touched files exceed
safe size/responsibility thresholds.

---

## Rule: Mega-File Triage and Extraction Plan Index
**Rule ID:** sr-mega-file-triage  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Preserves stable entrypoint while delegating to focused triage,
extraction-sequencing, and validation-output rules.
**Covers:** Mega-File Triage and Extraction Plan.
**Index mode:** reference

### Requirement

- When this rule is in scope, enforce all of:
  - `sr-mega-file-trigger-safety`,
  - `sr-mega-file-extraction-order`,
  - `sr-mega-file-validation-output`.

### Forbidden

- Treating this index rule as sufficient without enforcing the referenced
  mega-file rules.

---

## Rule: Mega-File Trigger and Safety Baseline
**Rule ID:** sr-mega-file-trigger-safety  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Ensures deterministic trigger conditions and behavior-preserving
triage defaults.
**Covers:** Mega-File Trigger and Safety Baseline.
**Index mode:** reference

### Requirement

- Trigger mega-file triage when any touched file is:
  - over 600 LOC (hard stop threshold), or
  - over 400 LOC with clear multi-responsibility signals, or
  - explicitly flagged as an offender (for example a 1500 LOC component), or
  - below threshold but showing prior extraction pattern with obvious same-pattern
    leftovers.
- Freeze behavior and reduce risk surface:
  - treat work as refactor-only unless user explicitly requests behavior changes,
  - preserve output, props, and side effects by default,
  - plan incremental extraction steps, not a rewrite.
- Establish bounded target:
  - declare `anchor_component` (path + export),
  - declare `extraction_budget` (allowed file touches under caps),
  - declare `end_state_goal` as anchor `<= 250-400` LOC (or `<= 600` when
    explicitly timeboxed),
  - if caps block ideal target, deliver in-cap reduction and include
    `scope_expansion_needed[]`.
- Continue extraction when prior-pattern leftovers exist:
  - dropping below 400/600 is not a stop condition by itself,
  - stop when same-pattern leftovers are exhausted or caps are reached.

### Forbidden

- Treating line-count drop alone as stop condition when same-pattern leftovers
  remain and scope budget allows continued extraction.
- Ignoring declared behavior-preserving default in triage-only runs.

---

## Rule: Mega-File Extraction Ordering
**Rule ID:** sr-mega-file-extraction-order  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Keeps decomposition predictable and low-risk.
**Covers:** Mega-File Extraction Ordering.
**Index mode:** reference

### Requirement

- Execute extraction in this exact sequence:
  1. Step A, pure logic first:
     - extract constants, pure helpers, component-local types,
     - promote to `lib/**` only when reused by 2+ domains and pure,
     - promote to `features/<domain>/domain/**` only when domain behavior is
       encoded.
  2. Step B, presentational subcomponents:
     - extract clear JSX blocks (especially repeated blocks),
     - keep subcomponents local unless cross-feature reuse is clear,
     - use prefixed subcomponent naming (`ComponentNameRow`, not `Row`).
  3. Step C, hook/state extraction:
     - extract complex derived state/effect/event wiring to local hook files,
     - move to `features/<domain>/hooks/**` only when truly feature-level.
  4. Step D, ownership split last:
     - do not use mega-file triage as migration shortcut,
     - cross-home moves only under explicit migration scope after decomposition.

### Forbidden

- Reordering extraction steps to perform high-risk structural migration first.
- Using mega-file triage as justification for broad architecture moves.

---

## Rule: Mega-File Safety Checks and Output Contract
**Rule ID:** sr-mega-file-validation-output  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Enforces post-step safety evidence and deterministic output
shape.
**Covers:** Mega-File Safety Checks and Output Contract.
**Index mode:** inline

### Requirement

- After each extraction step, verify:
  - TypeScript still compiles (or would compile under existing config),
  - imports remain boundary-compliant,
  - anchor public API (props/exports) is unchanged unless explicitly requested,
  - no runtime behavior change unless requested,
  - tests are updated only when behavior changes and suite exists.
- Output when triggered must include:
  - phased A->D plan with file-touch list per phase,
  - declaration: `in_cap_minimal_reduction` (default) or
    `scope_expansion_needed`,
  - implementation preference: unified diff for mega anchor edits and full
    content for newly extracted files.
- Keep extraction anti-churn constraints explicit:
  - no `shared/common` dumping-ground creation,
  - no new domain logic in `ui/**`,
  - no fetching outside canonical endpoint layer,
  - no broad formatting-only churn,
  - no new mode/flag matrices to force reuse,
  - no new barrels where local area does not already use barrels.

### Forbidden

- Skipping required safety checks after extraction steps.
- Returning mega-file plan output without phased touches and plan declaration.
- Introducing anti-churn violations under mega-file triage scope.
