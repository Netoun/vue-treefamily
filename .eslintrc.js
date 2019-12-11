module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': [ 'error', 'single'  , { 'avoidEscape': true} ],
    'semi'  : [ 'error', 'never'    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
