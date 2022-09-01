module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: ['plugin:react/recommended', 'standard'],
  overrides: [],
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    presets: ['@babel/preset-react']
  },
  plugins: ['react'],
  rules: {
    indent: ['error', 2],
    'comma-dangle': 'off',
    curly: 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'ignore',
        named: 'ignore',
        asyncArrow: 'ignore'
      }
    ],
    complexity: [
      'error',
      {
        max: 21
      }
    ]
  }
}
