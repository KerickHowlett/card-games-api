import logger from '@card-games-api/logger';
import { mockErrorMessage } from '@card-games-api/utils/testing';

import { FAILED_TO_START_ERROR_MESSAGE } from '../../constants';
import { errorHandler } from './error-handler';

describe('errorHandler', () => {
    it('should log all uncaughtExceptions', async () => {
        await errorHandler(mockErrorMessage);

        expect(logger.fatal).toHaveBeenCalledTimes(2);
        expect(logger.fatal).toHaveBeenCalledWith(
            JSON.stringify(mockErrorMessage)
        );
        expect(logger.fatal).toHaveBeenCalledWith(
            FAILED_TO_START_ERROR_MESSAGE
        );
    });
});
