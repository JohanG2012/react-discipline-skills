# Detection Assist Scripts

## Summary

Defines script-assisted candidate discovery behavior for low-confidence
refactoring detection runs.

---

## Rule: Script-Assisted Detection Candidates
**Rule ID:** rrp-detection-assist-scripts  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps helper-script usage bounded, input-safe, and subordinate to
rule-based agent judgment.
**Covers:** Script-Assisted Detection Candidates.
**Index mode:** reference

### Requirement

- Use helper scripts only when model-only detection confidence is low.
- Home/placement candidate scan:
  - run
    `skills/react-refactoring-progression/scripts/scan_home_misplacements.mjs`
    with explicit `--frontend-root <frontend-source-root>` (repeatable and
    required),
  - `--frontend-root` must point to frontend source root (for example
    `apps/web/src`), not the package root,
  - scanner must review only supplied frontend roots.
- Duplicate-cluster candidate scan:
  - run
    `skills/react-refactoring-progression/scripts/scan_duplicate_ui_clusters.mjs`
    with explicit `--frontend-root <frontend-source-root>` (repeatable and
    required),
  - use returned `review_groups[]` and `file_paths[]` only as candidate queues
    for side-by-side review.
  - when present, use `review_groups[].pattern_hint` as a heuristic cue
    (`structural_cluster` or `atomic_control`) only; never as final
    classification.
- Script output is heuristic and non-authoritative:
  - treat all script results as potential false positives,
  - dismiss unsupported candidates after direct evidence review,
  - never let scripts decide final placement/extraction/reuse outcomes.
- Fallback behavior when candidates are dismissed:
  - if all script candidates/groups are dismissed, continue with direct
    repository assessment using shared and local rules only.
- Candidate-only contract:
  - scanner outputs are input hints (`file_paths[]`, `review_groups[]`) and must
    not be interpreted as expected homes or required actions.

### Forbidden

- Running helper scripts without required `--frontend-root` input.
- Auto-scanning entire monorepo roots when only frontend source roots are
  required.
- Treating empty or dismissed script output as a blocker.
- Treating script suggestions as decisions without direct evidence review.

### Notes

- Use script assistance as fallback tooling; rely on rule-grounded judgment for
  final findings.
