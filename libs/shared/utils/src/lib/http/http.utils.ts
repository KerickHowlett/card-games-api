import type { HTTPError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { eq } from 'lodash';

import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { RestCallMethod, RestCallMethods } from '../types';

const { INTERNAL_SERVER_ERROR } = StatusCodes;

const { GET, POST, PUT } = RestCallMethods;

export const getErrorResponse = (
    error?: HTTPError,
    isProduction = false
): HTTPError => {
    if (isProduction) {
        return {
            status: INTERNAL_SERVER_ERROR,
            message: DEFAULT_ERROR_MESSAGE
        };
    }

    return {
        status: error?.status ?? INTERNAL_SERVER_ERROR,
        message: error?.message ?? DEFAULT_ERROR_MESSAGE
    };
};

export const isGetCall = (method: RestCallMethod): method is RestCallMethod =>
    eq(method, GET);

export const isPostCall = (method: RestCallMethod): method is RestCallMethod =>
    eq(method, POST);

export const isPutCall = (method: RestCallMethod): method is RestCallMethod =>
    eq(method, PUT);
