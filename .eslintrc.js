module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'standard-react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'react/prop-types': 'off'
  }
}
