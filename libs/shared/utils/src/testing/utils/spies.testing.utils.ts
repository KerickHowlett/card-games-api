import cluster from 'cluster';

import { AnyMockedFunction } from '../types';

export const setFakeTimers = (): void => {
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
};

export const stubProcessEvents = (): void => {
    jest.spyOn(process, 'on').mockImplementation();
    jest.spyOn(process, 'exit').mockImplementation();
    jest.spyOn(process, 'nextTick').mockImplementation();
};

export const getIsMasterSpy: AnyMockedFunction = jest.fn().mockImplementation();
export const getIsWorkerSpy: AnyMockedFunction = jest.fn().mockImplementation();
export const setClusterSpies = (
    master: AnyMockedFunction = getIsMasterSpy,
    worker: AnyMockedFunction = getIsWorkerSpy
): void => {
    Object.defineProperty(cluster, 'isMaster', { get: master });
    Object.defineProperty(cluster, 'isWorker', { get: worker });
};
