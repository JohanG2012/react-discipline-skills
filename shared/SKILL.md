---
name: shared-rules
description: Build-time shared baseline policy constraints baked into all production skills for React code workflows. This skill should be considered when changing, updating, adding, refactoring, or improving React code.
version: 1.0.0
license: MIT
pre_approved_collisions: []
metadata:
  category: agent-skill
  language: en
  stability: stable
  tags: policy, governance, baseline
---

# Shared Rules

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
- **Output mode:** optional `output_mode` (`human|agent`), default `human`
  when a human explicitly instructs this skill to run, otherwise `agent`

## How to use
Follow this workflow in order:
1. Read the policy rules in `rules/`.
2. Verify baseline applicability across all four production execution skills.
3. Identify scope, precedence, and governance constraints relevant to the task.
4. Apply constraints and pause if violations are required.

## Output contract
Return a **single JSON object** matching this shape:

```json
{
  "skill": "shared-rules",
  "version": "1.0.0",
  "output_mode": "agent|human",
  "presentation": {
    "user_markdown": "### Shared Policy Summary\n- Deterministic policy guidance generated."
  },
  "notes": [],
  "output": {}
}
```

Constraints:

- Machine payload must be a JSON object.
- Output must include `output_mode` and `presentation.user_markdown`.
- `output_mode` must be either `human` or `agent`.
- The full JSON payload is always produced for both `output_mode` values.
- If `output_mode=human`, print/display only `presentation.user_markdown` to the human.
- If `output_mode=human`, do not print/display raw JSON, envelope fields, or any payload field other than `presentation.user_markdown`.
- If `output_mode=agent`, print/display the full JSON payload.
- `notes[]` max 5 items.

## Quick reference rules

The policy source must maintain these rule IDs (see `rules/` for details):

- sr-overview-scope
- sr-overview-nongoals
- sr-constraints
- sr-scope-governor
- sr-architecture-boundaries
- sr-ownership-naming
- sr-decision-defaults
- sr-output-discipline
- sr-dod-baseline
- sr-planning-reuse
- sr-migration-placement
- sr-fallback-defaults
- sr-implementation-defaults
- sr-layer-contracts
- sr-access-write-control
- sr-file-size-guidance
- sr-architecture-detection-contract
- sr-enforcement-heuristics
- sr-micro-change-bypass
- sr-component-folderization
- sr-component-folder-structure
- sr-component-folder-exports
- sr-component-helper-promotion
- sr-folderization-no-new-home
- sr-layout-shell-placement
- sr-layout-shell-subfolder-policy
- sr-ui-classname-support
- sr-a11y-aria-label
- sr-dom-rendering-and-primitives
- sr-prop-count-caps
- sr-prop-grouping-discipline
- sr-mega-file-triage
- sr-i18n-text-extraction
- sr-governance

## Files

- `rules/` contains the source-of-truth modular policy rules.
- This shared policy is a build-time source and is baked into production skill
  `AGENTS.md` artifacts.
