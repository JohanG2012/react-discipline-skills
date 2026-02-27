# Anti-Pattern Detection

## Summary

Defines anti-pattern detection requirements and output mapping.

---

## Rule: Anti-Pattern Findings
**Rule ID:** rrp-detection  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Turns known architecture drift signals into actionable planning
metadata.

### Requirement

- Detect and classify high-value anti-patterns, including:
  - implicit visibility ownership in shared presentational components
  - fetch/transport usage outside canonical endpoint ownership
  - domain leakage into shared UI abstractions
  - unjustified server-state mirroring in global store
  - prop-drilling debt across pass-through component chains
  - umbrella-feature drift (single feature acting like a mini `features` root)
  - feature-local presentation/transport shadow homes (for example
    `features/*/views/**`, `*View` naming, `features/*/api/**`)
- Anti-pattern tier defaults:
  - implicit visibility in shared presentational UI -> Tier A
  - fetch outside canonical endpoint layer -> Tier B (Tier C when widespread)
  - domain leakage into shared UI -> Tier B
  - server-state mirrored to global store without justification -> Tier B
    (Tier C when systemic)
  - prop-drilling debt -> Tier B (Tier C when subtree breadth/churn is high)
  - umbrella-feature drift -> Tier B (Tier C when widespread and high-churn)
  - feature-local shadow homes for views/api -> Tier B
- Detection heuristics must include:
  - implicit visibility:
    - component in `ui/primitives/**` or `ui/composites/**`
    - conditionally returns `null` based on external props
    - component is not an explicit boundary/guard wrapper
  - fetch outside endpoint layer:
    - transport logic exists outside canonical endpoint ownership
  - domain leakage:
    - domain-specific naming/types/flags in shared UI
  - server-state mirror:
    - cache-backed server data redundantly stored in global store with no
      explicit performance/offline rationale
  - prop-drilling debt:
    - same prop/group forwarded through 3+ layers without intermediate use,
    - pass-through forwarding volume >=5 props in a layer,
    - repeated sibling-branch threading of same prop set,
    - drilled domain data/actions leaking into shared `ui/**`
  - umbrella-feature drift:
    - one feature contains multiple domain sub-areas plus parallel layer-style
      internal taxonomies (`components/`, `hooks/`, `utils/`, `rules/`, etc.),
    - recurring shared glue inside one feature indicates multiple hidden domain
      owners
  - feature-local shadow homes:
    - feature paths matching `features/*/views/**` or `features/**/*View.*`,
    - feature paths matching `features/*/api/**` while canonical API home
      exists
- Emit findings with:
  - stable `finding_id`
  - `type`
  - assigned `tier`
  - `affected_files[]`
  - `recommended_step_id`
- Ensure out-of-mode findings are surfaced as non-blocking follow-up guidance.
- Detection focus should align with standards enforced by:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`
- Home/placement helper for ambiguous scans:
  - when model-only detection confidence is low for likely wrong-home files, run
    `skills/react-refactoring-progression/scripts/scan_home_misplacements.mjs`
    against the repository root with explicit
    `--frontend-root <frontend-source-root>` input (repeatable and required),
  - `--frontend-root` must point at the frontend source root (for example
    `apps/web/src`), not the frontend package root,
  - scanner reviews only the provided frontend roots and does not auto-scan the
    whole monorepo tree,
  - scanner output is candidate file paths only; home decisions stay with the
    LLM/agent,
  - scanner output is heuristic and may contain false positives; dismiss
    candidates that are not supported by direct review evidence,
  - use returned `file_paths[]` (top 10 by default) as review candidates before
    finalizing findings,
  - empty `file_paths[]` means no strong likely wrong-home candidates were found
    by heuristic scan.
  - if all script candidates are dismissed, proceed with direct repository
    assessment and apply shared/skill rules without script assistance.
- Duplicate-cluster helper for side-by-side review:
  - when the agent cannot confidently find duplicate JSX/DOM candidates on its
    own (low-confidence discovery), run
    `skills/react-refactoring-progression/scripts/scan_duplicate_ui_clusters.mjs`
    with explicit `--frontend-root <frontend-source-root>` input (repeatable and
    required),
  - use returned `review_groups[]` and `file_paths[]` only as candidate review
    queues before applying semantic-duplication qualification,
  - duplicate-cluster suggestions are heuristic and may include false positives;
    dismiss unsupported groups after side-by-side review,
  - if all duplicate-cluster groups are dismissed, continue with manual
    semantic-duplication assessment based on repository evidence and rule
    contracts only,
  - script output intentionally avoids extraction/reuse decisions; those remain
    with the LLM/agent and downstream duplication rules.

### Forbidden

- Emitting anti-pattern findings without traceable affected files.
- Promoting out-of-mode findings to blocking active-step status.
- Producing recommendations that are purely aesthetic or preference-driven.
- Treating dismissed/empty script output as a blocker for continuing detection.

### Notes

- Detection should prioritize standards alignment over style-only concerns.
