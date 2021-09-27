import logger from '@card-games-api/logger';

import { FAILED_TO_START_ERROR_MESSAGE } from '../../constants';

export function errorHandler(error: unknown): void {
    logger.fatal(FAILED_TO_START_ERROR_MESSAGE);
    logger.fatal(JSON.stringify(error));
    process.nextTick(() => process.exit(1));
}
