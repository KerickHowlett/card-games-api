import pino, { Logger } from 'pino';

import { LoggerConfig } from './logger.config';

const logger: Logger = pino(LoggerConfig);

export { logger, Logger };
export default logger;
