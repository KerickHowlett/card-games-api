import { every, isObject } from 'lodash';

import type { AnyArray, AnyObject } from '../types';

export const hasProperty = (
    object: AnyObject,
    property: keyof AnyObject
): boolean => Object.prototype.hasOwnProperty.call(object, property);

export const isInstanceOf = <T extends { new (...args: AnyArray) }>(
    object: unknown,
    instance: T
): object is InstanceType<T> => isObject(object) && object instanceof instance;

export const isObjectOf = <T>(
    object: AnyObject,
    keys: ReadonlyArray<keyof T>
): boolean => {
    const areThere = (key: keyof T): boolean => hasProperty(object, key);
    return isObject(object) && every(keys, areThere);
};
