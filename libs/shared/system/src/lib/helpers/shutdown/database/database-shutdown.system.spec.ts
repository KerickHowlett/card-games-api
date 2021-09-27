import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import logger from '@card-games-api/logger';

import { mockDisconnectError } from '../../../../testing/utils';
import { DATABASE_ATTEMPTING_SHUTDOWN_MESSAGE } from '../../../constants';
import { databaseShutdown } from './database-shutdown.system';

describe('databaseShutdown', () => {
    it('should disconnect from database gracefully', async () => {
        await expect(databaseShutdown()).resolves.not.toThrow();

        expect(cache.disconnect).toHaveBeenCalledTimes(1);
        expect(database.disconnect).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith(
            DATABASE_ATTEMPTING_SHUTDOWN_MESSAGE
        );
    });

    it('should log errors', async () => {
        mockDisconnectError();
        await databaseShutdown();

        expect(logger.fatal).toHaveBeenCalledTimes(2);
    });
});
