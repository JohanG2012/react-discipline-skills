# Downstream Refactoring Consult

## Summary

Defines mandatory end-of-execution consultation of
`react-refactoring-progression` in opportunistic mode.

---

## Rule: Mandatory Opportunistic Refactoring Consult
**Rule ID:** rid-refactoring-consult  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Ensures every implementation run gets a bounded, non-blocking
cleanup/refactor plan derived from the touched file set.
**Covers:** Mandatory Opportunistic Refactoring Consult.
**Index mode:** reference

### Requirement

- For every `implementation_package` result, run a downstream consult to
  `react-refactoring-progression` in `opportunistic` mode before finalizing
  output.
- Pass the current touched file set as consult scope:
  - `output_package.changed_files[]`
  - plus any `output_package.new_files[].path` when present
- Treat consult output as planning-only and non-blocking:
  - it must not mutate already-produced implementation patches
  - consult failures must not convert a previously valid implementation outcome
    into `blocked`
- Always record consult result metadata in
  `output_package.refactoring_consult`.
- If refactoring skill/context is unavailable, record `status=unavailable` with
  reason and continue finalization.

### Forbidden

- Skipping consult for `implementation_package` outputs.
- Using consult findings to introduce out-of-scope implementation churn in the
  same execution response.
- Treating consult `validation_error` or `dependency_error` as hard blockers for
  implementation output final state.

### Notes

- Opportunistic consult findings are follow-up guidance for subsequent
  execution, not immediate patch payload.
