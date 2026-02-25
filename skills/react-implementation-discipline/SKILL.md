---
name: react-implementation-discipline
description: Generate or modify React code while enforcing architectural boundaries, scope limits, and shared policy constraints. Use by default after architecture detection, placement planning, and reuse decisions are complete; for qualified behavior-preserving micro refactors, this skill may run directly in micro mode. Consume detection_result and revised_plan in standard mode, or bounded micro-change context in micro mode, to produce patches/snippets that respect import rules, canonical endpoint-layer constraints, scope governor limits, and Definition-of-Done checks. Enforce boundary audits, loading/error/empty states, and anti-drift controls. Do not use for architecture detection, placement decisions, or reuse analysis. This skill should be considered when changing, updating, adding, refactoring, or improving React code.
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: react, implementation, discipline, governance
---

# React Implementation Discipline

## Purpose

Execute implementation work from an approved plan while enforcing architecture
boundaries, minimal churn, quality gates, and deterministic output behavior.

## When to apply

Use this skill when:

- You are implementing changes after planning and reuse decisions are complete.
- You are applying a behavior-preserving micro refactor that qualifies for
  shared `sr-micro-change-bypass` conditions.
- You need strict boundary checks and scope-governor enforcement.
- You need structured output that can be reviewed or consumed by automation.

Do not use this skill when:

- The task is only planning or specification.
- No implementation output is being produced.

## Inputs

Required in standard mode:

- `revised_plan`
- `detection_result`
- repository context for convention and boundary validation

Required in micro mode:

- `task_request` with explicit behavior-preserving refactor intent
- repository context for convention and boundary validation
- evidence that all shared `sr-micro-change-bypass` constraints are satisfied

Optional:

- `task_request` (traceability context when provided)
- `policy_ref`
- `policy_version`
- `diff_preference` (`snippet_first` or `unified_diff`)
- `strictness` (`strict` default; `relaxed` only when explicitly allowed)
- `max_lines_policy` (explicit soft-cap overrides when provided)

Shared baseline:

- `shared-rules` are baked in from `shared/rules` at build time and must be enforced.
- Default `pause_mode` is taken from shared policy.

## Workflow

1. Select execution mode (`standard` or `micro`) from available evidence.
2. Validate required inputs and context availability for the selected mode.
3. If micro mode is selected and file creation becomes necessary, escalate to
   standard mode before continuing implementation output.
4. Execute implementation within approved scope (or bounded micro scope).
5. Run boundary, quality, and scope-deviation checks.
6. Run downstream `react-refactoring-progression` consult in opportunistic mode
   using touched files from this execution.
7. Return one structured output result type.

## Output contract

Return a single JSON object only (no extra prose) with:

- `schema_version`
- `skill`: `react-implementation-discipline`
- `version`
- `result_type`: `implementation_package | validation_error | dependency_error`
- `validation_status`
  - `final_state` in `validation_status.final_state`
  - allowed `final_state` values:
    `accepted | blocked | validation_error | dependency_error`
  - when `result_type=implementation_package`, `final_state` must be
    `accepted` or `blocked`

`implementation_package` includes `output_package` with:

- `output_package.changed_files[]`
- `output_package.updated_patches[]` (diffs/snippets)
- `output_package.new_files[]` (full content)
- `output_package.boundary_audit`
- `output_package.quality_checks`
- `output_package.scope_deviations[]` (`path`, `type`, `reason`)
- `output_package.refactoring_consult`
- `output_package.required_fixes[]` (required when `final_state=blocked`)

- `validation_error` output must include `notes[]` and must not include
  `output_package`.
- `dependency_error` output must include:
  - `dependency_issue`
  - `fallback_context_bundle_requirements[]` (minimum 5 actionable items)
  - `notes[]`
  and must not include `output_package`.
- Micro mode must remain behavior-preserving and in-place:
  - no new files
  - no moves/renames
  - no routing changes
  - no new endpoint/hook/composite homes
- If implementation in micro mode needs file creation, escalate to standard
  mode before producing output.
- For every `implementation_package`, include consult metadata from
  `react-refactoring-progression` opportunistic mode in
  `output_package.refactoring_consult`; if unavailable, record `status=unavailable`.

## Quick reference rules

- `rid-overview-scope`
- `rid-process`
- `rid-output`
- `rid-validation-gates`
- `rid-scope-governor`
- `rid-access-control`
- `rid-output-mode-selection`
- `rid-ui-genericity`
- `rid-data-flow-exports`
- `rid-quick-validation`
- `rid-ambiguity-strategy`
- `rid-chaotic-change-guardrails`
- `rid-pause-defaults-protocol`
- `rid-boundary-runtime-query`
- `rid-stop-conditions`
- `rid-naming-discoverability`
- `rid-refactoring-consult`

## Files

- `AGENTS.md` contains generated, full guidance.
- `rules/` contains source-of-truth modular rules.
- `schemas/output.schema.json` defines machine-validated output contract.

## Examples

- `examples/output.example.json`
- `examples/blocked-output.example.json`
- `examples/validation-error.example.json`
- `examples/dependency-error.example.json`
- `examples/diff.example.patch`
