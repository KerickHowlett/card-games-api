import { getTime, hoursToSeconds, toDate } from 'date-fns';
import {
    clamp,
    clone,
    isDate,
    isNil as isNullOrUndefined,
    isString,
    memoize,
    multiply,
    now
} from 'lodash';

import type { DateData } from '../../lib/types';
import { HOURS_IN_A_DAY, ONE_DAY } from '../constants';
import { AllDateOutputTypes } from '../types';

export const daysToSeconds = memoize((daysToConvert?: number): number => {
    const days: number = isNullOrUndefined(daysToConvert)
        ? ONE_DAY
        : clamp(daysToConvert, ONE_DAY);
    const totalHours: number = multiply(days, HOURS_IN_A_DAY);
    return hoursToSeconds(totalHours);
});

export const getAllDateOutputTypes = (
    desiredDate?: DateData
): AllDateOutputTypes => {
    const date: Date = getDate(desiredDate);
    return {
        date,
        dateInMilliseconds: getTime(date),
        datePrintOut: date.toString()
    };
};

export const getDate = (desiredDate?: DateData): Date => {
    const date: DateData = desiredDate || now();

    if (isDate(date)) return clone(date);

    const dateArg: number = isString(date) ? Date.parse(date) : date;
    return toDate(dateArg);
};

export const setDateToZeroHour = (desiredDate?: DateData): Date => {
    const date: Date = getDate(desiredDate);
    date.setHours(0, 0, 0, 0);
    return date;
};
