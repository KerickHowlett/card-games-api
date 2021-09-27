import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import StatusCodes from 'http-status-codes';

const { NOT_FOUND } = StatusCodes;

export const generate404Message = (url: string): string =>
    `There's nothing here at "${url}."`;

export async function routeNotFound(
    request: Request,
    _response: Response,
    next: NextFunction
): Promise<void> {
    next(createError(NOT_FOUND, generate404Message(request.url)));
}
