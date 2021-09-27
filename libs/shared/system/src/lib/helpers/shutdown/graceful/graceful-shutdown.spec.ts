import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import logger from '@card-games-api/logger';
import { setupMockServer } from '@card-games-api/utils/testing';

import { ATTEMPT_GRACEFUL_SHUTDOWN_MESSAGE } from '../../../constants';
import { gracefulShutdown } from './graceful-shutdown';

import type { Server } from 'http';

describe('gracefulShutdown', () => {
    let server: Server;

    beforeEach(() => ({ server } = setupMockServer()));

    it('should shutdown API server & database/cache gracefully', async () => {
        await expect(gracefulShutdown(server)).resolves.not.toThrow();

        expect(logger.info).toHaveBeenCalledWith(
            ATTEMPT_GRACEFUL_SHUTDOWN_MESSAGE
        );
        expect(cache.disconnect).toHaveBeenCalledTimes(1);
        expect(database.disconnect).toHaveBeenCalledTimes(1);
    });
});
