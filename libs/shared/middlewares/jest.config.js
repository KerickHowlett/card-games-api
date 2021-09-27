module.exports = {
    displayName: 'middlewares',
    preset: '../../../jest.preset.js',
    globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
    testEnvironment: 'node',
    transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../../coverage/libs/shared/middlewares',
    coveragePathIgnorePatterns: ['<rootDir>/src/testing'],
    resetMocks: true,
    setupFilesAfterEnv: ['<rootDir>/src/testing/suites/suites.environment.ts']
};
