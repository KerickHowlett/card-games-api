import {
    JestSpy,
    mockErrorMessage,
    setupMockServer
} from '@card-games-api/utils/testing';

import { mockedCluster, mockedErrorHandler } from '../../testing';
import { initateServer } from './system.core';

import type { Server } from 'http';

import type { Application } from 'express';

jest.mock('../helpers/startup/clusters');
jest.mock('../helpers/error-handler');

let app: Application;
let server: Server;
let onSpy: JestSpy;

describe('System Core', () => {
    describe('initateServer', () => {
        beforeEach(() => ({ onSpy, server } = setupMockServer()));

        it('should initiate server without crashing', async () => {
            mockedCluster.mockResolvedValue(server);

            await expect(initateServer(app)).resolves.not.toThrow();

            expect(mockedCluster).toHaveBeenCalledTimes(1);
            expect(onSpy).toHaveBeenCalledTimes(1);
            expect(mockedErrorHandler).not.toHaveBeenCalled();
        });

        it('should handle any potential errors', async () => {
            mockedCluster.mockRejectedValue(mockErrorMessage);

            await expect(initateServer(app)).resolves.not.toThrow();

            expect(mockedCluster).toHaveBeenCalledTimes(1);
            expect(mockedErrorHandler).toHaveBeenCalledWith(mockErrorMessage);
        });
    });
});
