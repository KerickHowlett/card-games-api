import { BattleServices } from '@card-games-api/battles';
import PromiseRouter from 'express-promise-router';

import { GameControllers } from '../controllers';
import { DatabaseServices } from '../services';

import type { Router } from 'express';
const controller: GameControllers = new GameControllers(
    BattleServices,
    DatabaseServices
);

const gameRoutes: Router = PromiseRouter();
gameRoutes
    .put('/', controller.startNewGame.bind(controller))
    .get('/:gameId', controller.getGameScore.bind(controller))
    .post('/:gameId/play', controller.play.bind(controller));

export { gameRoutes };
