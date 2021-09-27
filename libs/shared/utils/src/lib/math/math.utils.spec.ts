import { isNumber, isString, size } from 'lodash';

import {
    ELEVEN,
    ELEVEN_AS_WORD,
    NaN_AS_STRING,
    ONE,
    ONE_AS_WORD,
    ONE_HUNDRED,
    ONE_HUNDRED_AS_WORD,
    ONE_HUNDRED_EIGHT,
    ONE_HUNDRED_EIGHT_AS_WORD,
    ONE_THOUSAND,
    ONE_THOUSAND_AS_WORD,
    ONE_THOUSAND_TWENTY_FOUR,
    ONE_THOUSAND_TWENTY_FOUR_AS_WORD,
    TWENTY_ONE,
    TWENTY_ONE_AS_WORD
} from '../../testing';
import {
    anyRemaining,
    divideDown,
    divideUp,
    isNegative,
    remainderOf,
    makeNegative,
    numberToWord
} from './math.utils';

describe('Math Utils', () => {
    describe('anyCardsLeftOver', () => {
        it('should return the proper boolean value based on the number of remaining cards entered', async () => {
            expect(await anyRemaining(5)).toBe(true);
            expect(await anyRemaining(0)).toBe(false);
        });
    });

    describe('divideDown', () => {
        it('should return the divided number rounded down', async () => {
            expect(await divideDown(4.4, 2)).toEqual(2);
        });
        it('should return zero if either argument is zero (0)', async () => {
            expect(await divideDown(0, 0)).toEqual(0);
            expect(await divideDown(0, 2)).toEqual(0);
            expect(await divideDown(2, 0)).toEqual(0);
        });
    });

    describe('divideUp', () => {
        it('should return the divided number rounded up', async () => {
            expect(await divideUp(4.4, 2)).toEqual(3);
        });
        it('should return zero if either argument is zero (0)', async () => {
            expect(await divideUp(0, 0)).toEqual(0);
            expect(await divideUp(0, 2)).toEqual(0);
            expect(await divideUp(2, 0)).toEqual(0);
        });
    });

    describe('isNegative', () => {
        it('should return a boolean depending where it falls before or after zero (0)', async () => {
            expect(await isNegative(5)).toBe(false);
            expect(await isNegative(0)).toBe(false);
            expect(await isNegative(-5)).toBe(true);
        });
    });

    describe('remainderOf', () => {
        it('should get remainderOf after division', async () => {
            expect(await remainderOf(5, 2)).toEqual(1);
            expect(await remainderOf(4, 2)).toEqual(0);
        });
    });

    describe('makeNegative', () => {
        it('should take a positive integer and turn it into a negative number', async () => {
            const negativeNumber = await makeNegative(5);
            expect(negativeNumber).toBeLessThan(0);
            expect(negativeNumber).toEqual(-5);
        });

        it('should still return a negative number even when a negative number is used as input', async () => {
            const negativeNumber = await makeNegative(-10);
            expect(negativeNumber).toBeLessThan(0);
            expect(negativeNumber).toEqual(-10);
        });
    });

    describe('numberToWord', () => {
        it('should convert a number into a string', async () => {
            expect(isString(await numberToWord(ONE))).toBe(true);
        });

        it('should NOT be an actual number', async () => {
            expect(isNumber(await numberToWord(ONE))).toBe(false);
        });

        it('should NOT be read as NaN', async () => {
            expect(await numberToWord(ONE).toLowerCase()).not.toEqual(
                NaN_AS_STRING.toLowerCase()
            );
        });

        it('should convert a single digit number into a word', async () => {
            expect(await numberToWord(ONE).toLowerCase()).toEqual(
                ONE_AS_WORD.toLowerCase()
            );
        });

        it('should insert a space where appropriate for multi-worded numbers', async () => {
            expect(await numberToWord(TWENTY_ONE).toLowerCase()).toEqual(
                TWENTY_ONE_AS_WORD.toLowerCase()
            );
            expect(await numberToWord(ONE_HUNDRED).toLowerCase()).toEqual(
                ONE_HUNDRED_AS_WORD.toLowerCase()
            );
            expect(await numberToWord(ONE_THOUSAND).toLowerCase()).toEqual(
                ONE_THOUSAND_AS_WORD.toLowerCase()
            );
        });

        it('should NOT insert spaces for multi-digit numbers when the spelled out word does not have any', async () => {
            expect(await numberToWord(ELEVEN).toLowerCase()).toEqual(
                ELEVEN_AS_WORD.toLowerCase()
            );
        });

        it(`should convert complex numbers without inserting "and's" or the like into the string`, async () => {
            expect(await numberToWord(ONE_HUNDRED_EIGHT).toLowerCase()).toEqual(
                ONE_HUNDRED_EIGHT_AS_WORD.toLowerCase()
            );
            expect(
                await numberToWord(ONE_THOUSAND_TWENTY_FOUR).toLowerCase()
            ).toEqual(ONE_THOUSAND_TWENTY_FOUR_AS_WORD.toLowerCase());
        });

        it('should use the proper Start Casing (each word within the string capitalized)', async () => {
            expect(await numberToWord(ONE)).toEqual(ONE_AS_WORD);
            expect(await numberToWord(ELEVEN)).toEqual(ELEVEN_AS_WORD);
            expect(await numberToWord(TWENTY_ONE)).toEqual(TWENTY_ONE_AS_WORD);
            expect(await numberToWord(ONE_HUNDRED)).toEqual(
                ONE_HUNDRED_AS_WORD
            );
            expect(await numberToWord(ONE_HUNDRED_EIGHT)).toEqual(
                ONE_HUNDRED_EIGHT_AS_WORD
            );
            expect(await numberToWord(ONE_THOUSAND)).toEqual(
                ONE_THOUSAND_AS_WORD
            );
            expect(await numberToWord(ONE_THOUSAND_TWENTY_FOUR)).toEqual(
                ONE_THOUSAND_TWENTY_FOUR_AS_WORD
            );
        });

        it('should not have any extra unneded white space', async () => {
            expect(await numberToWord(ONE)).toHaveLength(size(ONE_AS_WORD));
            expect(await numberToWord(ELEVEN)).toHaveLength(
                size(ELEVEN_AS_WORD)
            );
            expect(await numberToWord(TWENTY_ONE)).toHaveLength(
                size(TWENTY_ONE_AS_WORD)
            );
            expect(await numberToWord(ONE_HUNDRED)).toHaveLength(
                size(ONE_HUNDRED_AS_WORD)
            );
            expect(await numberToWord(ONE_HUNDRED_EIGHT)).toHaveLength(
                size(ONE_HUNDRED_EIGHT_AS_WORD)
            );
            expect(await numberToWord(ONE_THOUSAND)).toHaveLength(
                size(ONE_THOUSAND_AS_WORD)
            );
            expect(await numberToWord(ONE_THOUSAND_TWENTY_FOUR)).toHaveLength(
                size(ONE_THOUSAND_TWENTY_FOUR_AS_WORD)
            );
        });
    });
});
