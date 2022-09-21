module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "test/.*\.test\.ts",
  testPathIgnorePatterns: ['node_modules/', "templates/"],
  globals: {
    'ts-jest': {
      tsconfig: 'test/tsconfig.test.json'
    }
  }
};
