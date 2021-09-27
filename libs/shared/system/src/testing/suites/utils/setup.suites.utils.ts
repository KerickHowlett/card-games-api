import { setupDatabaseAndCacheStub } from '@card-games-api/database/testing';
import { setupLoggerSpies } from '@card-games-api/logger/testing';
import {
    getClusterStubs,
    getOSMocks,
    setFakeTimers,
    stubProcessEvents
} from '@card-games-api/utils/testing';

export const setupEveryTest = (): void => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    setupLoggerSpies();
    getOSMocks();
    getClusterStubs();
    stubProcessEvents();
    setupDatabaseAndCacheStub();
    setFakeTimers();
};
