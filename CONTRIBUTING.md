# Contributing

Thanks for contributing to React Discipline Skills.

## Ground Rules

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Keep changes focused and aligned with active specs.
- Do not manually edit generated `AGENTS.md` files.

## Development Setup

From repository root:

```bash
npm ci
npm run build:agents
npm run check
```

Strongly recommended git hook setup (enforces commit message standard locally):

```bash
npm run prepare
```

This installs Husky hooks, including `commit-msg` validation with Commitlint.

## Change Workflow

1. Create a branch for your change.
2. Edit source files (`rules/`, templates, scripts, docs), not generated outputs unless generation is the intent.
3. Regenerate and validate:

```bash
npm run build:agents
git diff --exit-code
npm run check
```

4. Update `CHANGELOG.md` for milestone-level changes.
5. Open a pull request using `.github/PULL_REQUEST_TEMPLATE.md`.

## Commit Messages

Use Conventional Commits compatible types (`feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `build`, `chore`, `style`, `perf`, `revert`, `config`).

Running `npm run prepare` is strongly recommended so invalid commit messages are
blocked before they reach CI.

## Pull Requests

- Include scope, rationale, and validation evidence.
- Link related spec/issue when available.
- Keep PRs reviewable; split large changes if needed.

## Reporting Issues

Use `.github/ISSUE_TEMPLATE.md` and include:

- expected behavior
- actual behavior
- reproduction details
- environment/context
