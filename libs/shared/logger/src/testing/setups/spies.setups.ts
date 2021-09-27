import { Logger, logger as loggerToSpy } from '../../lib/logger';

import type { JestSpy } from '@card-games-api/utils/testing';

export const setupLoggerSpies = (logger: Logger = loggerToSpy): JestSpy[] => {
    const debugSpy: JestSpy = jest.spyOn(logger, 'debug').mockImplementation();
    const errorSpy: JestSpy = jest.spyOn(logger, 'error').mockImplementation();
    const fatalSpy: JestSpy = jest.spyOn(logger, 'fatal').mockImplementation();
    const infoSpy: JestSpy = jest.spyOn(logger, 'info').mockImplementation();
    const warnSpy: JestSpy = jest.spyOn(logger, 'warn').mockImplementation();
    return [debugSpy, errorSpy, fatalSpy, infoSpy, warnSpy];
};
