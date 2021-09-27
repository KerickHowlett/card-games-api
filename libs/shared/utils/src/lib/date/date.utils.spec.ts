import { addDays, getTime } from 'date-fns';
import { isNumber, isString } from 'lodash';

import {
    disableMockDate,
    EACH_DAY_IN_A_WEEK,
    expectedSecondsInADay,
    getFutureDate,
    SECONDS_IN_A_DAY,
    setMockDate,
    setupZeroHourTests
} from '../../testing';
import { TWO_DAYS } from '../constants';
import {
    daysToSeconds,
    getAllDateOutputTypes,
    getDate,
    setDateToZeroHour
} from './date.utils';

let expectedDate: Date;

describe('Date Utilities', () => {
    describe('daysToSeconds', () => {
        describe('should return number of total seconds', () => {
            it('for ONE (1) day as the defaul with no entered arguments', async () => {
                expect(await daysToSeconds()).toEqual(SECONDS_IN_A_DAY);
            });
        });

        describe.each(EACH_DAY_IN_A_WEEK)(
            'should convert entered days into the correct total of seconds',
            (days: number) => {
                it(`convert ${days} days into seconds`, async () => {
                    expect(await daysToSeconds(days)).toEqual(
                        await expectedSecondsInADay(days)
                    );
                });
            }
        );
    });

    describe('getAllDateOutputTypes', () => {
        describe('should return date', () => {
            beforeAll(() => (expectedDate = setMockDate()));
            afterAll(() => (expectedDate = disableMockDate()));

            it('as a normal date object', async () => {
                const { date } = await getAllDateOutputTypes();

                expect(date).toMatchObject(expectedDate);

                expect(date).toBeInstanceOf(Date);
                expect(isNumber(date)).toBe(false);
                expect(isString(date)).toBe(false);
            });

            it("as a number that's been converted into milliseconds", async () => {
                const expectedDateInMS: number = await getTime(expectedDate);
                const { dateInMilliseconds } = await getAllDateOutputTypes();

                expect(dateInMilliseconds).toEqual(expectedDateInMS);

                expect(dateInMilliseconds).not.toBeInstanceOf(Date);
                expect(isNumber(dateInMilliseconds)).toBe(true);
                expect(isString(dateInMilliseconds)).toBe(false);
            });

            it('as a formatted string', async () => {
                const { datePrintOut } = await getAllDateOutputTypes();

                expect(datePrintOut).toEqual(expectedDate.toString());

                expect(datePrintOut).not.toBeInstanceOf(Date);
                expect(isNumber(datePrintOut)).toBe(false);
                expect(isString(datePrintOut)).toBe(true);
            });
        });
    });

    describe('getDate', () => {
        describe('DEFAULT | No Entered Arguments', () => {
            beforeAll(() => (expectedDate = setMockDate()));
            afterAll(() => (expectedDate = disableMockDate()));

            it("should return today's date", async () => {
                expect(await getDate()).toMatchObject(expectedDate);
            });
        });

        describe('WITH ARGUMENTS | should return Date object based on the argument type of', () => {
            beforeAll(() => (expectedDate = setMockDate()));
            afterAll(() => (expectedDate = disableMockDate()));

            it('date object', async () => {
                const dateArg: Date = addDays(expectedDate, TWO_DAYS);
                expect(await getDate(dateArg)).toMatchObject(
                    getFutureDate(expectedDate, false)
                );
            });

            it('date object', async () => {
                const dateArg: Date = addDays(expectedDate, TWO_DAYS);
                expect(await getDate(dateArg)).toMatchObject(
                    getFutureDate(expectedDate, false)
                );
            });

            it('number (milliseconds', async () => {
                const dateArg: number = getTime(
                    addDays(expectedDate, TWO_DAYS)
                );
                expect(await getDate(dateArg)).toMatchObject(
                    getFutureDate(expectedDate, false)
                );
            });

            it('string', async () => {
                const dateArg: string = addDays(
                    expectedDate,
                    TWO_DAYS
                ).toString();
                expect(await getDate(dateArg)).toMatchObject(
                    getFutureDate(expectedDate, false)
                );
            });
        });
    });

    describe('setDateToZeroHour', () => {
        describe('DEFAULT | No Entered Arguments', () => {
            beforeAll(() => (expectedDate = setupZeroHourTests()));
            afterAll(() => (expectedDate = undefined));

            it("should return a date with the day's hours, minutes, seconds, and milliseconds all set to zero (0)", async () => {
                expect(await setDateToZeroHour(new Date())).toMatchObject(
                    expectedDate
                );
            });
        });
    });
});
