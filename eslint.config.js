const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const tseslint = require("@typescript-eslint/eslint-plugin");
const parser = require("@typescript-eslint/parser");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    ignores: ["dist/*"],
    rules: {
      "react/jsx-max-props-per-line": "off",
      "react/jsx-first-prop-new-line": "off",
      // Unused variable detection
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Override for test files to allow require() statements in Jest mocks
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/test-setup.ts", "**/__tests__/**/*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
