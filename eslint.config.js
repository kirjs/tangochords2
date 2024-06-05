import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    ignores: [ 'dist/**', '.firebase/**', '.astro/**'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
 
];
