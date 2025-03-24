import js from "@eslint/js";
import eslintPluginCypress from "eslint-plugin-cypress";
import eslintPluginJest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Cypress: "readonly",
        cy: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        after: "readonly",
        jest: "readonly",
        test: "readonly",
      },
    },
    plugins: {
      cypress: eslintPluginCypress,
      jest: eslintPluginJest,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
    },
  },
];
