import { chain, eq, gt, lt, memoize, multiply, startCase } from 'lodash';
import { toWords as numberToWords } from 'number-to-words';

export const anyRemaining = (number: number): boolean => gt(number, 0);

export const divideDown = (number = 0, divideBy = 0): number => {
    if (isZero(number) || isZero(divideBy)) return 0;
    return chain(number).divide(divideBy).floor().value();
};

export const divideUp = (number = 0, divideBy = 0): number => {
    if (isZero(number) || isZero(divideBy)) return 0;
    return chain(number).divide(divideBy).ceil().value();
};

export const isNegative = (number: number): boolean => lt(number, 0);

export const isZero = (number: number): boolean => eq(number, 0);

export const remainderOf = (
    divideThisValue: number,
    byThisValue: number
): number => {
    return divideThisValue % byThisValue;
};

export const makeNegative = (number: number) => multiply(Math.abs(number), -1);

export const numberToWord = memoize((numberForName: number): string =>
    startCase(numberToWords(numberForName)).trim()
);
