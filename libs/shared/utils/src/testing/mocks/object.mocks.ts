import type { Primitive } from '../../lib/types';
export const objectKey = 'test';
export interface TestObject {
    test: Primitive;
    _id?: string;
    id?: string;
}
export const testObjectWithId: TestObject = { test: 'test', id: '1' };
export const testObjectOne: TestObject = { test: 1 };
export const testObjectTwo: TestObject = { test: 2 };
export const testObjectThree: TestObject = { test: 3 };
export const testObjectArray: TestObject[] = [
    testObjectOne,
    testObjectTwo,
    testObjectThree
];

export const classProp = 'TEST';
export class TestClass {
    public test: string = classProp;
}
export const testClass: TestClass = new TestClass();

export interface TestInterface {
    test: string;
    number: number;
}

export const testInterface: TestInterface = {
    test: 'test',
    number: 1
};
export const testSchema: string[] = ['test', 'number'];
export const testSchemaReadonly: ReadonlyArray<keyof TestInterface> =
    testSchema as Array<keyof TestInterface>;
