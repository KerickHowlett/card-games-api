import { isObjectOf } from '../../lib/objects';
import { TestObject } from '../mocks';

export const isTestObject = (object: unknown): object is TestObject =>
    isObjectOf<TestObject>(object, ['test']);
