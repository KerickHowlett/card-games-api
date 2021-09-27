import {
    failObject,
    TestClass,
    testClass,
    TestInterface,
    testInterface as testObject,
    testSchemaReadonly
} from '../../testing';
import { hasProperty, isInstanceOf, isObjectOf } from './objects.utils';

describe('Object Utils', () => {
    describe('hasProperty', () => {
        it('should return a boolean dependent if object matches schema', async () => {
            expect(await hasProperty(testObject, 'test')).toBe(true);
            expect(await hasProperty(testObject, 'derp')).toBe(false);
        });
    });

    describe('isInstanceOf', () => {
        it("should return a boolean dependent on whether or not it's the desired instance", async () => {
            expect(
                await isInstanceOf<typeof TestClass>(testClass, TestClass)
            ).toBe(true);
            expect(
                await isInstanceOf<typeof TestClass>(failObject, TestClass)
            ).toBe(false);
        });
    });

    describe('isObjectOf', () => {
        it('should return a boolean dependent if object matches required schema', async () => {
            expect(
                await isObjectOf<TestInterface>(testObject, testSchemaReadonly)
            ).toBe(true);
            expect(
                await isObjectOf<TestInterface>(failObject, testSchemaReadonly)
            ).toBe(false);
        });
    });
});
