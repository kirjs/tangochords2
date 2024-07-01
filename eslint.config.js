import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
  },
  {
    ignores: ["dist/**", ".firebase/**", ".astro/**"],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];
