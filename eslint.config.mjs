import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/']
  },
  {
    files: ['tabtidy/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        chrome: 'readonly'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true
        }
      ],
      'no-console': 'off'
    }
  }
];
