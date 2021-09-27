import logger from '@card-games-api/logger';

import { ATTEMPT_GRACEFUL_SHUTDOWN_MESSAGE } from '../../../constants';
import { databaseShutdown } from '../database';
import { serverShutdown } from '../server';

import type { Server } from 'http';

let isCurrentlyShuttingDown = false;
export async function gracefulShutdown(server: Server): Promise<void> {
    if (isCurrentlyShuttingDown) return;
    isCurrentlyShuttingDown = true;

    logger.info(ATTEMPT_GRACEFUL_SHUTDOWN_MESSAGE);

    await serverShutdown(server);
    await databaseShutdown();

    setTimeout(() => process.exit(0), 20);
}
