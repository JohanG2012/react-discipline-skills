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

- Use helper scripts only as a last-resort fallback when confidence remains low
  after required pre-script analysis.
- If required pre-script analysis already produces meaningful actionable
  opportunities with sufficient confidence, skip helper scripts.
- Required pre-script analysis sequence:
  1. Rule-first reasoning pass:
    - evaluate active shared + skill-local rules against current scope,
    - derive initial candidate findings directly from rule checks.
  2. Direct repository scan pass (no helper scripts):
    - inspect likely hotspots with targeted file/path search and side-by-side
      code review,
    - dismiss or confirm initial candidates using repository evidence.
  3. Fallback eligibility check:
    - run a helper script only when confidence is still low after steps 1-2 and
      at least one of these is true:
      - no meaningful actionable opportunities were found from rule-first and
        direct-scan analysis,
      - unresolved ambiguity still blocks reliable findings or classification.
- Script invocation must be targeted:
  - choose only the helper script that matches remaining ambiguity,
  - do not run both helper scripts by default when one is sufficient.
- Home/placement candidate scan:
  - run
    `skills/react-refactoring-progression/scripts/scan_home_misplacements.mjs`
    with explicit `--frontend-root <frontend-source-root>` (repeatable and
    required),
  - pass repeatable `--home-dir <dir>|<dir>=<canonical>` mappings (required),
  - `--frontend-root` must point to frontend source root (for example
    `apps/web/src`), not the package root,
  - when a trusted architecture-detection result is available, align required
    `--home-dir` mappings to detected aliases (for example
    `--home-dir views=pages --home-dir state=store`) to align script inference
    with detected gravity/home conventions,
  - when architecture-detection aliases are unavailable, pass canonical home
    mappings that reflect active frontend homes,
  - scanner must review only supplied frontend roots.
- Duplicate-cluster candidate scan:
  - run
    `skills/react-refactoring-progression/scripts/scan_duplicate_ui_clusters.mjs`
    with explicit `--frontend-root <frontend-source-root>` (repeatable and
    required),
  - use returned `review_groups[]` and `file_paths[]` only as candidate queues
    for side-by-side review.
  - when present, use `review_groups[].pattern_hint` as a heuristic cue
    (`structural_cluster`, `component_composition`, or `atomic_control`) only;
    never as final classification.
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

- Running helper scripts as a default first detection step.
- Running helper scripts before completing required rule-first and direct-scan
  passes.
- Running helper scripts when rule-first and direct-scan analysis already
  identified enough meaningful, evidence-backed opportunities.
- Running helper scripts without required `--frontend-root` input.
- Running home/placement candidate scan without required `--home-dir` mappings.
- Treating `--home-dir` hints as authoritative overrides when direct repository
  evidence disagrees.
- Running both helper scripts eagerly when only one unresolved ambiguity exists.
- Auto-scanning entire monorepo roots when only frontend source roots are
  required.
- Treating empty or dismissed script output as a blocker.
- Treating script suggestions as decisions without direct evidence review.

### Notes

- Use script assistance as fallback tooling; rely on rule-grounded judgment for
  final findings.
