import type { JestSpy } from '@card-games-api/utils/testing';

export interface SetupDatabaseSpies {
    cacheGetSpy: JestSpy;
    cacheSetSpy: JestSpy;
    getDataSpy: JestSpy;
    insertDataSpy: JestSpy;
    updateDataSpy: JestSpy;
}
