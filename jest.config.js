// @ts-check
const { createCjsPreset } = require('jest-preset-angular/presets');

/** @type {import('jest').Config} */
module.exports = {
  ...createCjsPreset(),
  // jest-preset-angular v17 ships its own jsdom environment (backed by the local
  // `jsdom` package) instead of the standalone `jest-environment-jsdom`.
  testEnvironment: 'jest-preset-angular/environments/jest-jsdom-env',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/cypress/'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@layout/(.*)$': '<rootDir>/src/app/layout/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/mocks/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
};
