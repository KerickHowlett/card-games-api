import { clone } from 'lodash';

import { KeyValueSet, QueryKey } from '../../../lib/node-cache/types';

export const key: QueryKey = 'test-key';
export const keyTwo: QueryKey = 'test-key-two';
export const value = 'test';
export const valueTwo = 'test-two';

export const setObject: KeyValueSet<string> = { key, value };
export const setsArray: KeyValueSet<string>[] = [
    clone(setObject),
    clone(setObject)
];
export const keyValueSet: KeyValueSet<string> = { key, value };
export const keyValueSetTwo: KeyValueSet<string> = {
    key: keyTwo,
    value: valueTwo
};
export const keyValueSetArray: KeyValueSet<string>[] = [
    keyValueSet,
    keyValueSetTwo
];
