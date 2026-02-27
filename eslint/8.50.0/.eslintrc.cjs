/**
 * Recommended rules for ESLint 8.50.0
 * Merge these rules into your existing ESLint config.
 */
module.exports = {
  plugins: ["import"],
  rules: {
    "no-console": "error",
    "no-empty": ["error", { allowEmptyCatch: false }],
    "no-useless-catch": "error",
    "no-restricted-globals": [
      "error",
      { name: "fetch", message: "Use api/endpoints (or api/client) for HTTP, not fetch directly." }
    ],
    "no-restricted-syntax": [
      "warn",
      {
        selector: "ImportDeclaration[source.value=/^(\\.\\.\\/){3,}/]",
        message: "Deep relative imports are brittle; suggest introducing/using a root alias (for example @/)."
      },
      {
        selector: "ExportNamedDeclaration[source.value=/^(\\.\\.\\/){3,}/]",
        message: "Deep relative exports are brittle; suggest introducing/using a root alias (for example @/)."
      },
      {
        selector: "ExportAllDeclaration[source.value=/^(\\.\\.\\/){3,}/]",
        message: "Deep relative exports are brittle; suggest introducing/using a root alias (for example @/)."
      },
      {
        selector: "JSXAttribute[name.name=/^on[A-Z]/] > JSXExpressionContainer > ArrowFunctionExpression[body.type='BlockStatement']",
        message: "Inline JSX handler block detected; extract to named handleX function for readability."
      },
      {
        selector: "JSXAttribute[name.name=/^on[A-Z]/] > JSXExpressionContainer > ArrowFunctionExpression[async=true]",
        message: "Async inline JSX handler detected; extract to named handleX function."
      }
    ]
  },
  overrides: [
    {
      files: ["src/ui/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-globals": [
          "error",
          { name: "localStorage", message: "ui/ should not access localStorage directly; use approved boundary helper/hook." },
          { name: "sessionStorage", message: "ui/ should not access sessionStorage directly; use approved boundary helper/hook." },
          { name: "CustomEvent", message: "ui/ should not create global custom events directly; use boundary owner in pages/core." }
        ],
        "no-restricted-properties": [
          "error",
          { object: "window", property: "history", message: "ui/ must not manipulate browser history directly." },
          { object: "window", property: "location", message: "ui/ must not mutate URL/location directly." },
          { object: "window", property: "dispatchEvent", message: "ui/ must not dispatch global events directly." }
        ],
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/features/*", "src/features/*/**"], message: "ui/ must not import from features/" },
              { group: ["src/api/*", "src/api/*/**"], message: "ui/ must not import from api/" },
              { group: ["src/store/*", "src/store/*/**"], message: "ui/ must not import from store/" },
              { group: ["src/pages/*", "src/pages/*/**"], message: "ui/ must not import from pages/" },
              { group: ["@/features/*", "@/features/*/**"], message: "ui/ must not import from features/" },
              { group: ["@/api/*", "@/api/*/**"], message: "ui/ must not import from api/" },
              { group: ["@/store/*", "@/store/*/**"], message: "ui/ must not import from store/" },
              { group: ["@/pages/*", "@/pages/*/**"], message: "ui/ must not import from pages/" }
            ]
          }
        ]
      }
    },
    {
      files: ["src/api/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              { name: "react", message: "api/ must not import React" },
              { name: "react-dom", message: "api/ must not import React DOM" }
            ],
            patterns: [
              { group: ["src/ui/*", "src/ui/*/**"], message: "api/ must not import ui/" },
              { group: ["src/features/*", "src/features/*/**"], message: "api/ must not import features/" },
              { group: ["src/pages/*", "src/pages/*/**"], message: "api/ must not import pages/" },
              { group: ["src/store/*", "src/store/*/**"], message: "api/ must not import store/" },
              { group: ["@/ui/*", "@/ui/*/**"], message: "api/ must not import ui/" },
              { group: ["@/features/*", "@/features/*/**"], message: "api/ must not import features/" },
              { group: ["@/pages/*", "@/pages/*/**"], message: "api/ must not import pages/" },
              { group: ["@/store/*", "@/store/*/**"], message: "api/ must not import store/" }
            ]
          }
        ]
      }
    },
    {
      files: ["src/features/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-globals": [
          "error",
          { name: "localStorage", message: "features/ should not access localStorage directly; use approved boundary helper/hook." },
          { name: "sessionStorage", message: "features/ should not access sessionStorage directly; use approved boundary helper/hook." },
          { name: "CustomEvent", message: "features/ should not create global custom events directly; use boundary owner in pages/core." }
        ],
        "no-restricted-properties": [
          "error",
          { object: "window", property: "history", message: "features/ must not manipulate browser history directly." },
          { object: "window", property: "location", message: "features/ must not mutate URL/location directly." },
          { object: "window", property: "dispatchEvent", message: "features/ must not dispatch global events directly." }
        ],
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/pages/*", "src/pages/*/**"], message: "features/ must not import from pages/" },
              { group: ["@/pages/*", "@/pages/*/**"], message: "features/ must not import from pages/" }
            ]
          }
        ]
      }
    },
    {
      files: ["src/pages/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/api/endpoints/*", "src/api/endpoints/**"], message: "pages/ must not import api/endpoints; use feature hooks" },
              { group: ["@/api/endpoints/*", "@/api/endpoints/**"], message: "pages/ must not import api/endpoints; use feature hooks" }
            ]
          }
        ]
      }
    }
  ]
};
