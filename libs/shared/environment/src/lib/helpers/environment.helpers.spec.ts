import {
    convertToBoolean,
    loadEnvironment,
    isFalse,
    isTrue
} from './environment.helpers';

jest.spyOn(global.console, 'log').mockImplementation();

describe('Environment Helpers', () => {
    describe('convertToBoolean', () => {
        it('should return the proper boolean value based on input', async () => {
            expect(await convertToBoolean('true')).toBe(true);
            expect(await convertToBoolean('1')).toBe(true);
            expect(await convertToBoolean('false')).toBe(false);
            expect(await convertToBoolean('0')).toBe(false);
        });
    });

    describe('loadEnvironment', () => {
        it('should return the proper boolean value based on input', async () => {
            await expect(() => loadEnvironment()).not.toThrow();
        });
    });

    describe('isFalse', () => {
        it('should return the proper boolean value based on input', async () => {
            expect(await isFalse('true')).toBe(false);
            expect(await isFalse('1')).toBe(false);
            expect(await isFalse('false')).toBe(true);
            expect(await isFalse('0')).toBe(true);
        });
    });

    describe('isTrue', () => {
        it('should return the proper boolean value based on input', async () => {
            expect(await isTrue('true')).toBe(true);
            expect(await isTrue('1')).toBe(true);
            expect(await isTrue('false')).toBe(false);
            expect(await isTrue('0')).toBe(false);
        });
    });
});
