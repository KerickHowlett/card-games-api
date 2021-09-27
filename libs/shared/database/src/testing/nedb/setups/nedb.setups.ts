import { INeDBCore, NeDBCore } from '../../../lib/nedb/core';
import { clearNeDB, connectNeDB } from '../utils';

export const setupNeDBTests = async (
    database: INeDBCore = NeDBCore
): Promise<void> => {
    await connectNeDB(database);
};

export const setupCleanDatabase = async (
    database: INeDBCore = NeDBCore
): Promise<void> => {
    await clearNeDB(database);
};
