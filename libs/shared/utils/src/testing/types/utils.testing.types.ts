/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Server } from 'http';

import type { Application, Request, Response, NextFunction } from 'express';
import type { HTTPError } from 'http-errors';

export type MockArgOne = Request | HTTPError;
export type MockArgTwo = Response | Request;
export type MockArgThree = NextFunction | Response;
export type MockMiddleware = (
    arg1: MockArgOne,
    arg2: MockArgTwo,
    arg3: MockArgThree,
    arg4?: NextFunction
) => void;

export type JestSpy = jest.SpyInstance;

export type MockCallback = jest.Mock<any, any>;

export type MockedClass<T> = jest.Mocked<T>;

export type AnyMockedFunction = jest.MockedFunction<any>;

export interface SetupMockServer {
    app: Application;
    server: Server;
    closeSpy: JestSpy;
    onSpy: JestSpy;
    listenSpy: JestSpy;
}
