import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import { DATABASE_SOURCE } from '@card-games-api/environment';
import logger from '@card-games-api/logger';
import { isMaster as isPrimaryCluster } from 'cluster';
import { createServer, Server } from 'http';

import {
    DATABASE_ESTABLISHED_MESSAGE,
    INITIATE_API_MESSAGE,
    INITIATE_DATABASE_MESSAGE
} from '../../../constants';

import type { Application } from 'express';

const fireOfLogger = (message: string): void => {
    if (isPrimaryCluster) logger.info(message);
};

export async function startupServer(app: Application): Promise<Server> {
    fireOfLogger(INITIATE_DATABASE_MESSAGE);

    await cache.connect();
    await database.connect(DATABASE_SOURCE);
    await database.setIndex();

    fireOfLogger(DATABASE_ESTABLISHED_MESSAGE);
    fireOfLogger(INITIATE_API_MESSAGE);

    return createServer(app);
}
