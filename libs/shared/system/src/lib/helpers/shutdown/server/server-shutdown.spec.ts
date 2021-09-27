import logger from '@card-games-api/logger';
import { JestSpy, setupMockServer } from '@card-games-api/utils/testing';

import { serverShutdown } from './server-shutdown';

import type { Server } from 'http';

let closeSpy: JestSpy;
let server: Server;

describe('serverShutdown', () => {
    beforeEach(() => ({ closeSpy, server } = setupMockServer()));

    it('should shutdown system gracefully WITHOUT timeout', async () => {
        expect(await serverShutdown(server)).toBeTruthy();

        expect(closeSpy).toHaveBeenCalledTimes(1);

        expect(logger.warn).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledTimes(2);

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    it('should give timeout warning AFTER timeout', async () => {
        closeSpy.mockImplementation();

        expect(serverShutdown(server)).toBeTruthy();

        jest.runAllTimers();

        expect(closeSpy).toHaveBeenCalledTimes(1);

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).not.toHaveBeenCalled();

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.warn).toHaveBeenCalledTimes(1);
    });
});
