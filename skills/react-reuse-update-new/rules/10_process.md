# Reuse Decision Process

## Summary
Defines orchestration flow for reuse/update/new decisioning.

---

## Rule: Decision Ladder
**Rule ID:** rru-process  
**Priority:** MUST  
**Applies to:** react-reuse-update-new  
**Rationale:** Keeps decisions consistent and bounded.

### Requirement

- Treat this rule as workflow orchestration; detailed thresholds and constraints
  are delegated to referenced rules.
- Validate required inputs before decisioning and stop with `validation_error`
  when inputs are invalid.
- Resolve output mode using `sr-output-mode-resolution`.
- Run this sequence in order:
  1. perform repository discovery and convention checks via
     `rru-discovery-conventions`,
  2. apply deterministic defaults and pause discipline via `rru-default-bias`,
  3. score and resolve outcomes via `rru-decision-thresholds`,
  4. enforce upstream alignment via `rru-upstream-alignment`,
  5. enforce scope limits via `rru-scope-governor`,
  6. enforce repository access/fallback behavior via `rru-access-control`,
  7. emit contract-compliant output via `rru-output`.
- Keep decision outcomes deterministic with one final action per
  `needed_artifact_id` (`reuse`, `update`, `new`, or `decision_blocked`).
- Preserve artifact identity (`needed_artifact_id`) end-to-end.
- Keep this skill decision-only; implementation remains downstream execution
  scope.

### Forbidden

- Skipping referenced sub-rules and substituting ad-hoc decision policy.
- Returning ambiguous outcomes with no single final decision per artifact.
- Continuing decisioning after required validation or discovery failures.

### Notes

- This rule coordinates the ladder; scoring and cap details are owned by the
  referenced rule modules.
