---
name: agent-policy-v1
description: Baseline policy constraints for all skills
version: 1.0.0
license: MIT
pre_approved_collisions: []
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: policy, governance, baseline
---

# Agent Policy v1

## Purpose
Defines the authoritative shared baseline policy for all four production
execution skills. It provides scope limits, document-precedence rules,
guardrails, and governance expectations.

## When to apply
Use this skill when:
- A task requires baseline policy constraints
- Another skill references policy compliance
- Governance and scope rules must be enforced
- Cross-skill policy consistency must be validated

Do not use this skill when:
- The task explicitly overrides policy with approved exceptions
- The task is unrelated to repository rules and governance

## Inputs
The skill expects:
- **Task request:** The user request requiring policy enforcement
- **Repository context:** Repository structure and relevant policy documents
- **Policy:** This policy itself is the baseline
- **Document precedence:** `specs/001-agent-policy-v1/master_spec.md` is
  authoritative; supporting policy docs may resolve non-conflicting gaps

## How to use
Follow this workflow in order:
1. Read the policy rules in `AGENTS.md`.
2. Verify baseline applicability across all four production execution skills.
3. Identify scope, precedence, and governance constraints relevant to the task.
4. Apply constraints and pause if violations are required.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "agent-policy-v1",
  "version": "1.0.0",
  "notes": [],
  "output": {}
}
```

Constraints:

- Output must be JSON only.
- `notes[]` max 5 items.
- No extra prose outside JSON.

## Quick reference rules

The skill must follow these rule IDs (see `AGENTS.md` for details):

- apv-overview-scope
- apv-overview-nongoals
- apv-constraints
- apv-scope-governor
- apv-architecture-boundaries
- apv-ownership-naming
- apv-decision-defaults
- apv-output-discipline
- apv-dod-baseline
- apv-planning-reuse
- apv-migration-placement
- apv-fallback-defaults
- apv-implementation-defaults
- apv-layer-contracts
- apv-access-write-control
- apv-file-size-guidance
- apv-architecture-detection-contract
- apv-enforcement-heuristics
- apv-governance

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
- See `fixtures/` (if present) for sample repo trees and patterns.
