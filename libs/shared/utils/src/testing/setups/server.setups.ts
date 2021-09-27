import { createServer, Server } from 'http';

import express, { Application, Router } from 'express';
import PromiseRouter from 'express-promise-router';
import { isUndefined } from 'lodash';

import 'express-async-errors';
import { getMockErrorRoute } from '../mocks';
import { JestSpy, MockMiddleware, SetupMockServer } from '../types';

export const MOCK_ROOT_ROUTE = '/';

export const setupMockExpressApp = (
    router?: Router,
    middleware?: MockMiddleware | undefined,
    rootRoute: string = MOCK_ROOT_ROUTE
): Application => {
    const app: Application = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    if (!isUndefined(router)) {
        app.use(PromiseRouter());
        app.use(rootRoute, router);
    }

    if (!isUndefined(middleware)) {
        app.use(middleware);
    }

    return app;
};

export const OPEN_LISTENER = false;
export const CLOSE_LISTENER = true;
export const setupMockServer = (
    app: Application = setupMockExpressApp()
): SetupMockServer => {
    const server: Server = createServer(app);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const serverCallBack = (_: unknown, __?: () => void): Server => {
        return server;
    };

    const closeSpy: JestSpy = jest.spyOn(server, 'close');
    const onSpy: JestSpy = jest.spyOn(server, 'on');
    const listenSpy: JestSpy = jest
        .spyOn(server, 'listen')
        .mockImplementation(serverCallBack);

    return { app, closeSpy, onSpy, listenSpy, server };
};

export const setupErrorMiddlewareTest = (
    middleware: MockMiddleware,
    route: string = MOCK_ROOT_ROUTE
): Application => {
    const router: Router = getMockErrorRoute(route);
    return setupMockExpressApp(router, middleware);
};
