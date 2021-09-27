import { NeDBCore } from '@card-games-api/database/nedb';

import { errorHandler } from '../../lib/helpers/error-handler';
import { setApiClusters } from '../../lib/helpers/startup/clusters';

import type { ValueOf } from '@card-games-api/utils';

import type { MockedClass } from '@card-games-api/utils/testing';

import type { MockedCluster, MockedErrorHandler } from '../types';

export type MockedDatabase = MockedClass<typeof NeDBCore>;
export const mockedDatabase: MockedDatabase = NeDBCore as MockedDatabase;

export const mockDisconnectError = (): ValueOf<MockedDatabase> =>
    mockedDatabase.disconnect.mockImplementation(
        async (): Promise<void> => Promise.reject('Error')
    );

export const mockedCluster: MockedCluster = setApiClusters as MockedCluster;
export const mockedErrorHandler: MockedErrorHandler =
    errorHandler as MockedErrorHandler;
