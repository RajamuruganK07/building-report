module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  verbose: true,
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!tests/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
