import { BattleLog } from '@card-games-api/battle-logs';
import {
    Dealer,
    enoughPlayers,
    isTwoPlayers,
    Player,
    PLAYER_ONE_NAME,
    PLAYER_TWO_NAME,
    tooManyPlayers
} from '@card-games-api/players';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { isUndefined, omitBy } from 'lodash';

import { PlayersAdapters } from '../../adapters/players';
import {
    MAX_PLAYERS,
    MIN_PLAYERS,
    NOT_ENOUGH_PLAYERS_MESSAGE,
    TOO_MANY_PLAYERS_MESSAGE
} from '../../constants';
import { handleQueryParams, isGameOver } from '../../helpers/games';
import {
    GameScore,
    GameStatus,
    GameStatuses,
    RequestedPlayers
} from '../../types';

import type { PossibleString, WholeOrPartial } from '@card-games-api/utils';

const { GAME_OVER, IN_PROGRESS } = GameStatuses;

const { METHOD_NOT_ALLOWED } = StatusCodes;

class GamesServices extends PlayersAdapters {
    public getScore(
        players: Player[],
        status: GameStatus,
        latestLog: BattleLog
    ): WholeOrPartial<GameScore> {
        const winner: PossibleString = this.getWinnerName(status, latestLog);

        if (isTwoPlayers(players)) {
            const findByName = (playerName: string): Player =>
                this.players.getOne(players, 'name', playerName);

            const { deckSize: playerOne } = findByName(PLAYER_ONE_NAME) || {};
            const { deckSize: playerTwo } = findByName(PLAYER_TWO_NAME) || {};

            return omitBy<GameScore>(
                {
                    status,
                    playerOne,
                    playerTwo,
                    winner
                },
                isUndefined
            );
        }

        return omitBy<GameScore>(
            {
                status,
                players: this.players.toJsonArray(players),
                winner
            },
            isUndefined
        );
    }

    public getWinnerName(
        status: GameStatus,
        latestLog: BattleLog
    ): PossibleString {
        return isGameOver(status) ? latestLog.winner : undefined;
    }

    public setup(
        requestedPlayers: RequestedPlayers,
        requestedDecks?: number
    ): Player[] {
        const { totalDecks, totalPlayers } = handleQueryParams(
            requestedPlayers,
            requestedDecks
        );

        if (!enoughPlayers(totalPlayers, MIN_PLAYERS)) {
            throw createError(METHOD_NOT_ALLOWED, NOT_ENOUGH_PLAYERS_MESSAGE);
        }

        if (tooManyPlayers(totalPlayers, MAX_PLAYERS)) {
            throw createError(METHOD_NOT_ALLOWED, TOO_MANY_PLAYERS_MESSAGE);
        }

        const newPlayers: Player[] = this.players.create(totalPlayers);
        const dealer: Dealer = new Dealer(totalDecks);

        return dealer.dealOutCards(newPlayers);
    }

    public switchStatus(
        currentStatus: GameStatus,
        totalActivePlayers: number
    ): GameStatus {
        return isGameOver(currentStatus, totalActivePlayers)
            ? GAME_OVER
            : IN_PROGRESS;
    }
}

export type IGamesServices = GamesServices & PlayersAdapters;

const service: IGamesServices = new GamesServices();

export { service as GamesServices };
