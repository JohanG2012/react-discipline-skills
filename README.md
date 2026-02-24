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

`agent-policy-v1` is a shared policy baseline source in `shared/` that
is baked into generated `AGENTS.md` for all 4 production skills. It is not
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
- `shared/`: Shared baseline policy source baked into generated
  production skill bundles (`shared/rules` uses `__TARGET_SKILL__` for
  `Applies to`, resolved per target skill at build time)
- `templates/`: Authoring scaffolds for initializing `SKILL.md`, rule modules,
  and generated-agent-document structure
- `scripts/generators/`: Build-flow generators (for example `AGENTS.md`)
- `scripts/validators/`: Validation entrypoints (frontmatter, examples, handoffs)
- `scripts/lib/`: Shared script utilities and schema-validation helpers
- `scripts/fixtures/`: Fixture sets for cross-skill handoff validation
- `eslint/`: Recommended ESLint rule sets for supported versions
- `.github/workflows/`: CI configuration

## Templates

`templates/` is for development-time scaffolding only. These files provide
starting formats for:

- `SKILL.md` contracts (including baseline-compliance and
  `result_type`/`validation_status` output envelopes)
- `rules/*.md` modules (`shared/rules` uses `Applies to: __TARGET_SKILL__`
  and `Inherited from: shared-rules`)
- generated `AGENTS.md` structure
- `00_overview` scope rules (including baseline inheritance and conflict guards)

They are not installed as runtime skills and are not loaded by Codex directly.

## Install Into Codex

This repository is the source for developing skills. Runtime use happens by
installing the 4 production skill folders into a Codex-recognized skills
directory. Shared policy is already baked into each generated `AGENTS.md`.

- Project-local install target: `<target-repo>/.agents/skills/`
- User-level install target: `$HOME/.agents/skills/`

Example (copy into another project):

```bash
mkdir -p /path/to/target-repo/.agents/skills
cp -R skills/react-architecture-detection /path/to/target-repo/.agents/skills/
cp -R skills/react-placement-and-layering /path/to/target-repo/.agents/skills/
cp -R skills/react-reuse-update-new /path/to/target-repo/.agents/skills/
cp -R skills/react-implementation-discipline /path/to/target-repo/.agents/skills/
```

Example (symlink for live development):

```bash
mkdir -p /path/to/target-repo/.agents/skills
ln -s /path/to/react-discipline-skills/skills/react-architecture-detection /path/to/target-repo/.agents/skills/react-architecture-detection
ln -s /path/to/react-discipline-skills/skills/react-placement-and-layering /path/to/target-repo/.agents/skills/react-placement-and-layering
ln -s /path/to/react-discipline-skills/skills/react-reuse-update-new /path/to/target-repo/.agents/skills/react-reuse-update-new
ln -s /path/to/react-discipline-skills/skills/react-implementation-discipline /path/to/target-repo/.agents/skills/react-implementation-discipline
```

## Build and Validation

- Generate agent summaries: `npm run build:agents`
- Run all checks: `npm run check`
- Validate shared baseline rules and quick-reference parity: `npm run check:shared`
- Validate cross-skill handoffs: `npm run check:handoffs`
- Strict single-set handoff checks: `node scripts/validators/validate_handoffs.mjs --set success`
- Expected-failure checks:
  - `node scripts/validators/validate_handoffs.mjs --set validation_error` (non-zero exit expected)
  - `node scripts/validators/validate_handoffs.mjs --set dependency_error` (non-zero exit expected)

## ESLint Recommendations

See `eslint/README.md` for copy-ready rule sets you can merge into your ESLint
config to enforce skill constraints and catch violations early.
