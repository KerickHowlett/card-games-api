import { BattleLog } from '@card-games-api/battle-logs';
import { Aftermath, IBattleServices } from '@card-games-api/battles';
import logger from '@card-games-api/logger';
import { Player } from '@card-games-api/players';
import { StatusCodes } from 'http-status-codes';
import { isNil as isNullOrUndefined } from 'lodash';

import { isGameOver, isNewGameSaved } from '../../helpers';
import { Game } from '../../models';
import { IDatabaseServices } from '../../services';
import { GameData, GameScore, NewGameResponse } from '../../types';

import type { Response } from 'express';
const { NOT_FOUND: GAME_NOT_FOUND, INTERNAL_SERVER_ERROR, OK } = StatusCodes;

export class GameControllers {
    constructor(
        private readonly battle: IBattleServices,
        private readonly database: IDatabaseServices
    ) {}

    public async play({ params }, response: Response): Promise<void> {
        const gameData: GameData = await this.database.getGame(params.gameId);

        if (isNullOrUndefined(gameData)) {
            response.sendStatus(GAME_NOT_FOUND);
            return;
        }

        const game: Game = new Game(gameData);

        if (isGameOver(game.getStatus())) {
            const gameStatus: GameScore = await game.getScore();
            response.status(OK).send(gameStatus);
            return;
        }

        const players: Player[] = game.getPlayers();
        const aftermath: Aftermath = this.battle.play(players);

        game.updatePlayers(aftermath.updatedPlayers)
            .addToLogs(aftermath)
            .switchStatus();

        const isUpdateSuccessful: boolean = await this.database.updateGame(
            game
        );
        if (!isUpdateSuccessful) {
            response.sendStatus(INTERNAL_SERVER_ERROR);
            return;
        }

        const latestLog: BattleLog = await game.getLatestLog();
        response.status(OK).send(latestLog);
    }

    public async getGameScore({ params }, response: Response): Promise<void> {
        const gameData: GameData = await this.database.getGame(params.gameId);

        if (isNullOrUndefined(gameData)) {
            response.sendStatus(GAME_NOT_FOUND);
            return;
        }

        const game: Game = new Game(gameData);
        const gameScore: GameScore = game.getScore();

        response.status(OK).send(gameScore);
    }

    public async startNewGame({ query }, response: Response): Promise<void> {
        const newGame: Game = new Game(query);
        const payloadWithGameId: NewGameResponse =
            await this.database.addNewGame(newGame);
        if (!isNewGameSaved(payloadWithGameId)) {
            response.sendStatus(INTERNAL_SERVER_ERROR);
            return;
        }

        logger.info(payloadWithGameId);

        response.status(OK).send(payloadWithGameId);
    }
}
