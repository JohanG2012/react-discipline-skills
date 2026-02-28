# Feature-to-Composite Promotion

## Summary

Defines deterministic safeguards for promoting feature-owned components into
shared UI composites during refactor planning.

---

## Rule: Refactor — Promote Feature Components to Shared UI Composites Safely
**Rule ID:** rrp-promote-feature-to-composite  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Enables promote-to-shared-composite refactors without domain
leakage, parallel homes, or churn-heavy migration.
**Covers:** Refactor — Promote Feature Components to Shared UI Composites Safely.
**Index mode:** reference

### Requirement

- Promotion from feature-owned component to `ui/composites/**` is allowed only
  when all eligibility checks pass:
  1. cross-domain reuse evidence exists (2+ domains/features or clearly
     imminent in current scoped plan),
  2. component is a UI pattern and can be described without domain terms,
  3. domain dependencies are removable with small changes,
  4. API remains clean without domain mode flags (use slots/children/render
     props for variability),
  5. promotion does not create a new concern home and uses existing
     authoritative UI composite home.
- Hard gate: owner-noun naming must not be moved as-is.
  - If the promoted component export name or file base name contains a
    feature-owner noun (or starts with one), do not move it directly to
    `ui/composites/**`.
  - In that case, promotion must use this deterministic 2-step path:
    1. keep/create a feature-owned wrapper that retains domain wiring
       (domain hooks, store usage, API wiring, mapping),
    2. extract a domain-agnostic inner composite with pattern-based naming and
       UI-only dependencies into `ui/composites/**`.
- Promotion action order must be:
  1. split responsibilities so feature remains owner of domain meaning
     (domain mapping/rules/copy/hooks),
  2. extract domain-agnostic composite in `ui/composites/**` with generic name,
     minimal UI-only state, and root `className` support,
  3. review promoted component export and file base name; if either is
     domain-specific, rename to domain-agnostic pattern naming and keep
     file/export alignment,
  4. add thin feature adapter wrapper when domain wiring remains needed,
  5. replace call sites incrementally inside approved scope only.
- Naming and placement requirements:
  - shared composite names must be domain-agnostic and pattern-based,
  - promoted file base names under `ui/composites/**` must be domain-agnostic
    and match the primary export name,
  - composite must live in existing `ui/composites/**` home (or
    gravity-equivalent),
  - extracted helpers stay local unless reused by 2+ domains and pure; then
    promote to `lib/**`.
- Validation gates before accept:
  1. boundary audit:
     - `ui/**` imports only allowed shared layers (`ui/**`, generic `hooks/**`,
       `lib/**`),
     - no `features/**`/`api/**`/`store/**`/`state/**`/`pages/**`/`views/**`
       import leakage into shared UI (`state/**` treated as `store/**`;
       `views/**` treated as `pages/**`).
  2. behavior preservation:
     - visible UI behavior, interaction, keyboard/focus, and state/routing
       strategy remain unchanged.
  3. scope audit:
     - remain within caps unless approved expansion,
     - no new dependencies,
     - no new top-level folders.
  4. naming audit:
    - no domain terms in shared composite names, file base names, or exports.
- Deterministic defaults:
  - if promotion certainty is low, default to feature-local duplication with
    primitive reuse.
  - if sharing requires more than 2 new props or any domain mode flags, default
    to no promotion.
  - if only shell/layout pattern is reusable, extract shell only and keep
    feature-owned content injection.
- If any gate fails, output must be `blocked` with explicit `required_fixes`.

### Forbidden

- Promoting when disqualifiers exist:
  - component imports from `features/**`, `api/**`, `store/**`, `state/**`,
    `pages/**`, or `views/**`,
  - component encodes domain meaning in naming/props/hardcoded copy,
  - component name contains feature-owner noun and is moved into
    `ui/composites/**` as-is (without wrapper + inner-composite split),
  - generalization requires domain flags, large prop matrices, or
    config-object abstraction,
  - expected divergence remains high across domains,
  - move requires broad cross-concern migration or unapproved scope-cap
    expansion.
- Using promotion as a pretext for broad unrelated migrations.

### Notes

- Shared composite ownership is presentation concern only; feature layers retain
  domain semantics and domain behavior ownership.
