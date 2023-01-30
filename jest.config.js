const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
    },
    testMatch: ['**/*.spec.(ts|tsx)'],
    testTimeout: 10000,
};

module.exports = config;
