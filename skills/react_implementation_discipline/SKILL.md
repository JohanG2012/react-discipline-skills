---
name: react_implementation_discipline
description: Enforces implementation discipline and boundary checks
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - react
    - discipline
    - quality
---

# React Implementation Discipline

## Purpose
Ensures implementation changes follow architecture rules, minimal scope, and
quality gates such as loading/error handling and boundary constraints.

## When to apply
Use this skill when:
- You are implementing changes after planning
- You must ensure adherence to boundary and quality rules
- You need to enforce minimal churn and disciplined updates

Do not use this skill when:
- The task is purely planning or specification work
- No code or files are being modified

## Inputs
The skill expects:
- **Task request:** The requested change or feature
- **Repository context:** Current codebase and relevant policies
- **Policy:** `agent-policy-v1` (must be available)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record

## How to use
Follow this workflow in order:
1. Confirm planned file touches and boundaries.
2. Implement changes with minimal churn.
3. Validate quality and governance gates against shared baseline policy.
4. Report outcomes.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "react_implementation_discipline",
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

- rid-overview-scope
- rid-process
- rid-output

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
