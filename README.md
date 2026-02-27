# React Discipline Skills

`react-discipline-skills` is a set of Codex skills for disciplined React
architecture and implementation workflows. It is not a rigid cookbook that
forces one exact implementation style. Instead, it steers agent decisions
toward industry standards and community best practices while respecting the
patterns already established in your repository.

The goal is to reduce agents to suggest implementation drift: rather than introducing ad hoc
structures, the `react-*` skills pull changes back toward your codebase's
existing architecture, boundaries, and naming conventions.

## Project Status

**Work in progress / experimental.**

Interfaces, folder contents, and skill behavior may change as specs are refined.
Use for evaluation and active development, not as a stable long-term contract.

## Known/Possible Issues

- **Spec Kit clarify bridge compatibility is unverified**: currently tested on
  one setup/system only; behavior across other setups is unknown.
- **Refactor helper script usage pattern is unverified**: scripts are intended
  as fallback when the agent cannot confidently find candidates on its own, but
  whether agents will consistently use them that way is currently unknown.
- **Impact of recent helper-script additions is unverified**: these additions
  are new, and their effect on overall skill output quality has not been
  systematically tested yet.
- **Token usage has not been a development focus so far**: token consumption
  has not been explicitly considered or optimized to date. Impact remains
  unmeasured and may vary by workflow and prompt quality.
- **Rule volume and rule size have grown quickly**: the current rule set needs
  a dedicated consolidation/restructure pass to improve LLM lookup ergonomics
  and enable better token-usage optimization.
- **Validation has been refactoring-focused so far**: the skills were exercised
  in a week-long refactoring session, and many updates were made during that
  run to improve reasoning and rule understanding for refactor workflows.
  Since those changes, the updated skills have not yet been re-tested on new
  feature implementation workflows.

## Project Direction

This project is intentionally scoped to **5 maintained skills** for agents such
as Codex:

1. `react-architecture-detection` (core production)
2. `react-placement-and-layering` (core production)
3. `react-reuse-update-new` (core production)
4. `react-implementation-discipline` (core production)
5. `react-refactoring-progression` (optional extension)

`shared` is a shared policy baseline source in `shared/` that
is baked into generated `AGENTS.md` for all maintained skills. It is not
counted as a skill itself.

## Skill Overview

| Skill | Primary role | Typical output |
|-------|--------------|----------------|
| `react-architecture-detection` | Detect current repository architecture and concern homes from real signals | `detection_result` |
| `react-placement-and-layering` | Decide where new/changed artifacts should live based on detected architecture | `placement_plan` |
| `react-reuse-update-new` | Decide per artifact: reuse, safely update, or create new | `decision_plan` |
| `react-implementation-discipline` | Execute implementation with boundary, scope, and quality gates | `implementation_package` |
| `react-refactoring-progression` | Produce behavior-preserving refactor progression plans after implementation | `refactor_progression_plan` |

## How the Skills Work Together

Standard implementation flow:

1. Run `react-architecture-detection` to ground decisions in existing repository signals.
2. Run `react-placement-and-layering` to select canonical homes/layers for planned artifacts.
3. Run `react-reuse-update-new` to choose reuse vs update vs new for each artifact.
4. Run `react-implementation-discipline` to produce implementation output with governance checks.
5. Optionally run `react-refactoring-progression` to plan safe follow-up refactors after delivery.

This sequence minimizes architectural drift and keeps planning/implementation decisions auditable.

## Example Use Cases

Try: `use $react-refactoring-progression to create a step-by-step plan that suggests high-impact improvements for the project.` to review reasoning and skill based output. However, all skills will perform their responsibilities without being excplicitly invoked as long as you prompts on a codebase that contains a react/frontend home.

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

## Developer First Setup

Prerequisites:

- Node.js 20 LTS
- npm

Initial setup from repository root:

```bash
npm ci
npm run build:agents
npm run check
```

Strongly recommended local git hook setup (commit message standard enforcement):

```bash
npm run prepare
```

This installs Husky hooks, including Commitlint on `commit-msg`.

## Install Into Codex

This repository is the source for developing skills. Runtime use happens by
installing the maintained skill folders into a Codex-recognized skills
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
cp -R skills/react-refactoring-progression /path/to/target-repo/.agents/skills/
```

Example (symlink for live development):

```bash
mkdir -p /path/to/target-repo/.agents/skills
ln -s /path/to/react-discipline-skills/skills/react-architecture-detection /path/to/target-repo/.agents/skills/react-architecture-detection
ln -s /path/to/react-discipline-skills/skills/react-placement-and-layering /path/to/target-repo/.agents/skills/react-placement-and-layering
ln -s /path/to/react-discipline-skills/skills/react-reuse-update-new /path/to/target-repo/.agents/skills/react-reuse-update-new
ln -s /path/to/react-discipline-skills/skills/react-implementation-discipline /path/to/target-repo/.agents/skills/react-implementation-discipline
ln -s /path/to/react-discipline-skills/skills/react-refactoring-progression /path/to/target-repo/.agents/skills/react-refactoring-progression
```

## Optional: Spec Kit Clarify Bridge

Use this when you want rule-aware clarification injected before planning in a
Spec Kit project.

Install the local extension into a target Spec Kit repo:

```bash
./bridge/install-speckit-clarify-bridge.sh --target-repo /path/to/target-repo
```

Uninstall from a target repo:

```bash
./bridge/uninstall-speckit-clarify-bridge.sh --target-repo /path/to/target-repo
```

Optional full cleanup of known local extension cache path:

```bash
./bridge/uninstall-speckit-clarify-bridge.sh --target-repo /path/to/target-repo --purge-local
```

Then run in the target repo:

```bash
/speckit.rules-bridge.clarify
```

Notes:

- This is an explicit wrapper command, not a patch to core `/speckit.clarify`.
- It is designed to consult installed react-discipline rules and inject
  high-impact clarification questions into the clarify flow.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contributor workflow, commit and PR
expectations, and validation steps.

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community behavior standards.

## Build and Validation

- Generate agent summaries: `npm run build:agents`
- Run all checks: `npm run check`
- Validate shared baseline rules and quick-reference parity: `npm run check:shared`
- Validate cross-skill handoffs: `npm run check:handoffs`
- Strict single-set handoff checks: `node scripts/validators/validate_handoffs.mjs --set success`
- Expected-failure checks:
  - `node scripts/validators/validate_handoffs.mjs --set validation_error` (non-zero exit expected)
  - `node scripts/validators/validate_handoffs.mjs --set dependency_error` (non-zero exit expected)

## Changelog Maintenance

Update `CHANGELOG.md` when merged milestone-level changes are introduced.

- Use `major` entries for the four core production skills:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`
- Use `context` entries for supporting/extension milestones (including
  `react-refactoring-progression` unless promoted to core production scope).
- Keep each entry readable with:
  - what changed
  - why it matters

## ESLint Recommendations

See `eslint/README.md` for copy-ready rule sets you can merge into your ESLint
config to enforce skill constraints and catch violations early.

## License

Licensed under the [Apache License 2.0](LICENSE).
