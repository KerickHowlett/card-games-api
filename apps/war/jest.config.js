module.exports = {
    displayName: 'war',
    preset: '../../jest.preset.js',
    globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
    testEnvironment: 'node',
    transform: { '^.+\\.[tj]s$': 'ts-jest' },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/war',
    coveragePathIgnorePatterns: ['<rootDir>/src/testing'],
    resetMocks: true,
    setupFilesAfterEnv: ['<rootDir>/src/testing/suites/war.suites.ts'],
    testTimeout: 9999999,
    verbose: true
};
