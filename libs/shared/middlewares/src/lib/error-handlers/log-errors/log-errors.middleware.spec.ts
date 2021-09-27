import logger from '@card-games-api/logger';
import { mockErrorMessage } from '@card-games-api/utils/testing';

import { errorLogger } from './log-errors.middleware';

import type { NextFunction } from 'express';

describe('errorLogger', () => {
    it('should log the error and then call on the next service in the chain', async () => {
        await errorLogger(
            mockErrorMessage,
            null,
            null,
            jest.fn() as NextFunction
        );
        expect(logger.fatal).toHaveBeenCalledTimes(1);
        expect(logger.fatal).toHaveBeenCalledWith(mockErrorMessage);
    });
});
