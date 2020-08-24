module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  plugins: [
    'html'
  ],
  rules: {
    'no-console': ['off'],
    'curly': ['error'],
    'no-floating-decimal': ['error'],
    'no-undef': ['error'],
    'no-unused-vars': ['error', {
      vars: 'local',
      args: 'none'
    }],
    'no-var': 'error',
    'indent': ['error', 4, {
      SwitchCase: 1
    }],
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'brace-style': ['error', '1tbs', {
      'allowSingleLine': true
    }],
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': ['error', {
      before: true,
      after: true
    }],
    'no-duplicate-imports': ['error', {
      includeExports: true
    }],
    'space-in-parens': ['error', 'never'],
    'quote-props': ['error', 'as-needed'],
    'keyword-spacing': ['error', {
      before: true,
      after: true
    }],
    'key-spacing': ['error']
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    worker: true,
    mocha: true,
    phantomjs: true,
    serviceworker: true
  }
};