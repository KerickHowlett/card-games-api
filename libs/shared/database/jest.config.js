module.exports = {
    displayName: 'database',
    preset: '../../../jest.preset.js',
    globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
    testEnvironment: 'node',
    transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../../coverage/libs/shared/database',
    coveragePathIgnorePatterns: ['<rootDir>/src/testing'],
    resetMocks: true,
    setupFilesAfterEnv: ['<rootDir>/src/testing/suites/database.suites.ts']
};
