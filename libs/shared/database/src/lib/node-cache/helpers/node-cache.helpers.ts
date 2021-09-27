import { isObjectOf, OrArray } from '@card-games-api/utils';
import { castArray, isNil as isNullOrUndefined, map, omitBy } from 'lodash';

import type { ValueSetItem } from 'node-cache';

import type { KeyValueSet } from '../types';

export const isKeyValueSet = <T>(object: unknown): object is KeyValueSet<T> =>
    isObjectOf<KeyValueSet<T>>(object, ['key', 'value']);

export const remapSetValues = <T>(
    valueSets: OrArray<KeyValueSet<T>>
): ValueSetItem<T>[] => {
    const renameKey = (valueSet: KeyValueSet<T>): ValueSetItem<T> =>
        omitBy<ValueSetItem<T>>(
            {
                key: valueSet.key,
                ttl: valueSet.ttl,
                val: valueSet.value
            },
            isNullOrUndefined
        ) as ValueSetItem<T>;

    return map(castArray(valueSets), renameKey);
};
