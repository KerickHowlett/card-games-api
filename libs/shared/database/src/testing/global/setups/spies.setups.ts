import { INeDBCore, NeDBCore } from '../../../lib/nedb/core';
import { INodeCacheCore, NodeCacheCore } from '../../../lib/node-cache/core';
import { SetupDatabaseSpies } from '../../types';

/* eslint-disable prefer-const */
import type { JestSpy } from '@card-games-api/utils/testing';

export const setupDatabaseSpies = (
    cache: INodeCacheCore = NodeCacheCore,
    database: INeDBCore = NeDBCore
): SetupDatabaseSpies => {
    jest.restoreAllMocks();

    let cacheGetSpy: JestSpy;
    let cacheSetSpy: JestSpy;

    let getDataSpy: JestSpy;
    let insertDataSpy: JestSpy;
    let updateDataSpy: JestSpy;

    cacheGetSpy = jest.spyOn(cache, 'get');
    cacheSetSpy = jest.spyOn(cache, 'set');

    getDataSpy = jest.spyOn(database, 'getOne');
    insertDataSpy = jest.spyOn(database, 'insert');
    updateDataSpy = jest.spyOn(database, 'update');

    return {
        cacheGetSpy,
        cacheSetSpy,
        getDataSpy,
        insertDataSpy,
        updateDataSpy
    };
};

export const setupDatabaseAndCacheStub = (
    cache: INodeCacheCore = NodeCacheCore,
    database: INeDBCore = NeDBCore
): void => {
    jest.spyOn(cache, 'connect').mockImplementation();
    jest.spyOn(database, 'connect').mockImplementation();

    jest.spyOn(cache, 'disconnect').mockImplementation();
    jest.spyOn(database, 'disconnect').mockImplementation();

    jest.spyOn(database, 'setIndex').mockImplementation();
};
