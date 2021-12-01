module.exports = {
  root: true,
  extends: '@react-native-community',
  // extends: 'airbnb',
  parser: 'babel-eslint',
  ecmaFeatures: {
    classes: true,
  },
  rules: {
    'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx']}],
    'react-native/no-inline-styles': 0,
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
      },
    ],
  },
};
