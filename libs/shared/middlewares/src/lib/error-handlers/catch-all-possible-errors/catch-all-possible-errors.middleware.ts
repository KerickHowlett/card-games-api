import { IS_PRODUCTION as isProduction } from '@card-games-api/environment';
import { getErrorResponse } from '@card-games-api/utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import type { HTTPError } from 'http-errors';
import type { StatusCodes } from 'http-status-codes';

export async function catchAllPossibleErrors(
    error: HTTPError,
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> {
    const errorResponse: HTTPError = getErrorResponse(error, isProduction);
    response.status(errorResponse.status).json(errorResponse);
}
