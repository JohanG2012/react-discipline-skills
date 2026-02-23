# React Discipline Skills

This repository contains Codex skills for disciplined React architecture and
implementation workflows. It includes skill definitions, rule sources, and build
scripts to generate agent-readable rule bundles.

## Project Direction

This project is intentionally scoped to **4 production skills** for agents such
as Codex:

1. `react_architecture_detection`
2. `react_placement_and_layering`
3. `react_reuse_update_new`
4. `react_implementation_discipline`

`agent-policy-v1` is a shared policy baseline used by all skills, but it is not
counted as one of the 4 production skills.

If other skill folders exist in the repo, treat them as non-goal/legacy unless
explicitly promoted by a new spec.

## External Reference Baselines

This repo follows the Agent Skills ecosystem patterns used by:

- OpenAI skills catalog: https://github.com/openai/skills
- OpenAI curated/experimental install model: https://github.com/openai/skills/tree/main/skills/.curated
- Vercel skill collection and packaging conventions: https://github.com/vercel-labs/agent-skills/tree/main/skills

## Skill Packaging Convention

Each skill should follow the same high-level shape used in those ecosystems:

- `SKILL.md` as the user-facing contract and trigger guidance
- `rules/` as source-of-truth policy/rule modules
- `examples/` for runnable or inspectable outputs
- `AGENTS.md` as generated agent-facing material (not manually authored)

## Structure

- `skills/`: Skill definitions, rules, examples, and generated `AGENTS.md`
- `skills/.shared/policy/`: Shared baseline policy bundle (`agent-policy-v1`)
- `tools/build/`: Generation and validation scripts
- `eslint/`: Recommended ESLint rule sets for supported versions
- `.github/workflows/`: CI configuration

## Build and Validation

- Generate agent summaries: `npm run build:agents`
- Run all checks: `npm run check`

## ESLint Recommendations

See `eslint/README.md` for copy-ready rule sets you can merge into your ESLint
config to enforce skill constraints and catch violations early.
