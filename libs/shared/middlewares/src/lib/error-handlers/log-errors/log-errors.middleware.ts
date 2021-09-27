import logger from '@card-games-api/logger';

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import type { HTTPError } from 'http-errors';

export async function errorLogger(
    error: HTTPError,
    _request: Request,
    _response: Response,
    next: NextFunction
): Promise<void> {
    logger.fatal(error);
    next(error);
}
