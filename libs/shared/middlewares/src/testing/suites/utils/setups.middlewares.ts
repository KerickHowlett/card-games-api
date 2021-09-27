import { setupLoggerSpies } from '@card-games-api/logger/testing';

export const setupEveryTest = (): void => {
    jest.resetAllMocks();
    setupLoggerSpies();
};
