# Implementation Process

## Summary

Defines disciplined, plan-driven implementation with fail-closed safeguards.

---

## Rule: Plan-Driven Implementation
**Rule ID:** rid-process  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Ensure deterministic execution that matches approved planning and
policy constraints.

### Requirement

- Validate required inputs before any implementation output:
  - standard mode requires:
    - `revised_plan`
    - `detection_result`
    - repository context needed for convention and boundary checks
  - micro mode requires:
    - explicit behavior-preserving refactor intent in `task_request`
    - repository context needed for convention and boundary checks
    - confirmation that shared `sr-micro-change-bypass` constraints are all
      satisfied
- Select execution mode before implementation:
  - `standard` when upstream planning artifacts are available or when scope is
    structural/ambiguous
  - `micro` only when all micro constraints are explicitly satisfied:
    - touched files `<= 2`
    - no new files
    - no move/rename
    - no new endpoint/hook/composite homes
    - no routing changes
- If micro mode is selected and new file creation becomes necessary, escalate
  to `standard` mode before continuing implementation output.
- If required inputs are invalid, return `validation_error` and stop.
- If required repository context is unavailable, return `dependency_error` and
  stop.
- Dependency-error handling must include actionable fallback context-bundle
  requirements for no-direct-access execution.
- Honor optional execution controls when provided:
  - `diff_preference`: prefer snippet-first or unified-diff output as requested,
    unless safer output mode rules require escalation.
  - `strictness`: default to `strict`; allow `relaxed` only when explicitly
    permitted in request context.
  - `max_lines_policy`: allow explicit soft-cap overrides when provided.
- Enforce plan fidelity:
  - in standard mode:
    - touch only files in the revised plan
    - allow extra touches only for minimal dependency/export wiring requirements
    - record each extra touch with one-line rationale
  - in micro mode:
    - treat current in-place files as the bounded plan
    - do not exceed micro-change constraints
- Enforce boundary checks for modified artifacts:
  - `ui/**` must not import from `features/**`, `api/**`, `store/**`, `pages/**`
  - `api/**` must not import React or UI/presentation layers
  - `pages/**` must not call canonical endpoint modules directly
  - hooks must follow documented exception policy for `hooks/** -> api/**`
- Enforce convention matching using nearest repository analogs:
  - naming style
  - export style
  - local error-handling patterns
  - path alias conventions
- Enforce minimal churn:
  - no unrelated renames
  - no broad formatting-only rewrites
  - no speculative refactors
- Enforce file-size discipline:
  - soft caps by layer: pages `120-150`, sections `200-250`, composites
    `200-250`, hooks `150-200`, feature domain files around `200`, endpoints
    `80-120`, primitives `<=150`, `lib` files `120-200`, `store` slices
    `150-250`, and `core` files around `150`
  - mandatory split/extraction when any touched file would exceed `400` lines
  - hard stop when any touched file would exceed `600` lines
- Enforce out-of-scope policy:
  - unapproved migration/dependency/cleanup/spec edits must be excluded
  - represent excluded work through bounded scope-expansion guidance
- Require final quality-gate checks before completion and map result to final
  state (`accepted` or `blocked`).

### Forbidden

- Implementing without required upstream inputs.
- Entering micro mode when any shared micro constraint is missing or uncertain.
- Continuing micro-mode execution after discovering that file creation is
  required.
- Continuing execution after missing repository context.
- Returning accepted output when mandatory quality checks fail.
- Including unapproved out-of-scope work in implementation payload.
- Violating boundary rules to satisfy convenience implementation.

### Notes

- Prefer deterministic defaults when safe and compliant.
- Keep changes reviewable and constrained to requested scope.
