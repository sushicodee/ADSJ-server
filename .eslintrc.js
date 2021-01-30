/* eslint-disable comma-dangle */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'comma-dangle': [2, 'never'],
    'no-console': 1,
  },
};
