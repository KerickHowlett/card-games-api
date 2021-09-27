import {
    BASE_GAME_ROUTE,
    DEFAULT_TOTAL_DECKS,
    DEFAULT_TOTAL_PLAYERS
} from '@card-games-api/games';
import {
    GAME_ID_PARAM_PLACEHOLDER,
    getMockGameRoute
} from '@card-games-api/games/testing';
import { RestCallMethods } from '@card-games-api/utils';

const { GET, POST, PUT } = RestCallMethods;

export const totalDecks: number = DEFAULT_TOTAL_DECKS;
export const totalPlayers: number = DEFAULT_TOTAL_PLAYERS;

export const mockGetRoute: string = getMockGameRoute(
    GET,
    GAME_ID_PARAM_PLACEHOLDER,
    undefined,
    undefined,
    BASE_GAME_ROUTE
);
export const mockPostRoute: string = getMockGameRoute(
    POST,
    GAME_ID_PARAM_PLACEHOLDER,
    undefined,
    undefined,
    BASE_GAME_ROUTE
);
export const mockPutRoute: string = getMockGameRoute(
    PUT,
    undefined,
    totalDecks,
    totalPlayers,
    BASE_GAME_ROUTE
);
