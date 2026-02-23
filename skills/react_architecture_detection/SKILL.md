---
name: react_architecture_detection
description: Detects repository architecture and gravity signals
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags:
    - react
    - architecture
---

# React Architecture Detection

## Purpose
Analyzes a repository to determine its current architectural shape and
preferred file placement based on existing signals.

## When to apply
Use this skill when:
- You need to classify the current repository structure
- You must decide the canonical home for features or APIs
- You need to detect migration strategy signals

Do not use this skill when:
- The repository structure is already explicitly documented and fixed
- The task is limited to content updates with no placement decisions

## Inputs
The skill expects:
- **Task request:** The requested change or feature
- **Repository context:** File tree and key entry points
- **Policy:** `agent-policy-v1` (must be available)
- **Baseline inheritance:** shared baseline rules are mandatory and may not be
  locally overridden without approved exception record

## How to use
Follow this workflow in order:
1. Scan the repository for routing, UI, and data access signals.
2. Classify the architecture shape and gravity.
3. Validate output constraints against shared baseline policy.
4. Output a structured summary with recommended placement.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "react_architecture_detection",
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

- rad-overview-scope
- rad-process
- rad-output

## Files

- `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
- `rules/` contains the source-of-truth modular rules.

## Examples

- See `examples/` for sample outputs.
- See `fixtures/` for sample repo trees and patterns.
