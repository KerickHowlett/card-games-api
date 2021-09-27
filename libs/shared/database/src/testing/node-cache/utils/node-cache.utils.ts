/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from 'lodash';
import NodeCache from 'node-cache';

import { INodeCacheCore, NodeCacheCore } from '../../../lib/node-cache/core';

export const clearNodeCache = async (
    core: INodeCacheCore = NodeCacheCore
): Promise<void> => {
    if (isNodeCacheConnected(core)) {
        await core.clear();
        await core.clearStats();
    }
};

export const connectNodeCache = async (
    core: INodeCacheCore = NodeCacheCore
): Promise<void> => {
    if (!isNodeCacheConnected(core)) {
        await core.connect();
    }
};

export const disconnectNodeCache = async (
    core: INodeCacheCore = NodeCacheCore
): Promise<void> => {
    if (isNodeCacheConnected(core)) {
        await core.disconnect();
    }
};

export const getNodeCacheStore = (
    core: INodeCacheCore = NodeCacheCore
): NodeCache => (core as any).store;

export const isNodeCacheConnected = (
    core: INodeCacheCore = NodeCacheCore
): boolean => !isUndefined(getNodeCacheStore(core));
