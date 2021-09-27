import type { Stats } from 'node-cache';

import {
    key,
    keyTwo,
    value,
    valueTwo,
    keyValueSet,
    keyValueSetArray
} from '../../../testing';
import { NodeCacheCore as cache } from './node-cache.core';

describe('NodeCacheCore', () => {
    it('should create instance without crashing', () => {
        expect(cache).toBeTruthy();
    });

    describe('get', () => {
        it('should return boolean', async () => {
            await cache.set<string>(key, value);
            expect(await cache.get<string>(key)).toEqual(value);
        });
    });

    describe('has', () => {
        it('should return boolean', async () => {
            await cache.set(key, 'test');
            expect(await cache.has(key)).toBe(true);
            expect(await cache.has('foo')).toBe(false);
        });
    });

    describe('keys', () => {
        it('should get array of keys', async () => {
            await cache.set(key, value);
            const keysList: string[] = await cache.keys();
            expect(keysList.length).toEqual(1);
        });
    });

    describe('remove', () => {
        it('should get array of keys', async () => {
            await cache.set(key, value);
            expect(await cache.get<string>(key)).toEqual(value);
            await cache.remove(key);
            expect(await cache.get<string>(key)).toBeUndefined();
        });
    });

    describe('set', () => {
        it('should set with single primitive key', async () => {
            await cache.set(key, value);
            expect(await cache.get<string>(key)).toEqual(value);
        });

        it('should set with single key value set', async () => {
            await cache.set(keyValueSet);
            expect(await cache.get<string>(key)).toEqual(value);
        });

        it('should set with key value set array', async () => {
            await cache.set(keyValueSetArray);
            expect(await cache.get<string>(key)).toEqual(value);
            expect(await cache.get<string>(keyTwo)).toEqual(valueTwo);
        });
    });

    describe('stats', () => {
        it('should get stats', async () => {
            await cache.set(key, value);
            const stats: Stats = await cache.stats();

            expect(stats).toHaveProperty('hits');
            expect(stats).toHaveProperty('keys');
            expect(stats).toHaveProperty('ksize');
            expect(stats).toHaveProperty('misses');
            expect(stats).toHaveProperty('vsize');

            expect(stats.keys).toEqual(1);
        });
    });
});
