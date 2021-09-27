import { setupCleanDatabase, teardownNeDBCoreTests } from '../../nedb';
import { setupCleanNodeCache, teardownNodeCacheTests } from '../../node-cache';

export const teardownAllTests = (): void => {
    setupCleanDatabase();
    setupCleanNodeCache();
    teardownNeDBCoreTests();
    teardownNodeCacheTests();
};
