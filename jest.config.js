module.exports = {
    roots: ['<rootDir>/src', '<rootDir>/src/tests'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.js?$': 'babel-jest',
    },
    moduleNameMapper: {
      '~/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['<rootDir>/**/*.test.js']
}