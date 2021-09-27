/* eslint-disable @typescript-eslint/no-explicit-any */
import { size } from 'lodash';

import {
    elementOne,
    elementTwo,
    elementThree,
    failObject,
    isTestObject,
    testArray,
    objectKey,
    TestObject,
    testObjectOne,
    testObjectThree,
    testObjectArray
} from '../../testing';
import {
    getSize,
    finalIndexOf,
    findMax,
    hasEnoughElements,
    isArrayOf,
    isEmptyOrUndefined,
    isFinalIndex,
    split,
    splitFromTop
} from './arrays.utils';

describe('Arrays Utils', () => {
    describe('getSize', () => {
        it('should return entered size', async () => {
            expect(await getSize(testArray)).toEqual(size(testArray));
            expect(await getSize(3)).toEqual(3);
            expect(await getSize(testObjectOne)).toEqual(1);
            expect(await getSize([])).toEqual(0);
            expect(await getSize(null)).toEqual(0);
            expect(await getSize(undefined)).toEqual(0);
        });
    });

    describe('hasEnoughElements', () => {
        it('returns identical array without mutating it', async () => {
            expect(hasEnoughElements(1, testArray)).toBe(true);
            expect(hasEnoughElements(2, testArray)).toBe(true);
            expect(hasEnoughElements(3, testArray)).toBe(true);
            expect(hasEnoughElements(4, testArray)).toBe(false);
        });
    });

    describe('finalIndexOf', () => {
        it('should return index number of final array element', async () => {
            const expectedValue: number = (await testArray.length) - 1;
            expect(await finalIndexOf(testArray)).toEqual(expectedValue);
        });
    });

    describe('findMax', () => {
        describe('should return the max value from array', () => {
            it('of primitive elements', async () => {
                expect(await findMax<number>([1, 2, 3])).toEqual(3);
            });

            it('of objects', async () => {
                expect(
                    await findMax<TestObject>(testObjectArray, objectKey)
                ).toEqual(testObjectThree[objectKey]);
            });
        });

        describe('should return null if entered array is', () => {
            it('empty', async () => {
                expect(await findMax<unknown>([])).toBeNull();
            });

            it('undefined', async () => {
                expect(await findMax<unknown>(undefined)).toBeNull();
            });

            it('already null', async () => {
                expect(await findMax<unknown>(null)).toBeNull();
            });
        });
    });

    describe('isArrayOf', () => {
        it('should return index number of final array element', async () => {
            expect(
                await isArrayOf<TestObject>(testObjectArray, isTestObject)
            ).toBe(true);
            expect(
                await isArrayOf<TestObject>(testObjectOne, isTestObject)
            ).toBe(false);
            expect(
                await isArrayOf<TestObject>([failObject], isTestObject)
            ).toBe(false);
        });
    });

    describe('isEmptyOrUndefined', () => {
        it('should return index number of final array element', async () => {
            expect(await isEmptyOrUndefined([])).toBe(true);
            expect(await isEmptyOrUndefined(null)).toBe(true);
            expect(await isEmptyOrUndefined(undefined)).toBe(true);
            expect(await isEmptyOrUndefined(testArray)).toBe(false);
        });
    });

    describe('isFinalIndex', () => {
        it('should return index number of final array element', async () => {
            expect(await isFinalIndex(testArray, 0)).toBe(false);
            expect(await isFinalIndex(testArray, size(testArray) - 1)).toBe(
                true
            );
        });
    });

    describe('split', () => {
        it('should return proper boolean value', async () => {
            const [firstArray, secondArray] = await split(testArray, 1);
            expect(firstArray).toMatchObject([elementOne]);
            expect(secondArray).toMatchObject([elementTwo, elementThree]);
        });
    });

    describe('splitFromTop', () => {
        it('should return proper boolean value', async () => {
            const [firstArray, secondArray] = await splitFromTop(testArray, 1);
            expect(firstArray).toMatchObject([elementThree]);
            expect(secondArray).toMatchObject([elementOne, elementTwo]);
        });
    });
});
