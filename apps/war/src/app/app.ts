import 'express-async-errors';

import {
    HOST,
    IS_DEVELOPMENT,
    IS_PRODUCTION,
    IS_TEST,
    PORT
} from '@card-games-api/environment';
import {
    catchAllPossibleErrors,
    errorLogger,
    RateLimiter,
    routeNotFound
} from '@card-games-api/middlewares';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import morgan from 'morgan';

import appRoutes from '../routes';

const app: Application = express();

app.set('host', HOST);
app.set('port', PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(compression());

/* istanbul ignore else*/
if (IS_DEVELOPMENT || IS_TEST) {
    app.use(cors());
    app.use(morgan('dev'));
}

/* istanbul ignore next */
if (IS_PRODUCTION) {
    app.use(helmet());
    app.use(RateLimiter);
}

app.use(Router());
app.use('/', appRoutes);

app.use(routeNotFound);
app.use(errorLogger);
app.use(catchAllPossibleErrors);

export default app;
