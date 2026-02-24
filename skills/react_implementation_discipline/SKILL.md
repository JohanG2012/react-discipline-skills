---
name: react_implementation_discipline
description: Enforces plan-fidelity implementation with boundary audits, quality gates, and deterministic output states
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - react
    - discipline
    - implementation
    - governance
---

# React Implementation Discipline

## Purpose

Execute implementation work from an approved plan while enforcing architecture
boundaries, minimal churn, quality gates, and deterministic output behavior.

## When to apply

Use this skill when:

- You are implementing changes after planning and reuse decisions are complete.
- You need strict boundary checks and scope-governor enforcement.
- You need structured output that can be reviewed or consumed by automation.

Do not use this skill when:

- The task is only planning or specification.
- No implementation output is being produced.

## Inputs

Required:

- `task_request`
- `revised_plan`
- `detection_result`
- `reuse_decisions`
- repository context for convention and boundary validation

Shared baseline:

- `agent-policy-v1` must be available and enforced.

## Workflow

1. Validate required inputs and context availability.
2. Execute implementation only within approved plan scope.
3. Run boundary, quality, and scope-deviation checks.
4. Return one structured output result type.

## Output contract

Return a single JSON object only (no extra prose) with:

- `schema_version`
- `skill`: `react_implementation_discipline`
- `version`
- `result_type`: `implementation_package | validation_error | dependency_error`
- `validation_summary`

`implementation_package` includes `output_package` with changed files, patch/new
file payloads, quality checks, boundary audit findings, and scope deviations.

If final state is `blocked`, include `required_fixes`.

`validation_error` and `dependency_error` outputs must not include
`output_package`.

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
