import type { NextFunction, Router } from 'express';
import PromiseRouter from 'express-promise-router';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import { DEFAULT_ERROR_MESSAGE } from '../../lib/constants';
import { MOCK_ROOT_ROUTE } from '../setups';

import 'express-async-errors';

const { BAD_REQUEST } = StatusCodes;

export const expectedStatusMessage = (
    status: number,
    route: string = MOCK_ROOT_ROUTE
): string => `cannot GET ${route} (${status})`;

export const expectedStatusPrintOut = (
    errorType = 'InternalServerError',
    message: string = mockErrorMessage
): string => `${errorType}: ${message}`;

export const mockErrorMessage = 'ERROR_TEST!';

export const mock404ErrorUrl = '/derp';

export const mockErrorRouteMiddleware = async (_, __, next: NextFunction) =>
    next(createError(BAD_REQUEST, DEFAULT_ERROR_MESSAGE));

export const getMockErrorRoute = (mockUrl: string = MOCK_ROOT_ROUTE): Router =>
    PromiseRouter().get(mockUrl, mockErrorRouteMiddleware);
