import { AnyObject, hasProperty } from '@card-games-api/utils';
import {
    TestObject,
    testObjectArray,
    testObjectOne,
    testObjectWithId
} from '@card-games-api/utils/testing';
import { size } from 'lodash';

import { NeDBResponse } from '../models/response';
import { NeDBCore as subject } from './nedb.core';

describe('NeDBCore', () => {
    it('should create NeDB Datastore without crashing', async () => {
        expect(subject).toBeTruthy();
    });

    describe('Core CRUD Operators', () => {
        it('setIndex should not throw an error when it runs', async () => {
            expect(() => subject.setIndex).not.toThrow();
        });

        jest.retryTimes(1);
        it('should clear database', async () => {
            await subject.insert<TestObject[]>(testObjectArray);
            const { totalRecordsRemoved } = await subject.clear();

            expect(totalRecordsRemoved).toEqual(size(testObjectArray));
        });

        it('should insert and retrieve just one document', async () => {
            const { _id } = await subject.insert<TestObject>(testObjectWithId);
            const { test } = await subject.getOne<TestObject>({ _id });

            expect(test).toEqual(testObjectWithId.test);
        });

        it('should remove document successfully', async () => {
            const { _id } = await subject.insert<TestObject>(testObjectOne);

            let fetchData: TestObject = await subject.getOne<TestObject>({
                _id
            });
            expect(fetchData.test).toEqual(testObjectOne.test);

            await subject.remove({ _id });

            fetchData = await subject.getOne<TestObject>({ _id });
            expect(fetchData).toBeNull();
        });

        it('should update record successfully', async () => {
            const { _id } = await subject.insert<TestObject>(testObjectOne);
            let fetchData: TestObject = await subject.getOne<TestObject>({
                _id
            });

            expect(fetchData.test).toEqual(testObjectOne.test);

            const mockUpdate: AnyObject = { $addToSet: { update: 'update' } };
            const updateResponse: NeDBResponse =
                await subject.update<TestObject>({ _id }, mockUpdate);

            expect(updateResponse.totalRecordsUpdated).toEqual(1);

            fetchData = await subject.getOne<TestObject>({ _id });

            expect(fetchData._id).toEqual(_id);

            expect(hasProperty(fetchData, 'test')).toBe(true);
            expect(hasProperty(fetchData, 'update')).toBe(true);
        });
    });
});
