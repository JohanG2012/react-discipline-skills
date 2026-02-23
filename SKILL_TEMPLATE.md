
---

# 1) `SKILL_TEMPLATE.md`

````md
---
name: <skill_name>                       # e.g. react_architecture_detection
description: <one_line_description>
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

# <Skill Title>

## Purpose
<2–4 sentences describing what the skill does and what it outputs.>

## When to apply
Use this skill when:
- <trigger 1>
- <trigger 2>
- <trigger 3>

Do not use this skill when:
- <non-trigger 1>
- <non-trigger 2>

## Inputs
The skill expects:
- **Task request:** <what the user asked for>
- **Repository context:** <tree/read/search OR context bundle>
- **Policy:** `agent_policy_v1` (must be available)

## How to use
Follow this workflow in order:
1. <step 1>
2. <step 2>
3. <step 3>

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "<skill_name>",
  "version": "1.0.0",
  "notes": [],
  "output": {}
}
````

Constraints:

* Output must be JSON only.
* `notes[]` max 5 items.
* No extra prose outside JSON.

## Quick reference rules

The skill must follow these rule IDs (see `AGENTS.md` for details):

* <rule_id_1>
* <rule_id_2>
* <rule_id_3>

## Files

* `AGENTS.md` contains the full rules for agents and LLMs (generated from `rules/`).
* `rules/` contains the source-of-truth modular rules.

## Examples

* See `examples/` for sample outputs.
* See `fixtures/` (if present) for sample repo trees and patterns.

````

