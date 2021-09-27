import { NeDBResponse } from '@card-games-api/database/nedb';
import { deckCountToCardCount } from '@card-games-api/decks/testing';
import { PlayerDeckSet } from '@card-games-api/players/testing';
import {
    divideDown,
    hasDefinedString,
    isGetCall,
    isPostCall,
    isPutCall,
    RestCallMethod,
    RestCallMethods
} from '@card-games-api/utils';
import {
    chain,
    gt,
    isEmpty,
    isNil as isNullOrUndefined,
    isString,
    map
} from 'lodash';

import {
    BASE_GAME_ROUTE,
    DEFAULT_TOTAL_DECKS,
    DEFAULT_TOTAL_PLAYERS
} from '../../lib/constants';
import { Game } from '../../lib/models';
import { GameData, GameStatus, GameStatuses } from '../../lib/types';
import { GAME_ID_PARAM_PLACEHOLDER } from '../mocks';
import { setupMockGame } from '../setups';
import { GameTestParamSet } from '../types';

const { IN_PROGRESS } = GameStatuses;

const { GET, POST, PUT } = RestCallMethods;

export const ifRouteRequiresGameId = (callMethod: RestCallMethod): boolean =>
    isGetCall(callMethod) || isPostCall(callMethod);

export const getMockGameRoute = (
    callMethod: RestCallMethod,
    gameId?: string,
    totalDecks?: number,
    totalPlayers?: number,
    baseRoute?: string
): string => {
    const rootRoute: string = hasDefinedString(baseRoute)
        ? baseRoute
        : BASE_GAME_ROUTE;
    if (isPutCall(callMethod)) {
        return `${getMockGameRouteBase(rootRoute)}${getUrlParamString(
            totalDecks,
            totalPlayers
        )}`;
    }
    if (isGetCall(callMethod)) {
        return getMockGameRouteBase(rootRoute, gameId);
    }
    if (isPostCall(callMethod)) {
        return `${getMockGameRouteBase(rootRoute, gameId)}/play`;
    }
    return rootRoute;
};

export const getMockGameRouteBase = (
    baseRoute: string = BASE_GAME_ROUTE,
    gameId?: string
): string => (hasDefinedString(gameId) ? `${baseRoute}/${gameId}` : baseRoute);

export const getExpectedCardsPerPlayer = (
    totalPlayers: number,
    totalDecks: number
): number => {
    const cardCount: number = deckCountToCardCount(totalDecks);
    return divideDown(cardCount, totalPlayers);
};

export const getGameCardTotal = (game: Game): number =>
    chain(game.getPlayers()).map('deckSize').sum().value();

export const getGameDataCardTotal = (game: GameData): number =>
    chain(game.players).map('deckSize').sum().value();

export const getMockUpdateResponse = (
    gameData: GameData
): NeDBResponse<GameData> => ({
    affectedDocuments: gameData,
    totalRecordsUpdated: 1
});

export const getUrlParamString = (
    totalDecks: number,
    totalPlayers: number
): string => {
    let params: string[] = [];
    params = toParamQuery('decks', totalDecks, DEFAULT_TOTAL_DECKS, params);
    params = toParamQuery(
        'players',
        totalPlayers,
        DEFAULT_TOTAL_PLAYERS,
        params
    );
    return isEmpty(params) ? '' : `?${params.join('&')}`;
};

export const isParamDefined = (param: number, defaultValue: number): boolean =>
    !isNullOrUndefined(param) && gt(param, defaultValue);

export const setMockStatus = (
    game: Game = setupMockGame(),
    status: GameStatus = IN_PROGRESS
): Game => {
    const gameData: GameData = game.toJson();
    gameData.status = status;
    return new Game(gameData);
};

export const toParamQuery = (
    paramLabel: string,
    paramValue: number,
    defaultValue: number,
    params: string[]
): string[] => {
    if (isParamDefined(paramValue, defaultValue)) {
        params = [...params, `${paramLabel}=${paramValue}`];
    }
    return params;
};

export const getGameTestParamSets = (
    playerDeckSets: PlayerDeckSet[],
    gameIdPlaceholder: string = GAME_ID_PARAM_PLACEHOLDER,
    baseRoute: string = BASE_GAME_ROUTE
): GameTestParamSet[] => {
    const createMockGameTestRoutes = (
        set: PlayerDeckSet
    ): GameTestParamSet => ({
        ...set,
        mockGetRoute: getMockGameRoute(
            GET,
            gameIdPlaceholder,
            undefined,
            undefined,
            baseRoute
        ),
        mockPostRoute: getMockGameRoute(
            POST,
            gameIdPlaceholder,
            undefined,
            undefined,
            baseRoute
        ),
        mockPutRoute: getMockGameRoute(
            PUT,
            undefined,
            set.totalDecks,
            set.totalPlayers,
            baseRoute
        )
    });

    return map(playerDeckSets, createMockGameTestRoutes);
};

export const injectGameId = (
    route: string,
    gameId: string,
    placeholder: RegExp | string = GAME_ID_PARAM_PLACEHOLDER
): string => {
    const regexTarget: RegExp = isString(placeholder)
        ? new RegExp(placeholder)
        : placeholder;
    return route.replace(regexTarget, gameId);
};
