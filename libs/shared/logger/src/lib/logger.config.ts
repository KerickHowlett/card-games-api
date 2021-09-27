import { LOGGER_LEVEL, LOGGER_TIMESTAMP } from '@card-games-api/environment';

import type { LoggerOptions } from 'pino';

const LoggerConfig: LoggerOptions = {
    level: LOGGER_LEVEL,
    prettyPrint: true,
    timestamp: LOGGER_TIMESTAMP
};

export { LoggerConfig };
