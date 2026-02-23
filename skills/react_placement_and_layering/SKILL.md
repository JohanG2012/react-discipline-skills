---
name: react_placement_and_layering
description: Determines correct file placement and layer boundaries
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - react
    - architecture
    - layering
---

# React Placement and Layering

## Purpose
Determines the correct layer and folder placement for new work based on the
architecture detection outputs and boundary rules.

## When to apply
Use this skill when:
- You need to place new files in the correct layer
- You must validate boundary rules between layers
- You need to justify placement decisions

Do not use this skill when:
- Placement is explicitly dictated in the request
- The change is limited to existing files with no new placement

## Inputs
The skill expects:
- **Task request:** The requested change or feature
- **Repository context:** Architecture detection outputs and file tree
- **Policy:** `agent-policy-v1` (must be available)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record

## How to use
Follow this workflow in order:
1. Confirm architecture detection results and gravity.
2. Map the change to the correct layer.
3. Validate placement output against shared baseline constraints.
4. Produce a placement decision with justification.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "react_placement_and_layering",
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

- rpl-overview-scope
- rpl-process
- rpl-output

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
