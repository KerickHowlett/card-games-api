import { INodeCacheCore, NodeCacheCore } from '../../../lib/node-cache/core';
import { clearNodeCache, connectNodeCache } from '../utils';

export const setupNodeCacheTests = async (
    cache: INodeCacheCore = NodeCacheCore
): Promise<void> => {
    await connectNodeCache(cache);
};

export const setupCleanNodeCache = async (
    cache: INodeCacheCore = NodeCacheCore
): Promise<void> => {
    await clearNodeCache(cache);
};
