import { isPrimitive, OrArray } from '@card-games-api/utils';
import { cloneDeep } from 'lodash';
import NodeCache, { Options, Stats, ValueSetItem } from 'node-cache';

import { remapSetValues } from '../helpers';
import { ConfigPreset } from '../presets';
import { KeyOrSet, KeyValueSet, QueryKey } from '../types';

class NodeCacheCore {
    private store: NodeCache;

    public async clear(): Promise<Stats> {
        await this.store.flushAll();
        return this.stats();
    }

    public async clearStats(): Promise<Stats> {
        await this.store.flushStats();
        return this.stats();
    }
    public async connect(options: Options = ConfigPreset): Promise<void> {
        this.store = await new NodeCache(options);
    }

    public async disconnect(): Promise<void> {
        await this.store.flushAll();
        await this.store.flushStats();
        return await this.store.close();
    }

    public async get<T>(key: QueryKey): Promise<T> {
        return await this.store.get(key);
    }

    public async has(key: QueryKey): Promise<boolean> {
        return this.store.has(key);
    }

    public async keys(): Promise<string[]> {
        return await this.store.keys();
    }

    public async remove(key: OrArray<QueryKey>): Promise<number> {
        return this.store.del(key);
    }

    public async set<T>(
        keyOrSet: OrArray<KeyOrSet<T>>,
        value?: T,
        ttl?: number
    ): Promise<boolean> {
        if (isPrimitive(keyOrSet)) {
            return this.store.set(keyOrSet, value, ttl);
        }

        const keyValueSet: OrArray<KeyValueSet<T>> = cloneDeep(
            keyOrSet
        ) as OrArray<KeyValueSet<T>>;
        const setValueItem: ValueSetItem<T>[] = await remapSetValues<T>(
            keyValueSet
        );

        return this.store.mset(setValueItem);
    }

    public async stats(): Promise<Stats> {
        return this.store.getStats();
    }
}

export type INodeCacheCore = NodeCacheCore;

const core: INodeCacheCore = new NodeCacheCore();

export { core as NodeCacheCore };
