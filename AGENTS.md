# react-discipline-skills Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-23

## Active Technologies
- JavaScript (Node.js 20 LTS, ES modules) + Node.js runtime, npm scripts, ESLint (for recommended configs) (001-init-codex-skills)
- Filesystem (repository content) (001-init-codex-skills)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown for policy/spec artifacts + Node.js runtime, npm scripts, existing build/validation scripts (`scripts/generators/generate_agents.mjs`, `scripts/validators/validate_frontmatter.mjs`, `scripts/validators/validate_examples.mjs`), Husky/Commitlint (001-agent-policy-v1)
- Filesystem-based repository artifacts (Markdown specs, policy docs, generated agent docs) (001-agent-policy-v1)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/policy/spec artifacts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint (002-skill-react-architecture-detection)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (002-skill-react-architecture-detection)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (002-skill-react-architecture-detection)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing validation/build scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint (003-skill-react-placement-layering)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (003-skill-react-placement-layering)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (003-skill-react-placement-layering)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint (004-skill-react-reuse-update-new)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (004-skill-react-reuse-update-new)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (004-skill-react-reuse-update-new)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (005-skill-react-implementation-discipline)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (005-skill-react-implementation-discipline)
- JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing repository scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint (006-skill-react-refactoring-progression)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (006-skill-react-refactoring-progression)
- Filesystem-based repository artifacts (`skills/**`, `specs/**`, generated `AGENTS.md`) (006-skill-react-refactoring-progression)

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
- 006-skill-react-refactoring-progression: Added JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing repository scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint
- 006-skill-react-refactoring-progression: Added JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing repository scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint
- 005-skill-react-implementation-discipline: Added JavaScript (Node.js 20 LTS, ES modules) for tooling; Markdown and JSON for skill/spec contracts + Node.js runtime, npm scripts, existing build/validation scripts (`<REPO_ROOT>/scripts/generators/generate_agents.mjs`, `<REPO_ROOT>/scripts/validators/validate_frontmatter.mjs`, `<REPO_ROOT>/scripts/validators/validate_examples.mjs`), Husky/Commitlint


<!-- MANUAL ADDITIONS START -->
## Project Intent (Manual)

- Build exactly **4 production skills** for Codex/agent clients:
  - `react-architecture-detection`
  - `react-placement-and-layering`
  - `react-reuse-update-new`
  - `react-implementation-discipline`
- `agent-policy-v1` is shared policy/configuration baseline for the 4 skills
  and is not counted as one of the 4 production skills.
- Unless a future spec explicitly expands scope, do not add new production
  skills beyond these 4.
<!-- MANUAL ADDITIONS END -->
