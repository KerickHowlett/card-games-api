import { onlyOnePlayer, TWO_PLAYERS } from '@card-games-api/players';
import {
    hasProperty,
    isInstanceOf,
    isObjectOf,
    isZero,
    WholeOrPartial
} from '@card-games-api/utils';
import {
    eq,
    isArray,
    isBoolean,
    isEmpty,
    isNaN,
    isNil as isNullOrUndefined,
    isNumber,
    isUndefined
} from 'lodash';

import { MIN_DECKS, MIN_PLAYERS } from '../../constants';
import { Game } from '../../models/game';
import {
    GameData,
    GameStatus,
    GameStatuses,
    NewGameResponse,
    QueryParamsReturn,
    RequestedPlayers
} from '../../types';

const { GAME_JUST_STARTED, GAME_OVER, IN_PROGRESS } = GameStatuses;

export const clampParam = (param: number, defaultValue: number): number =>
    isNullOrUndefined(param) || isNaN(param) || isZero(param)
        ? defaultValue
        : param;

export const handleQueryParams = (
    queriedPlayers?: RequestedPlayers,
    queriedDecks?: number
): QueryParamsReturn => {
    if (isNumber(queriedPlayers)) {
        return {
            totalDecks: clampParam(queriedDecks, MIN_DECKS),
            totalPlayers: clampParam(queriedPlayers, MIN_PLAYERS)
        };
    }

    const { decks, players } = queriedPlayers || {};

    return {
        totalDecks: clampParam(+decks, MIN_DECKS),
        totalPlayers: clampParam(+players, MIN_PLAYERS)
    };
};

export const hasJustStarted = (status: GameStatus): status is GameStatus =>
    eq(status, GAME_JUST_STARTED);

export const isGame = (object: unknown): object is Game =>
    isInstanceOf<typeof Game>(object, Game);

export const isGameData = (object: unknown): object is GameData =>
    isObjectOf<GameData>(object, ['players', 'status']);

export const isGameOver = (
    status: GameStatus,
    totalActivePlayers = TWO_PLAYERS
): status is GameStatus =>
    eq(status, GAME_OVER) ? true : onlyOnePlayer(totalActivePlayers);

export const isInProgress = (status: GameStatus): status is GameStatus =>
    eq(status, IN_PROGRESS);

export const isNewGameSaved = (
    response: WholeOrPartial<NewGameResponse> | boolean
): boolean => (isBoolean(response) ? response : hasProperty(response, 'id'));

export const toJsonFilter = (value: unknown): boolean =>
    isUndefined(value) || (isArray(value) && isEmpty(value));
