/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from 'lodash';
import DataStore from 'nedb';

import { INeDBCore, NeDBCore } from '../../../lib/nedb/core';

export const clearNeDB = async (core: INeDBCore = NeDBCore): Promise<void> => {
    if (isNeDBConnected(core)) {
        await core.clear();
    }
};

export const connectNeDB = async (
    core: INeDBCore = NeDBCore
): Promise<void> => {
    if (!isNeDBConnected(core)) {
        await core.connect(':memory:');
    }
};

export const disconnectNeDB = async (
    core: INeDBCore = NeDBCore
): Promise<void> => {
    if (isNeDBConnected(core)) {
        await core.disconnect();
    }
};

export const getNeDBStore = (core: INeDBCore = NeDBCore): DataStore =>
    (core as any).store;

export const isNeDBConnected = (core: INeDBCore = NeDBCore): boolean =>
    !isUndefined(getNeDBStore(core)?.persistence);
