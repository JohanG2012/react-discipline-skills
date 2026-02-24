# React Discipline Skills

This repository contains Codex skills for disciplined React architecture and
implementation workflows. It includes skill definitions, rule sources, and build
scripts to generate agent-readable rule bundles.

## Project Direction

This project is intentionally scoped to **4 production skills** for agents such
as Codex:

1. `react-architecture-detection`
2. `react-placement-and-layering`
3. `react-reuse-update-new`
4. `react-implementation-discipline`

`agent-policy-v1` is a shared policy baseline used by all skills, but it is not
counted as one of the 4 production skills.

If other skill folders exist in the repo, treat them as non-goal/legacy unless
explicitly promoted by a new spec.

## Official Skill Standards

- OpenAI Codex Skills: https://developers.openai.com/codex/skills/
- Agent Skills Specification: https://agentskills.io/specification

## External Reference Baselines

This repo follows the Agent Skills ecosystem patterns used by:

- OpenAI skills catalog: https://github.com/openai/skills
- Anthropics Skill examples: https://github.com/anthropics/skills/tree/main
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
- `tools/build/`: Agent bundle generation and skill-level validation scripts
- `scripts/`: Cross-skill handoff validators and fixture sets
- `eslint/`: Recommended ESLint rule sets for supported versions
- `.github/workflows/`: CI configuration

## Install Into Codex

This repository is the source for developing skills. Runtime use happens by
installing skill folders into a Codex-recognized skills directory.

- Project-local install target: `<target-repo>/.agents/skills/`
- User-level install target: `$HOME/.agents/skills/`

Example (copy into another project):

```bash
mkdir -p /path/to/target-repo/.agents/skills
cp -R skills/react-architecture-detection /path/to/target-repo/.agents/skills/
cp -R skills/react-placement-and-layering /path/to/target-repo/.agents/skills/
cp -R skills/react-reuse-update-new /path/to/target-repo/.agents/skills/
cp -R skills/react-implementation-discipline /path/to/target-repo/.agents/skills/
cp -R skills/.shared/policy /path/to/target-repo/.agents/skills/agent-policy-v1
```

Example (symlink for live development):

```bash
mkdir -p /path/to/target-repo/.agents/skills
ln -s /path/to/react-discipline-skills/skills/react-architecture-detection /path/to/target-repo/.agents/skills/react-architecture-detection
ln -s /path/to/react-discipline-skills/skills/react-placement-and-layering /path/to/target-repo/.agents/skills/react-placement-and-layering
ln -s /path/to/react-discipline-skills/skills/react-reuse-update-new /path/to/target-repo/.agents/skills/react-reuse-update-new
ln -s /path/to/react-discipline-skills/skills/react-implementation-discipline /path/to/target-repo/.agents/skills/react-implementation-discipline
ln -s /path/to/react-discipline-skills/skills/.shared/policy /path/to/target-repo/.agents/skills/agent-policy-v1
```

## Build and Validation

- Generate agent summaries: `npm run build:agents`
- Run all checks: `npm run check`
- Validate cross-skill handoffs: `npm run check:handoffs`
- Strict single-set handoff checks: `node scripts/validate_handoffs.mjs --set success`
- Expected-failure checks:
  - `node scripts/validate_handoffs.mjs --set validation_error` (non-zero exit expected)
  - `node scripts/validate_handoffs.mjs --set dependency_error` (non-zero exit expected)

## ESLint Recommendations

See `eslint/README.md` for copy-ready rule sets you can merge into your ESLint
config to enforce skill constraints and catch violations early.
