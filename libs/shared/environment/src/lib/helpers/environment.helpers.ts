import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import createError from 'http-errors';
import StatusCodes from 'http-status-codes';
import { eq } from 'lodash';

import EnvConfigOptions from '../config';

const { INTERNAL_SERVER_ERROR } = StatusCodes;

export const convertToBoolean = (envVariable: string): boolean | void => {
    const variable: string = envVariable?.toLowerCase();
    if (isTrue(variable)) return true;
    if (isFalse(variable)) return false;
    return;
};

export const loadEnvironment = (): void => {
    const { parsed, error } = config(EnvConfigOptions);
    if (error) {
        throw createError(INTERNAL_SERVER_ERROR, error);
    }
    dotenvExpand(parsed);
};

export const isFalse = (variable: string): boolean =>
    eq(variable, 'false') || eq(variable, '0');

export const isTrue = (variable: string): boolean =>
    eq(variable, 'true') || eq(variable, '1');
