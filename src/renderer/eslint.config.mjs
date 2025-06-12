import base from '../../eslint.config.mjs';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...base,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  {
    languageOptions: {
      globals: {
        browser: 'readonly'
      }
    },
    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        version: 'detect'
      },
      linkComponents: [
        'Hyperlink',
        { 'name': 'Link', 'linkAttribute': 'to' }
      ]
    }
  }
];
