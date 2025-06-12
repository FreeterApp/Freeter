import base from '../../eslint.config.mjs';

export default [
  ...base,
  {
    languageOptions: {
      globals: {
        jest: 'readonly'
      }
    },
  }
];
