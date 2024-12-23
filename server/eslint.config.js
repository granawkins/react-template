import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config({ ignores: ['dist'] }, prettier, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.node,
    },
  },
  rules: {
    'max-len': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-trailing-spaces': 'off',
  },
});
