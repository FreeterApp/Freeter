// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/*',
      'build/*',
      'webpack.main.config.js',
      'webpack.preload.config.js',
      'webpack.renderer.config.js',
    ],
    rules: {
      quotes: ['error', 'single', {
        avoidEscape: true,
      }],

      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      }],

      'max-len': ['error', {
        code: 160,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],

      'function-paren-newline': ['error', 'multiline-arguments'],

      'comma-dangle': ['error', {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'ignore',
      }],

      'comma-spacing': ['error', {
        before: false,
        after: true,
      }],

      'consistent-return': 'error',

      'no-use-before-define': ['error', {
        functions: true,
        classes: true,
        variables: true,
      }],

      'no-multi-spaces': 'error',

      'new-cap': ['error', {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: [],
      }],

      'arrow-body-style': ['error', 'as-needed', {
        requireReturnForObjectLiteral: false,
      }],

      curly: 'error',
      'no-var': 'error',
      eqeqeq: 'error',
    },
  }
);
