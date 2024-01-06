/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const baseConfig = {
  testMatch: [
    '**/*.spec.(js|jsx|ts|tsx)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!uuid/)'
  ]
}

const makeModuleNameMapper = m => ({
  ...((m !== 'common' && m !== 'test-utils') ? { '@/(.*)': `<rootDir>/src/${m}/$1` } : {}),
  '@common/(.*)': '<rootDir>/src/common/$1',
  ...((m !== 'test-utils') ? { '@tests/(.*)': `<rootDir>/tests/${m}/$1` } : {}),
  ...((m !== 'test-utils') ? { '@testscommon/(.*)': '<rootDir>/tests/common/$1' } : {}),
  '@utils/(.*)': '<rootDir>/tests/utils/$1',
})

module.exports = {
  projects: [{
    ...baseConfig,
    testEnvironment: 'node',
    displayName: {
      name: 'Main',
      color: 'blue'
    },
    moduleNameMapper: {
      ...makeModuleNameMapper('main')
    },
    roots: ['<rootDir>/tests/main/', '<rootDir>/src/main/']
  }, {
    ...baseConfig,
    testEnvironment: 'jsdom',
    displayName: {
      name: 'Renderer',
      color: 'magenta'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/renderer/setupTests.ts'],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js',
      '\\.(css|less|scss)$': 'identity-obj-proxy',
      ...makeModuleNameMapper('renderer')
    },
    roots: ['<rootDir>/tests/renderer/', '<rootDir>/src/renderer/']
  }, {
    ...baseConfig,
    testEnvironment: 'node',
    displayName: {
      name: 'Common',
      color: 'cyan'
    },
    moduleNameMapper: {
      ...makeModuleNameMapper('common')
    },
    roots: ['<rootDir>/tests/common/', '<rootDir>/src/common/']
  }, {
    ...baseConfig,
    testEnvironment: 'node',
    displayName: {
      name: 'Test Utils',
      color: 'yellow'
    },
    moduleNameMapper: {
      ...makeModuleNameMapper('test-utils')
    },
    roots: ['<rootDir>/tests/utils/']
  }],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!build/**',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/interfaces/**',
    '!**/node_modules/**',

    '!tests/**',
    'tests/utils/**',
    '!tests/utils/**/*.spec.{ts,tsx}',
  ],
};
