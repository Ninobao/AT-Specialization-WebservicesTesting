import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    ignores: ['node_modules/', 'reports/'],
    rules: {
      'no-unused-vars': 1,
      'no-undef': 1,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    ignores: ['node_modules/', 'reports/'],
    rules: {
      'no-unused-vars': 1,
      'no-undef': 1,
    },
  },
]);
