
---

## 1) Enforce folder boundaries (the big one)

### Best tools

* **`no-restricted-imports`** (built-in ESLint rule) ✅
* **`import/no-restricted-paths`** (from `eslint-plugin-import`) ✅
* **`eslint-plugin-boundaries`** (stronger, more declarative) ⭐️

### What to enforce

Your key rules can be encoded:

* `src/ui/**` must not import from `src/features/**`, `src/api/**`, `src/store/**`
* `src/api/**` must not import React (`react`, `react-dom`) or UI/features
* `src/features/**` must not import from `src/pages/**`
* `src/pages/**` must not import `src/api/endpoints/**` directly (force feature hooks)

**Using `no-restricted-imports` with overrides (works everywhere):**

```js
// .eslintrc.cjs (or .js)
module.exports = {
  plugins: ["import"],
  rules: {
    // optional: general import hygiene
  },
  overrides: [
    // UI boundary
    {
      files: ["src/ui/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/features/*", "src/features/*/**"], message: "ui/ must not import from features/" },
              { group: ["src/api/*", "src/api/*/**"], message: "ui/ must not import from api/" },
              { group: ["src/store/*", "src/store/*/**"], message: "ui/ must not import from store/" },
              { group: ["src/pages/*", "src/pages/*/**"], message: "ui/ must not import from pages/" },
            ],
          },
        ],
      },
    },

    // API boundary
    {
      files: ["src/api/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              { name: "react", message: "api/ must not import React" },
              { name: "react-dom", message: "api/ must not import React DOM" },
            ],
            patterns: [
              { group: ["src/ui/*", "src/ui/*/**"], message: "api/ must not import ui/" },
              { group: ["src/features/*", "src/features/*/**"], message: "api/ must not import features/" },
              { group: ["src/pages/*", "src/pages/*/**"], message: "api/ must not import pages/" },
              { group: ["src/store/*", "src/store/*/**"], message: "api/ must not import store/" },
            ],
          },
        ],
      },
    },

    // Features must not depend on routing layer
    {
      files: ["src/features/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [{ group: ["src/pages/*", "src/pages/*/**"], message: "features/ must not import from pages/" }],
          },
        ],
      },
    },

    // Pages should not talk to endpoints directly (force feature hooks)
    {
      files: ["src/pages/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/api/endpoints/*", "src/api/endpoints/**"], message: "pages/ must not import api/endpoints; use feature hooks" },
            ],
          },
        ],
      },
    },
  ],
};
```

> If you use path aliases like `@/`, change patterns to `@/features/**` etc.

**When to prefer `import/no-restricted-paths`:**

* When you want “zones” (from/to) constraints that are easier to reason about than many patterns.

---

## 2) Keep “server fetching” out of UI and pages

ESLint can’t perfectly detect “fetch only in `api/endpoints`”, but you can get a good approximation:

### Rules to use

* `no-restricted-globals` (block `fetch` globally; allow only in endpoints via overrides)
* `no-restricted-imports` (block `axios`, `ky`, etc. outside api client)
* Optional: `eslint-plugin-unicorn` `unicorn/no-process-exit` etc. (less relevant)

Example: block `fetch` everywhere except endpoints:

```js
overrides: [
  {
    files: ["src/**/*.{ts,tsx}"],
    excludedFiles: ["src/api/endpoints/**/*.{ts,tsx}", "src/api/client/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "Use api/endpoints (or api/client) for HTTP, not fetch directly." },
      ],
    },
  },
]
```

If you use axios/ky:

* block importing it outside `src/api/client/**`:

```js
{
  files: ["src/**/*.{ts,tsx}"],
  excludedFiles: ["src/api/client/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": ["error", { paths: [{ name: "axios", message: "Use api/client wrapper, not axios directly." }] }],
  },
}
```

---

## 3) Enforce “no `any`” and type discipline (TS strict posture)

Use `@typescript-eslint` rules:

* `@typescript-eslint/no-explicit-any`: **error**
* `@typescript-eslint/consistent-type-imports`: **error** (keeps imports clean)
* `@typescript-eslint/no-unused-vars`: **error**
* `@typescript-eslint/no-floating-promises`: **error** (especially good with async)
* `@typescript-eslint/await-thenable`: **error**
* `@typescript-eslint/no-misused-promises`: **error**
* `@typescript-eslint/consistent-type-definitions`: choose `type` or `interface` (pick one)

These help the agent avoid papering over issues with `any` or sloppy async.

---

## 4) Keep files small and complexity low (matches “Implementation Discipline”)

These support your max-lines / “don’t create mega components” goals:

* `max-lines`: warn/error with folder-specific overrides
* `max-lines-per-function`: optional (I’d use warn)
* `complexity`: warn (cyclomatic complexity)
* `max-params`: warn (prop explosion)
* `max-depth`: optional (nested conditionals)

Example folder-specific max-lines:

```js
overrides: [
  { files: ["src/pages/**/*.{ts,tsx}"], rules: { "max-lines": ["warn", { max: 160, skipBlankLines: true, skipComments: true }] } },
  { files: ["src/features/**/sections/**/*.{ts,tsx}"], rules: { "max-lines": ["warn", { max: 280, skipBlankLines: true, skipComments: true }] } },
  { files: ["src/ui/primitives/**/*.{ts,tsx}"], rules: { "max-lines": ["warn", { max: 170, skipBlankLines: true, skipComments: true }] } },
  { files: ["src/api/endpoints/**/*.{ts,tsx}"], rules: { "max-lines": ["warn", { max: 140, skipBlankLines: true, skipComments: true }] } },
]
```

Keep these as **warn**, not error, to avoid fighting the linter during legit exceptions.

---

## 5) Import hygiene (prevents subtle rot)

From `eslint-plugin-import`:

* `import/no-cycle`: **warn/error** (catches circular deps early)
* `import/no-duplicates`: **error**
* `import/order`: (optional) if your repo has a consistent style
* `import/newline-after-import`: **error**

These help keep layering clean and make refactors safer.

---

## 6) Logging policy: “no console” (aligns with your logger wrapper decision)

* `no-console`: **error**, with maybe allow `warn/error` only if you want
* If you create `lib/logger.ts`, you can allow console only in that file via override.

Example:

```js
rules: { "no-console": "error" },
overrides: [
  { files: ["src/lib/logger.ts"], rules: { "no-console": "off" } },
]
```

---

## 7) Enforce “no random env access”

If you want `config/env.ts` to be the only env entry point:

* `no-restricted-properties` to block `process.env.*` usage
* or `no-restricted-globals` / `no-restricted-syntax` patterns

Simple approach:

```js
{
  files: ["src/**/*.{ts,tsx}"],
  excludedFiles: ["src/config/env.ts"],
  rules: {
    "no-restricted-properties": [
      "error",
      { object: "process", property: "env", message: "Access env via config/env.ts only." },
    ],
  },
}
```

(For Vite `import.meta.env`, you can block `MetaProperty` via `no-restricted-syntax`, but it’s a bit more fiddly.)


---

# `eslint-plugin-boundaries`

If you’re willing to add one plugin later, `eslint-plugin-boundaries` can encode “layers/elements” more declaratively than a wall of patterns.
