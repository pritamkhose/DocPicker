// Link
// https://www.npmjs.com/package/jest-html-reporter
// https://www.testim.io/blog/react-native-unit-testing/
// https://www.reactnative.guide/7-testing/7.1-jest-setup.html
// https://github.com/jest-community/awesome-jest#reporters

// https://callstack.github.io/react-native-testing-library/docs/getting-started/
// https://reactnative.dev/docs/testing-overview

// Tutorial https://www.youtube.com/watch?v=bOJkNut1Qyo

const sum = require('../../components/sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 10 + 20 to equal 30', () => {
  expect(sum(10, 20)).toBe(30);
});
