module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/config/swagger.js'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
  verbose: true,
};
