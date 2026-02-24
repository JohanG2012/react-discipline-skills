---
name: <skill-name>
description: <what this skill does, when to invoke it, and when not to invoke it>
version: 1.0.0
license: MIT
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: <comma-delimited tags; no brackets>
---

# <Skill Title>

## Purpose
<2-4 sentences describing what the skill does and what it outputs.>

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
- **Policy baseline:** baked in from `shared/rules` at build time (`shared-rules`)
- **Baseline inheritance:** shared baseline rules are mandatory unless an
  approved exception exists
- **Pause defaults:** default `pause_mode` is inherited from shared policy

## Baseline compliance

- This skill must enforce shared baseline constraints from `shared-rules`.
- This skill must not define local mandatory rules that conflict with shared
  baseline rules.
- If local conventions conflict with shared baseline policy, report the conflict
  in structured output notes instead of overriding baseline policy.

## Workflow
Follow this workflow in order:
1. <step 1>
2. <step 2>
3. <step 3>
4. Validate output constraints against shared baseline policy.

## Output contract
Return a single JSON object matching this shape:

```json
{
  "schema_version": "1.0.0",
  "skill": "<skill-name>",
  "version": "1.0.0",
  "result_type": "<success_result>|validation_error|dependency_error",
  "validation_status": {
    "is_valid": true,
    "stage": "input_validation|processing|finalized",
    "errors": []
  },
  "notes": []
}
```

Constraints:
- Output must be JSON only.
- `result_type=<success_result>` must include `<success_payload_key>`.
- `result_type=validation_error` must not include success payload fields.
- `result_type=dependency_error` must include `dependency_issue` and
  `fallback_context_bundle_requirements[]`.
- `notes[]` max 5 items.
- No extra prose outside JSON.

## Quick reference rules
The skill must follow these rule IDs (see `AGENTS.md` for details):
- <rule_id_1>
- <rule_id_2>
- <rule_id_3>

## Files
- `AGENTS.md` is generated from `shared/rules/*.md` and `rules/*.md`.
- `rules/` contains source-of-truth local rule modules for this skill.
- Optional: `schemas/output.schema.json` for machine validation.

## Examples
- `examples/output.example.json` for successful output.
- `examples/validation-error.example.json` for `validation_error`.
- `examples/dependency-error.example.json` for `dependency_error`.
