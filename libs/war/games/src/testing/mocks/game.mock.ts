import { MOCK_LOGS } from '@card-games-api/battle-logs/testing';
import { FindByID, NeDBResponse } from '@card-games-api/database/nedb';
import { PLAYER_ONE_NAME } from '@card-games-api/players';
import {
    PlayerDeckSet,
    setupAllPlayerDeckCombos,
    setupSomeEmptyPlayersData
} from '@card-games-api/players/testing';

import {
    BASE_GAME_ROUTE,
    MAX_DECKS,
    MAX_PLAYERS,
    MIN_DECKS,
    MIN_PLAYERS
} from '../../lib/constants';
import { GameData, GameStatuses } from '../../lib/types';
import { getGameTestParamSets } from '../utils';

import type { ParsedQs } from 'qs';

import type { GameTestParamSet } from '../types';
const { GAME_OVER } = GameStatuses;

export const MOCK_QUERY_PARAMS: ParsedQs = {
    players: '2',
    decks: '1'
} as ParsedQs;

export const GAME_ID_PARAM_PLACEHOLDER = ':gameId';

export const MOCK_DATE: string = new Date().toString();

export const MOCK_GAME_ID = 'test-id';

export const MOCK_COMPLETE_GAME: GameData = {
    id: MOCK_GAME_ID,
    players: setupSomeEmptyPlayersData(),
    status: GAME_OVER,
    logs: MOCK_LOGS,
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    winner: PLAYER_ONE_NAME
};

export const UPDATE_SUCCESS_MOCK: NeDBResponse = { totalRecordsUpdated: 1 };
export const TOO_MANY_UPDATES_MOCK: NeDBResponse = { totalRecordsUpdated: 2 };

export const EXPECTED_GAME_QUERY: FindByID = { _id: MOCK_GAME_ID };

export const PLAYER_DECK_SETS_FOR_GAMES: PlayerDeckSet[] =
    setupAllPlayerDeckCombos(MIN_PLAYERS, MAX_PLAYERS, MIN_DECKS, MAX_DECKS);
export const GAME_TEST_PARAM_SETS: GameTestParamSet[] = getGameTestParamSets(
    setupAllPlayerDeckCombos(MIN_PLAYERS, MAX_PLAYERS, MIN_DECKS, MAX_DECKS),
    GAME_ID_PARAM_PLACEHOLDER,
    BASE_GAME_ROUTE
);
