import { INeDBCore, NeDBCore } from '../../../lib/nedb/core';
import { disconnectNeDB } from '../utils';

export const teardownNeDBCoreTests = async (
    database: INeDBCore = NeDBCore
): Promise<void> => {
    await disconnectNeDB(database);
};
