import { BASE_GAME_ROUTE, gameRoutes } from '@card-games-api/games';
import PromiseRouter from 'express-promise-router';

import type { Router } from 'express';
const appRoutes: Router = PromiseRouter();
appRoutes.use(BASE_GAME_ROUTE, gameRoutes);

export default appRoutes;
