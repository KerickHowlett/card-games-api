import {
    expectedStatusMessage,
    mock404ErrorUrl,
    setupErrorMiddlewareTest
} from '@card-games-api/utils/testing';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { routeNotFound as subject } from './route-not-found.middleware';

import type { Application } from 'express';
import type { HTTPError } from 'http-errors';
const { NOT_FOUND } = StatusCodes;

let app: Application;

describe('routeNotFound', () => {
    beforeEach(() => (app = setupErrorMiddlewareTest(subject)));

    it('should process the route successfully with the route param', async () => {
        const {
            ok,
            error: { status, message }
        } = (await request(app).get(mock404ErrorUrl).send()) as HTTPError;

        expect(ok).toBe(false);

        expect(status).toBe(NOT_FOUND);
        expect(message).toBe(expectedStatusMessage(NOT_FOUND, mock404ErrorUrl));
    });
});
