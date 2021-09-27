import { hasDefinedString, isPrimitive } from './primitives.utils';

describe('Primitive Utils Utils', () => {
    describe('hasDefinedString', () => {
        it("should return a boolean dependent on if it's a string with actual value", async () => {
            expect(await hasDefinedString('test')).toBe(true);
            expect(await hasDefinedString('')).toBe(false);
            expect(await hasDefinedString(null)).toBe(false);
            expect(await hasDefinedString(undefined)).toBe(false);
        });
    });

    describe('isPrimitive', () => {
        describe("should return a boolean based on it's argument of", () => {
            it('empty string', async () => {
                expect(await isPrimitive('')).toBe(true);
            });

            it('non-empty string', async () => {
                expect(await isPrimitive('test')).toBe(true);
            });

            it('null', async () => {
                expect(await isPrimitive(null)).toBe(false);
            });

            it('undefined', async () => {
                expect(await isPrimitive(undefined)).toBe(false);
            });

            it('array', async () => {
                expect(await isPrimitive(['test'])).toBe(false);
            });

            it('object', async () => {
                expect(await isPrimitive({ test: 'test' })).toBe(false);
            });

            it('number', async () => {
                expect(await isPrimitive(10)).toBe(true);
            });
        });
    });
});
