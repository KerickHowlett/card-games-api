import { INodeCacheCore, NodeCacheCore } from '../../../lib/node-cache/core';
import { disconnectNodeCache } from '../utils';

export const teardownNodeCacheTests = async (
    cache: INodeCacheCore = NodeCacheCore
): Promise<void> => {
    await disconnectNodeCache(cache);
};
