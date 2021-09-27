/* eslint-disable prefer-const */
import { INeDBCore, NeDBCore } from '../../../lib/nedb/core';
import { INodeCacheCore, NodeCacheCore } from '../../../lib/node-cache/core';
import { connectNeDB } from '../../nedb';
import { setupNodeCacheTests } from '../../node-cache';
import { SetupDatabaseSpies } from '../../types';
import { setupDatabaseSpies } from './spies.setups';

export const setupNeDBAndNodeCache = (
    cache: INodeCacheCore = NodeCacheCore,
    database: INeDBCore = NeDBCore
): SetupDatabaseSpies => {
    const spies: SetupDatabaseSpies = setupDatabaseSpies(cache, database);
    connectNeDB();
    setupNodeCacheTests();
    return spies;
};
