import {
    setupCleanDatabase,
    setupCleanNodeCache,
    setupNeDBTests,
    setupNodeCacheTests
} from '@card-games-api/database/testing';
import { setMockDate } from '@card-games-api/utils/testing';

export const setupAllTests = async (): Promise<void> => {
    await setMockDate();
    await setupNeDBTests();
    await setupNodeCacheTests();
    await setupCleanDatabase();
    await setupCleanNodeCache();
};

export const setupEachTest = async (): Promise<void> => {
    await setMockDate();
    await setupCleanDatabase();
    await setupCleanNodeCache();
};
