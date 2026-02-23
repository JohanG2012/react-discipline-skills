---
name: react_reuse_update_new
description: Decides reuse vs update vs new implementation paths
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - react
    - reuse
    - refactor
---

# React Reuse vs Update vs New

## Purpose
Guides decisions on whether to reuse existing code, update it, or create a new
module while keeping boundaries clean and scope constrained.

## When to apply
Use this skill when:
- You need to decide reuse vs update vs new
- Existing components may already cover the request
- You want to avoid unnecessary duplication

Do not use this skill when:
- The change is explicitly mandated to create new files
- No existing code is relevant to the request

## Inputs
The skill expects:
- **Task request:** The requested change or feature
- **Repository context:** Existing implementations and patterns
- **Policy:** `agent-policy-v1` (must be available)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record

## How to use
Follow this workflow in order:
1. Search for existing implementations and patterns.
2. Score reuse/update/new using the decision ladder.
3. Validate decision constraints against shared baseline policy.
4. Output the chosen approach with reasons.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "react_reuse_update_new",
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

- rru-overview-scope
- rru-process
- rru-output

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
