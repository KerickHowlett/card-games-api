import logger from '@card-games-api/logger';
import { isMaster as isPrimaryCluster } from 'cluster';

import {
    confirmationMessage,
    errorHandler,
    gracefulShutdown,
    setApiClusters,
    startupServer
} from '../helpers';

// !Important: isMaster will need to be changed to isPrimary when or if Node is upgraded to v16.0.0+.
import type { Server } from 'http';
import type { AddressInfo } from 'net';

import type { Application } from 'express';

let server: Server;

export async function initateServer(app: Application): Promise<void> {
    try {
        server = await startupServer(app);
        server = await setApiClusters(server);

        server.on('listening', async () => {
            if (isPrimaryCluster) {
                const { address, port } = server.address() as AddressInfo;

                logger.info(confirmationMessage(address, port));
            }
        });
    } catch (error) {
        errorHandler(error);
    }
}

process.on('SIGINT', () => gracefulShutdown(server));
process.on('SIGTERM', () => gracefulShutdown(server));

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
