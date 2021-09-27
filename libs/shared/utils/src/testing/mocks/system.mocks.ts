/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyMockedFunction } from '../types';

export const totalMockCPUs: string[] = ['cpu-1', 'cpu-2'];
export const getOSMocks = (
    totalCpus: string[] = totalMockCPUs
): AnyMockedFunction =>
    jest.mock('os', () => ({
        ...jest.requireActual('os'),
        cpus: jest.fn().mockImplementation(() => totalCpus)
    }));

export const clusterOnSpy: AnyMockedFunction = jest.fn().mockImplementation();
export const clusterForkSpy: AnyMockedFunction = jest.fn().mockImplementation();
export const getClusterStubs = (): AnyMockedFunction =>
    jest.mock(
        'cluster',
        (): AnyMockedFunction => ({
            ...jest.requireActual('cluster'),
            on: clusterOnSpy,
            fork: clusterForkSpy
        })
    );
