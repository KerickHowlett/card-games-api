import { failObject } from '@card-games-api/utils/testing';
import { every } from 'lodash';

import { setObject, setsArray } from '../../../testing/node-cache';
import { KeyValueSet } from '../types';
import { isKeyValueSet, remapSetValues } from './node-cache.helpers';

describe('NodeCacheCore Helpers', () => {
    describe('isKeyValueSet', () => {
        it('should return the proper data sets', async () => {
            expect(await isKeyValueSet(setObject)).toBe(true);
            expect(await isKeyValueSet(failObject)).toBe(false);
        });
    });

    describe('remapSetValues', () => {
        it('should return the proper data sets', async () => {
            const remappedSets: KeyValueSet<string>[] =
                await remapSetValues<string>(setsArray);
            expect(await every(remappedSets, 'val')).toBe(true);
        });
    });
});
