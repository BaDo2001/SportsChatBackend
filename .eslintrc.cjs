const path = require("path");

const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "simple-import-sort"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    project: path.resolve(__dirname, "./tsconfig.json"),
    sourceType: "module",
  },
  ignorePatterns: [".eslintrc.cjs", "sportradar.ts"],
  rules: {
    curly: ["error", "all"],
    "default-param-last": ["error"],
    "arrow-body-style": "error",
    "function-paren-newline": "off",
    "implicit-arrow-linebreak": "off",
    "no-unused-expressions": "off",
    "default-case": "off",
    "consistent-return": "off",
    "no-plusplus": "off",
    "no-restricted-syntax": "off",

    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/consistent-type-imports": "error",

    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["reflect-metadata"],
          ["^@?\\w"],
          ["^@\\/"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",

    "import/extensions": [
      "error",
      {
        ts: "never",
        json: "always",
      },
    ],
    "import/no-unresolved": "off",
    "import/order": "off",
    "import/prefer-default-export": "off",
  },
});
