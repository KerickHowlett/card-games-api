import { hasProperty } from '@card-games-api/utils';

import { getDatastoreOptions, isPermenance } from './nedb.helpers';

import type { DataStoreOptions } from 'nedb';

describe('NeDB Helpers', () => {
    describe('getDatastoreOptions', () => {
        describe('when given filepath to database source as argument', () => {
            it('should return options object set for data permenance', async () => {
                const mockFilepath = 'test.db';

                const options: DataStoreOptions =
                    getDatastoreOptions(mockFilepath);

                expect(hasProperty(options, 'autoload')).toBe(true);
                expect(hasProperty(options, 'filename')).toBe(true);

                expect(options.filename).toEqual(mockFilepath);
                expect(options.inMemoryOnly).toBe(false);
            });
        });

        describe('when given NO FILEPATH to a database source as argument', () => {
            it('should return options object set for In-Memory storage', async () => {
                const options: DataStoreOptions = getDatastoreOptions();

                expect(hasProperty(options, 'autoload')).toBe(false);
                expect(hasProperty(options, 'filename')).toBe(false);

                expect(options.inMemoryOnly).toBe(true);
            });
        });

        describe('when given the argument of ":memory:"', () => {
            it('should return options object set for In-Memory storage', async () => {
                const options: DataStoreOptions =
                    getDatastoreOptions(':memory:');

                expect(hasProperty(options, 'autoload')).toBe(false);
                expect(hasProperty(options, 'filename')).toBe(false);

                expect(options.inMemoryOnly).toBe(true);
            });
        });
    });

    describe('isPermenance', () => {
        describe('returns the proper boolean value when', () => {
            it('receives the filepath to database source', async () => {
                expect(isPermenance('test.db')).toBe(true);
            });

            it('receives ":memory:" as an argument', async () => {
                expect(isPermenance(':memory:')).toBe(false);
            });

            it('receives NULL as an argument', async () => {
                expect(isPermenance(null)).toBe(false);
            });

            it('receives an undefined argument', async () => {
                expect(isPermenance(undefined)).toBe(false);
            });

            it('receives no argument', async () => {
                expect(isPermenance()).toBe(false);
            });
        });
    });
});
