import { MILLISECONDS_UNTIL_SYSTEM_TIMEOUT } from '@card-games-api/environment';
import logger from '@card-games-api/logger';

import {
    GRACEFUL_SHUTDOWN_MESSAGE,
    SERVER_CLOSE_ATTEMPT,
    TIMEOUT_WARNING_MESSAGE
} from '../../../constants';

import type { Server } from 'http';

export async function serverShutdown(server: Server): Promise<Server> {
    logger.info(SERVER_CLOSE_ATTEMPT);

    return await new Promise<Server>((resolve) => {
        const timeoutHandler = setTimeout((): void => {
            logger.warn(TIMEOUT_WARNING_MESSAGE);
            resolve(server);
        }, MILLISECONDS_UNTIL_SYSTEM_TIMEOUT);

        server.close(() => {
            clearTimeout(timeoutHandler);
            logger.info(GRACEFUL_SHUTDOWN_MESSAGE);
            resolve(server);
        });
    });
}
