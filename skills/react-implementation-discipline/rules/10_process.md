# Implementation Process

## Summary

Defines orchestration flow for plan-driven implementation.

---

## Rule: Plan-Driven Implementation
**Rule ID:** rid-process  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Ensure deterministic execution that matches approved planning and
policy constraints.
**Covers:** Plan-Driven Implementation.
**Index mode:** reference

### Requirement

- Treat this rule as workflow orchestration; detailed validation and guardrails
  are delegated to referenced rules.
- Validate required inputs before implementation:
  - standard mode requires `revised_plan`, `detection_result`, and repository
    context,
  - micro mode requires explicit behavior-preserving refactor intent, repository
    context, and compliance with `sr-micro-change-bypass`.
- Resolve output mode using `sr-output-mode-resolution`.
- Select execution mode:
  - default `standard`,
  - allow `micro` only when micro constraints are explicitly satisfied;
    escalate to `standard` if a new-file requirement appears.
- If required inputs are invalid, return `validation_error` and stop.
- If required repository context is unavailable, return `dependency_error` and
  stop, with actionable fallback context requirements.
- Run implementation sequence in order:
  1. enforce scope caps and out-of-scope behavior via `rid-scope-governor`,
  2. enforce access/write discipline via `rid-access-control`,
  3. apply ambiguity defaults via `rid-ambiguity-strategy`,
  4. enforce anti-chaotic guardrails via `rid-chaotic-change-guardrails`,
  5. enforce boundary/runtime/query policy via `rid-boundary-runtime-query`,
  6. enforce hard stop conditions via `rid-stop-conditions`,
  7. execute validation gates via `rid-validation-gates`,
  8. emit contract-compliant payload via `rid-output`.
- Before finalizing `implementation_package`, run downstream consult via
  `rid-refactoring-consult` and record consult metadata.
- Keep plan fidelity and minimal churn as mandatory behavior for both standard
  and micro runs.

### Forbidden

- Implementing without required upstream inputs.
- Entering micro mode when micro constraints are missing or uncertain.
- Continuing execution after missing required context.
- Returning accepted output when mandatory gates fail.
- Skipping referenced sub-rules and substituting ad-hoc policy.

### Notes

- This rule coordinates execution flow; detailed thresholds and contracts are
  owned by referenced rules.
