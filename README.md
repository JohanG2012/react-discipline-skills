# React Discipline Skills

This repository contains Codex skills for disciplined React architecture and
implementation workflows. It includes skill definitions, rule sources, and build
scripts to generate agent-readable rule bundles.

## Structure

- `skills/`: Skill definitions, rules, examples, and generated `AGENTS.md`
- `tools/build/`: Generation and validation scripts
- `eslint/`: Recommended ESLint rule sets for supported versions
- `.github/workflows/`: CI configuration

## Build and Validation

- Generate agent summaries: `npm run build:agents`
- Run all checks: `npm run check`

## ESLint Recommendations

See `eslint/README.md` for copy-ready rule sets you can merge into your ESLint
config to enforce skill constraints and catch violations early.
