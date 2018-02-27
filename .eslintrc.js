module.exports = {
  extends: [
    'eslint:recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {},
  rules: {
    'prefer-const': 'error',
    'object-shorthand': "error",
    'no-param-reassign': ['error', { props: true }],
    'no-underscore-dangle': 0,
    'no-bitwise': 0,
    'no-use-before-define': 'error',
    'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions' }],
    'new-cap': 1,
    eqeqeq: 1,
    'no-console': 1,
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_$',
      },
    ],
    camelcase: 1,
  },
};
