module.exports = {
    displayName: 'system',
    preset: '../../../jest.preset.js',
    globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
    testEnvironment: 'node',
    transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../../coverage/libs/shared/system',
    coveragePathIgnorePatterns: ['<rootDir>/src/testing'],
    setupFilesAfterEnv: ['<rootDir>/src/testing/suites/suites.environment.ts'],
    resetMocks: true,
    testTimeout: 10000,
    timers: 'fake'
};
