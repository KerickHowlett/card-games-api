import StatusCodes from 'http-status-codes';

import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { RestCallMethods } from '../types';
import {
    isGetCall,
    isPostCall,
    isPutCall,
    getErrorResponse
} from './http.utils';

const { INTERNAL_SERVER_ERROR } = StatusCodes;

const { GET, POST, PUT } = RestCallMethods;

describe('HTTP Utilities', () => {
    describe('getErrorResponse', () => {
        it('should return default error response if in production environment', async () => {
            const { status, message } = getErrorResponse(
                {
                    message: DEFAULT_ERROR_MESSAGE,
                    status: INTERNAL_SERVER_ERROR
                },
                true
            );
            expect(status).toEqual(INTERNAL_SERVER_ERROR);
            expect(message).toEqual(DEFAULT_ERROR_MESSAGE);
        });

        it("should return default error response if NOT in production but there's no error response", async () => {
            const { status, message } = getErrorResponse({});
            expect(status).toEqual(INTERNAL_SERVER_ERROR);
            expect(message).toEqual(DEFAULT_ERROR_MESSAGE);
        });

        it('should return entered error response', async () => {
            const { status, message } = getErrorResponse({
                message: DEFAULT_ERROR_MESSAGE,
                status: INTERNAL_SERVER_ERROR
            });
            expect(status).toEqual(INTERNAL_SERVER_ERROR);
            expect(message).toEqual(DEFAULT_ERROR_MESSAGE);
        });
    });

    describe('RestCallMethod Checkers', () => {
        describe('should validate that the method is the required REST call method', () => {
            it('isGetCall', async () => {
                expect(await isGetCall(GET)).toBe(true);
                expect(await isGetCall(POST)).toBe(false);
                expect(await isGetCall(PUT)).toBe(false);
            });

            it('isPostCall', async () => {
                expect(await isPostCall(GET)).toBe(false);
                expect(await isPostCall(POST)).toBe(true);
                expect(await isPostCall(PUT)).toBe(false);
            });

            it('isPutCall', async () => {
                expect(await isPutCall(GET)).toBe(false);
                expect(await isPutCall(POST)).toBe(false);
                expect(await isPutCall(PUT)).toBe(true);
            });
        });
    });
});
