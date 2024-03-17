module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/', 'dist/'],
  testMatch: ['<rootDir>/src/**/*.(spec|test).(ts|tsx)'],
};
