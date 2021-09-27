import { INeDBCore, NeDBCore } from '../../../lib/nedb/core';
import { INodeCacheCore, NodeCacheCore } from '../../../lib/node-cache/core';
import { disconnectNeDB } from '../../nedb/utils';
import { disconnectNodeCache } from '../../node-cache/utils';

export const teardownNeDBAndNodeCache = async (
    cache: INodeCacheCore = NodeCacheCore,
    database: INeDBCore = NeDBCore
): Promise<void> => {
    await disconnectNodeCache(cache);
    await disconnectNeDB(database);
};
