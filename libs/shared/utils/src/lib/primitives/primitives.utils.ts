import {
    isEmpty,
    isNil as isNullOrUndefined,
    isString,
    isNumber
} from 'lodash';

import type { Primitive } from '../types';

export const hasDefinedString = (value: unknown): value is string =>
    !(isNullOrUndefined(value) || isEmpty(value));

export const isPrimitive = (value: unknown): value is Primitive =>
    !isNullOrUndefined(value) && (isString(value) || isNumber(value));
