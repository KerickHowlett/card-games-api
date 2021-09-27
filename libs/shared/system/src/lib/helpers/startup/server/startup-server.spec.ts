import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import logger from '@card-games-api/logger';
import { setupMockServer } from '@card-games-api/utils/testing';

import {
    DATABASE_ESTABLISHED_MESSAGE,
    INITIATE_API_MESSAGE,
    INITIATE_DATABASE_MESSAGE
} from '../../../constants';
import { startupServer } from './startup-server';

import type { Application } from 'express';

let app: Application;

describe('startupServer', () => {
    beforeEach(() => ({ app } = setupMockServer()));

    it('should activate API listener without crashing', async () => {
        expect(await startupServer(app)).toBeTruthy();

        expect(logger.info).toHaveBeenCalledWith(DATABASE_ESTABLISHED_MESSAGE);
        expect(logger.info).toHaveBeenCalledWith(INITIATE_API_MESSAGE);
        expect(logger.info).toHaveBeenCalledWith(INITIATE_DATABASE_MESSAGE);

        expect(database.connect).toHaveBeenCalledTimes(1);
        expect(database.setIndex).toHaveBeenCalledTimes(1);
        expect(cache.connect).toHaveBeenCalledTimes(1);
    });
});
