# react-discipline-skills Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-23

## Active Technologies
- JavaScript (Node.js 20 LTS, ES modules) + Node.js runtime, npm scripts, ESLint (for recommended configs) (001-init-codex-skills)
- Filesystem (repository content) (001-init-codex-skills)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown for policy/spec artifacts + Node.js runtime, npm scripts, existing build/validation scripts (`tools/build/compile_agents.mjs`, `tools/build/validate_frontmatter.mjs`, `tools/build/validate_examples.mjs`), Husky/Commitlint (001-agent-policy-v1)
- Filesystem-based repository artifacts (Markdown specs, policy docs, generated agent docs) (001-agent-policy-v1)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/policy/spec artifacts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint (002-skill-react-architecture-detection)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (002-skill-react-architecture-detection)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (002-skill-react-architecture-detection)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing validation/build scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint (003-skill-react-placement-layering)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (003-skill-react-placement-layering)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (003-skill-react-placement-layering)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint (004-skill-react-reuse-update-new)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (004-skill-react-reuse-update-new)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (004-skill-react-reuse-update-new)

- (001-init-codex-skills)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for 

## Code Style

: Follow standard conventions

## Recent Changes
- 004-skill-react-reuse-update-new: Added JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint
- 004-skill-react-reuse-update-new: Added JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint
- 003-skill-react-placement-layering: Added JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing validation/build scripts (`<REPO_ROOT>/tools/build/compile_agents.mjs`, `<REPO_ROOT>/tools/build/validate_frontmatter.mjs`, `<REPO_ROOT>/tools/build/validate_examples.mjs`), Husky/Commitlint


<!-- MANUAL ADDITIONS START -->
## Project Intent (Manual)

- Build exactly **4 production skills** for Codex/agent clients:
  - `react_architecture_detection`
  - `react_placement_and_layering`
  - `react_reuse_update_new`
  - `react_implementation_discipline`
- `agent-policy-v1` is shared policy/configuration baseline for the 4 skills
  and is not counted as one of the 4 production skills.
- Unless a future spec explicitly expands scope, do not add new production
  skills beyond these 4.
<!-- MANUAL ADDITIONS END -->
