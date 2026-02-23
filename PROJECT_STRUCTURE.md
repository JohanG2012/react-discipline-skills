
---

# Project Setup Spec (Skills Repo + Build + GitHub Actions)

## Repository layout

```text
repo/
  README.md
  eslint/
    10.0.0/
    8.50.0/
  skills/
    
      agent_policy_v1/
        SKILL.md
        rules/
          00_overview.md
          10_<topic>.md
          20_<topic>.md
        AGENTS.md                   # generated
        examples/
          policy_usage.example.md
        schemas/                    # optional
          policy.schema.json

      react_architecture_detection/
        SKILL.md
        rules/
          00_overview.md
          10_<topic>.md
          20_<topic>.md
        AGENTS.md                   # generated
        examples/
          output.example.json
        fixtures/                   # optional
          repo_tree_flat.txt
          repo_tree_mixed.txt
        schemas/
          output.schema.json        # optional

      react_placement_and_layering/
        SKILL.md
        rules/
          00_overview.md
          10_<topic>.md
          20_<topic>.md
        AGENTS.md                   # generated
        examples/
          output.example.json
        schemas/
          output.schema.json

      react_reuse_update_new/
        SKILL.md
        rules/
          00_overview.md
          10_<topic>.md
          20_<topic>.md
        AGENTS.md                   # generated
        examples/
          output.example.json
        schemas/
          output.schema.json

      react_implementation_discipline/
        SKILL.md
        rules/
          00_overview.md
          10_<topic>.md
          20_<topic>.md
        AGENTS.md                   # generated
        examples/
          diff.example.patch
        schemas/
          output.schema.json

    .shared/
      templates/
        SKILL_TEMPLATE.md
        AGENTS_TEMPLATE.md
        RULE_TEMPLATE.md
      schemas/
        skill_base.schema.json      # optional shared schema

  tools/
    build/
      compile_agents.mjs           # rules/ -> AGENTS.md + TOC
      validate_frontmatter.mjs     # optional: ensures SKILL.md has required frontmatter keys
      validate_examples.mjs        # optional: validates examples/*.json against schemas/*.json
      utils.mjs                    # shared helper functions for build scripts

  .github/
    workflows/
      ci.yml

  package.json
  package-lock.json               # or pnpm-lock.yaml / yarn.lock
  node_modules/                   # not committed
```

---

## Build requirements

### Goals

* Ensure every skill has:

  * `SKILL.md` with frontmatter
  * `AGENTS.md` generated from `rules/`
* Ensure `AGENTS.md` is up to date in PRs
* Optionally validate example JSON outputs against schemas

### Node version

* Use Node **20 LTS** (consistent with modern tooling).

---

## `package.json` (recommended scripts)

```json
{
  "name": "react-discipline-skills",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "npm run build:agents",
    "build:agents": "node tools/build/compile_agents.mjs",
    "check": "npm run check:agents && npm run check:frontmatter && npm run check:examples",
    "check:agents": "node tools/build/compile_agents.mjs --check",
    "check:frontmatter": "node tools/build/validate_frontmatter.mjs",
    "check:examples": "node tools/build/validate_examples.mjs"
  }
}
```

Notes:

* `build:agents` **writes** `AGENTS.md`
* `check:agents` runs in `--check` mode and fails if generated output differs (CI-friendly)

---

## Build script spec: `compile_agents.mjs`

### Responsibilities

For each folder under `skills/*/`:

1. If it has `rules/`:

   * read files in lexicographic order
   * concatenate into `AGENTS.md`
   * generate TOC from headings (recommended)
   * prepend a “DO NOT EDIT” header

2. Support:

   * `--check` mode: do not write; compare expected vs existing `AGENTS.md` and exit non-zero if different
   * default mode: write changes

### Behavior requirements

* Deterministic ordering
* Stable TOC generation
* Preserve newline normalization (`\n`)
* Only touches `AGENTS.md` files

---

## script spec: `validate_frontmatter.mjs`

### Responsibilities

For each `skills/*/SKILL.md`:

* parse frontmatter
* require keys:

  * `name`
  * `description`
  * `version`
  * `license`
  * `metadata.category`
  * `metadata.stability`
* fail if missing

---

## script spec: `validate_examples.mjs`

### Responsibilities

If `schemas/output.schema.json` exists in a skill folder:

* validate every `examples/*.json` file against it
* fail on mismatch

---

# GitHub Actions (CI)

## `.github/workflows/ci.yml`

This CI:

* installs dependencies
* runs `npm run check` (includes:

  * generated `AGENTS.md` up-to-date check
  * frontmatter validation
  * example validation)

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Check generated agents + validate skill metadata
        run: npm run check
```

### Optional: auto-fix PRs (not recommended by default)

I recommend **not** auto-committing generated files in CI. Instead, fail CI and require the developer to run `npm run build:agents` locally. This keeps PRs explicit and avoids automation surprises.

---

# Developer workflow

1. Edit `rules/*.md` (source of truth)
2. Run:

   * `npm run build:agents`
3. Commit:

   * updated `AGENTS.md`
   * any rule changes

CI will fail if `AGENTS.md` is stale.

---
