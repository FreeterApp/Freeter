import base from '../../eslint.config.mjs';

export default [
  ...base,
  {
    languageOptions: {
      globals: {
        node: 'readonly'
      }
    }
  }
];
