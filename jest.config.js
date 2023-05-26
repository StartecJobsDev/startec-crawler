/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest'
  },
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
}
