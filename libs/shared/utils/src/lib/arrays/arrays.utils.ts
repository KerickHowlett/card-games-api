import {
    clamp,
    cloneDeep,
    eq,
    every,
    get,
    gte,
    isArray,
    isEmpty,
    isNil as isNullOrUndefined,
    isNumber,
    isUndefined,
    max,
    maxBy,
    size
} from 'lodash';

import { makeNegative } from '../math';
import type {
    AnyArray,
    AnyObject,
    CountOf,
    FindMax,
    NestedArray,
    ObjectOf,
    UnknownArray,
    ValidatorMethod,
    ValueOf
} from '../types';

export const getSize = (subject: CountOf<unknown>): number => {
    if (isNullOrUndefined(subject)) return 0;
    if (isNumber(subject)) return subject;
    return isArray(subject) ? size(subject) : 1;
};

export const hasEnoughElements = (
    assertNumber: number,
    array: UnknownArray
): boolean => gte(size(array), assertNumber);

export const finalIndexOf = (array: UnknownArray): number => size(array) - 1;

export const findMax: FindMax = <T extends AnyObject>(
    array: T[],
    property?: keyof T
): T | ValueOf<T> => {
    if (isEmpty(array)) return null;

    if (isUndefined(property)) return max(array);

    const objectWithMax: ObjectOf<T> = maxBy(array, property);

    return get(objectWithMax, property, null);
};

export const isArrayOf = <T>(
    array: unknown,
    validator: ValidatorMethod<T>
): array is T[] => isArray(array) && every(array, validator);

export const isEmptyOrUndefined = (array: AnyArray): boolean =>
    isNullOrUndefined(array) || isEmpty(array);

export const isFinalIndex = (array: UnknownArray, index: number): boolean =>
    eq(size(array) - 1, index);

export const split = <T>(array: T[], index: number): NestedArray<T> => {
    const arrayToSplit: T[] = cloneDeep(array);
    const splitPoint: number = clamp(index, 0, size(arrayToSplit));

    const firstArray: T[] = arrayToSplit.slice(0, splitPoint);
    const secondArray: T[] = arrayToSplit.slice(splitPoint, size(arrayToSplit));

    return [cloneDeep(firstArray), cloneDeep(secondArray)];
};

export const splitFromTop = <T>(array: T[], index: number): NestedArray<T> => {
    const arrayToSplit: T[] = cloneDeep(array);
    const splitPoint: number = clamp(index, 1, size(arrayToSplit));

    const firstArray: T[] = arrayToSplit.slice(makeNegative(splitPoint));
    const secondArray: T[] = arrayToSplit.slice(
        0,
        size(arrayToSplit) - splitPoint
    );

    return [cloneDeep(firstArray), cloneDeep(secondArray)];
};
