import { setupNeDBTests, setupCleanDatabase } from '../../nedb';
import { setupNodeCacheTests, setupCleanNodeCache } from '../../node-cache';

export const setupAllTests = (): void => {
    setupNeDBTests();
    setupNodeCacheTests();
    setupCleanDatabase();
    setupCleanNodeCache();
};

export const setupEachTest = (): void => {
    setupCleanDatabase();
    setupCleanNodeCache();
};
