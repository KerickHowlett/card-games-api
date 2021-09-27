import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import logger from '@card-games-api/logger';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import {
    CONNECT_CLOSED_MESSAGE,
    DATABASE_ATTEMPTING_SHUTDOWN_MESSAGE,
    DATABASE_SHUTDOWN_ERROR_MESSAGE
} from '../../../constants';

const { INTERNAL_SERVER_ERROR } = StatusCodes;

export async function databaseShutdown(): Promise<void> {
    logger.info(DATABASE_ATTEMPTING_SHUTDOWN_MESSAGE);

    try {
        await cache.disconnect();
        await database.disconnect();

        logger.info(CONNECT_CLOSED_MESSAGE);
    } catch (error) {
        logger.fatal(DATABASE_SHUTDOWN_ERROR_MESSAGE);
        logger.fatal(createError(INTERNAL_SERVER_ERROR, error));
    }
}
