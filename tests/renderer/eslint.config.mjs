import base from '../../eslint.config.mjs';
import jestDom from 'eslint-plugin-jest-dom';

export default [
  ...base,
  jestDom.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        jest: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }
];
