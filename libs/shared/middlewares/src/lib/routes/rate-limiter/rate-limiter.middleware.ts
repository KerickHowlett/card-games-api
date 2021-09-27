import {
    RATE_LIMIT_MAX_HITS as MAX_HITS,
    RATE_LIMIT_SKIP_FAILURES as SKIP_FAILURES,
    RATE_LIMIT_WINDOW_IN_MILLISECONDS as RATE_LIMIT_WINDOW
} from '@card-games-api/environment';
import { RATE_LIMIT_ERROR_MESSAGE as message } from '@card-games-api/utils';
import RateLimiter, { Message, Options, RateLimit } from 'express-rate-limit';
import StatusCodes from 'http-status-codes';

const { TOO_MANY_REQUESTS: status } = StatusCodes;

const ERROR_RESPONSE: Message = { status, message };
const WINDOW_IN_MS: number = RATE_LIMIT_WINDOW;

const rateLimitOptions: Options = {
    max: MAX_HITS,
    message: ERROR_RESPONSE,
    skipFailedRequests: SKIP_FAILURES,
    windowMs: WINDOW_IN_MS
};

const rateLimiter: RateLimit = RateLimiter(rateLimitOptions);

export { rateLimiter as RateLimiter };
