module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2023: true,
    node: true,
    jest: true,
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // add project-specific overrides here
    'prettier/prettier': 'error',
    // disable prop-types (we use TypeScript)
    'react/prop-types': 'off',
    // allow tsx files to define React components
    'react/react-in-jsx-scope': 'off',
  },
};
