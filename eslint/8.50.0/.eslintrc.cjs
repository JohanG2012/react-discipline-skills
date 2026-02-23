/**
 * Recommended rules for ESLint 8.50.0
 * Merge these rules into your existing ESLint config.
 */
module.exports = {
  plugins: ["import"],
  rules: {
    "no-console": "error",
    "no-restricted-globals": [
      "error",
      { name: "fetch", message: "Use api/endpoints (or api/client) for HTTP, not fetch directly." }
    ]
  },
  overrides: [
    {
      files: ["src/ui/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/features/*", "src/features/*/**"], message: "ui/ must not import from features/" },
              { group: ["src/api/*", "src/api/*/**"], message: "ui/ must not import from api/" },
              { group: ["src/store/*", "src/store/*/**"], message: "ui/ must not import from store/" },
              { group: ["src/pages/*", "src/pages/*/**"], message: "ui/ must not import from pages/" }
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
              { group: ["src/store/*", "src/store/*/**"], message: "api/ must not import store/" }
            ]
          }
        ]
      }
    },
    {
      files: ["src/features/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              { group: ["src/pages/*", "src/pages/*/**"], message: "features/ must not import from pages/" }
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
              { group: ["src/api/endpoints/*", "src/api/endpoints/**"], message: "pages/ must not import api/endpoints; use feature hooks" }
            ]
          }
        ]
      }
    }
  ]
};
