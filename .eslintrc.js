/**
 * ESLint Configuration
 * Code quality and style enforcement
 */

module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'indent': ['warn', 2],
    'linebreak-style': ['warn', 'unix'],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all']
  }
};
