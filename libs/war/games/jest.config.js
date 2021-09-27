module.exports = {
    displayName: 'games',
    preset: '../../../jest.preset.js',
    globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
    testEnvironment: 'node',
    transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../../coverage/libs/war/games',
    coveragePathIgnorePatterns: ['<rootDir>/src/testing'],
    setupFilesAfterEnv: ['<rootDir>/src/testing/suites/game.suites.ts'],
    resetMocks: true
};
