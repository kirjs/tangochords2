import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  { languageOptions: { globals: globals.browser }, 
  ignores: [
    'dist',
    'dist/**/*',
    './dist/**/*',
    '.dist/',
    'node_modules',
    'node_modules/**/*',
  ],

},
  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
];
