import { resolve } from 'path';

import { minutesToMilliseconds } from 'date-fns';

import { convertToBoolean, loadEnvironment } from './helpers';

loadEnvironment();

export const ADDRESS = process.env.NX_DOMAIN || 'localhost';
export const HOST = process.env.NX_HOST || '0.0.0.0';
export const PORT = Number(process.env.NX_PORT || 3000);
export const ENVIRONMENT = process.env.NX_ENV || 'development';
export const MILLISECONDS_UNTIL_SYSTEM_TIMEOUT = Number(
    process.env.NX_MILLISECONDS_UNTIL_SYSTEM_TIMEOUT || 5000
);

export const IS_DEVELOPMENT: boolean = ENVIRONMENT === 'development';
export const IS_TEST: boolean = ENVIRONMENT === 'test';
export const IS_PRODUCTION: boolean = ENVIRONMENT === 'production';

export const LOGGER_LEVEL: string = process.env.NX_LOGGER_LEVEL || 'info';
export const LOGGER_TIMESTAMP: boolean =
    convertToBoolean(process.env.NX_LOGGER_TIMESTAMP) || true;

export const CLUSTER_API =
    convertToBoolean(process.env.NX_CLUSTER_API) || false;

export const COMPACTION_INTERVALS_IN_MILLISECONDS: number =
    minutesToMilliseconds(
        Number(process.env.NX_COMPACTION_INTERVALS_IN_MINUTES) ?? 1
    );

export const DATABASE_SOURCE: string =
    resolve(__dirname, `./${process.env.NX_DATABASE_SOURCE}`) || ':memory:';

export const RATE_LIMIT_MAX_HITS = Number(process.env.NX_LIMIT_MAX_HITS || 100);
export const RATE_LIMIT_WINDOW_IN_MILLISECONDS = minutesToMilliseconds(
    Number(process.env.NX_LIMIT_WINDOW_IN_MINUTES || 15)
);

export const RATE_LIMIT_SKIP_FAILURES: boolean =
    convertToBoolean(process.env.NX_RATE_LIMIT_SKIP_FAILURES) || true;
