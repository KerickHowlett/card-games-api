import {
    expectedStatusMessage,
    MOCK_ROOT_ROUTE,
    setupErrorMiddlewareTest
} from '@card-games-api/utils/testing';
import StatusCodes from 'http-status-codes';
import request from 'supertest';

import { catchAllPossibleErrors as subject } from './catch-all-possible-errors.middleware';

import type { Application } from 'express';
import type { HTTPError } from 'http-errors';
const { BAD_REQUEST } = StatusCodes;

let app: Application;

describe('catchAllPossibleErrors', () => {
    beforeEach(() => (app = setupErrorMiddlewareTest(subject)));

    it('should handle all possible errors', async () => {
        const {
            ok,
            error: { status, message }
        } = (await request(app).get(MOCK_ROOT_ROUTE).send()) as HTTPError;

        expect(ok).toBe(false);

        expect(status).toBe(BAD_REQUEST);
        expect(message).toBe(expectedStatusMessage(BAD_REQUEST));
    });
});
