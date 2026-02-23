---
name: agent_policy_v1
description: Baseline policy constraints for all skills
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - policy
    - governance
---

# Agent Policy v1

## Purpose
Defines the baseline policy constraints that all other skills must follow.
It provides scope limits, guardrails, and governance expectations.

## When to apply
Use this skill when:
- A task requires baseline policy constraints
- Another skill references policy compliance
- Governance and scope rules must be enforced

Do not use this skill when:
- The task explicitly overrides policy with approved exceptions
- The task is unrelated to repository rules and governance

## Inputs
The skill expects:
- **Task request:** The user request requiring policy enforcement
- **Repository context:** Repository structure and relevant policy documents
- **Policy:** This policy itself is the baseline

## How to use
Follow this workflow in order:
1. Read the policy rules in `AGENTS.md`.
2. Identify any scope or governance constraints relevant to the task.
3. Apply constraints and pause if violations are required.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "agent_policy_v1",
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
- apv-constraints
- apv-governance

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
- See `fixtures/` (if present) for sample repo trees and patterns.
