import { addDays, getTime, toDate } from 'date-fns';
import { chain, isString, now } from 'lodash';
import MockDate from 'mockdate';

import { ONE_DAY, TWO_DAYS } from '../../lib/constants';
import type { DateData } from '../../lib/types';
import { SECONDS_IN_A_DAY } from '../mocks';

export const disableMockDate = (): undefined => {
    MockDate.reset();
    return undefined;
};

export const expectedSecondsInADay = (days: number): number =>
    chain(days).clamp(ONE_DAY).multiply(SECONDS_IN_A_DAY).value();

export const getFutureDate = (
    targetDate: DateData = now(),
    useMockDate = true
): Date => {
    const today: Date = useMockDate
        ? setMockDate(targetDate)
        : new Date(targetDate);
    const todayInMilliseconds: number = getTime(today);
    return addDays(todayInMilliseconds, TWO_DAYS);
};

export const setMockDate = (date: DateData = now()): Date => {
    disableMockDate();

    const dateArg: Date | number = isString(date) ? Date.parse(date) : date;
    const dateToMock: Date = toDate(dateArg);

    dateToMock.setHours(0, 0, 0, 0);

    MockDate.set(dateToMock);

    return dateToMock;
};
