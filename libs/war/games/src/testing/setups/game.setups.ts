import { createAftermathMock } from '@card-games-api/battle-logs/testing';
import {
    Aftermath,
    BattleServices,
    IBattleServices
} from '@card-games-api/battles';
import { battleServiceSpy } from '@card-games-api/battles/testing';
import {
    NeDBCore as database,
    NodeCacheCore as cache
} from '@card-games-api/database';
import { NeDBCore as databaseCore } from '@card-games-api/database/nedb';
import { NodeCacheCore as cacheCore } from '@card-games-api/database/node-cache';
import {
    setupDatabaseSpies,
    setupNeDBAndNodeCache
} from '@card-games-api/database/testing';
import { Player, PlayerData } from '@card-games-api/players';
import {
    setupSomeEmptyPlayers,
    sortPlayerDeck
} from '@card-games-api/players/testing';
import { hasDefinedString } from '@card-games-api/utils';
import {
    MockMiddleware,
    setupMockExpressApp
} from '@card-games-api/utils/testing';
import { chain, invokeMap, isUndefined, unset } from 'lodash';

import { BattleLogAdapters } from '../../lib/adapters/battle-log';
import {
    BASE_GAME_ROUTE,
    DEFAULT_TOTAL_DECKS,
    DEFAULT_TOTAL_PLAYERS
} from '../../lib/constants';
import { isGame } from '../../lib/helpers';
import { Game } from '../../lib/models/game';
import { GameData, GameScore, GameStatuses } from '../../lib/types';
import { MOCK_GAME_ID } from '../mocks';
import {
    GameOrId,
    MockGamesDataSetup,
    MockGameServer,
    PlayerCountOrData,
    SetupAftermathAndGame,
    SetupGameAndGameData,
    SetupGameDatabaseTests
} from '../types';

import type { Application, Router } from 'express';
const { GAME_JUST_STARTED } = GameStatuses;

export const setupMockGame = (
    playerCountOrData: PlayerCountOrData = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS
): Game => new Game(playerCountOrData, totalDecks);

export const setupMockGameData = (
    gameOrId: GameOrId = undefined,
    isFromDatabase = true
): GameData => {
    if (isGame(gameOrId)) return gameOrId.toJson();

    const id = String(gameOrId);
    const game: Game = new Game(DEFAULT_TOTAL_PLAYERS, DEFAULT_TOTAL_DECKS);

    const gameData: GameData = { ...game.toJson(), id, _id: id };

    const propertyToRemove: keyof GameData = isFromDatabase ? 'id' : '_id';
    unset(gameData, propertyToRemove);

    return gameData as GameData;
};

export const setupGameAndGameData = (
    totalPlayers: number = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS,
    game?: Game,
    mockId?: string
): SetupGameAndGameData => {
    const mockGame: Game = isUndefined(game)
        ? new Game(totalPlayers, totalDecks)
        : game;
    const gameData: GameData = setupMockGameData(mockGame);

    const id: string = hasDefinedString(mockId) ? mockId : MOCK_GAME_ID;

    const gameDataWithMockId: GameData = { ...gameData, id };
    const gameDataWithMockUnderscoreId: GameData = { ...gameData, _id: id };

    const gameWithSpies: Game = setupGameSpies(new Game(gameData));

    const gameScore: GameScore = gameWithSpies.getScore();

    return {
        game: gameWithSpies,
        gameData,
        gameScore,
        gameDataWithMockId,
        gameDataWithMockUnderscoreId
    };
};

export const setupGameDatabaseTests = (
    totalPlayers: number = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS
): SetupGameDatabaseTests => ({
    mockDate: new Date(),
    ...setupGameAndGameData(totalPlayers, totalDecks),
    ...setupNeDBAndNodeCache(cacheCore, databaseCore)
});

export const setupGameWithWinner = (game: Game = setupMockGame()): Game[] => {
    game.switchStatus();

    const gameWithWinner: Game = setupMockGame();
    const players: Player[] = gameWithWinner.getPlayers();

    players[0].clearDeck();

    gameWithWinner.updatePlayers(players);

    return [game, gameWithWinner];
};

export const setupMockGamesData = (): MockGamesDataSetup => {
    const playersData: PlayerData[] = invokeMap(
        setupSomeEmptyPlayers(),
        'toJson'
    );

    const mockGameData: GameData = {
        id: 'test',
        players: playersData,
        status: GAME_JUST_STARTED
    };

    const gameOptionalProps: GameData = {
        id: 'test',
        players: playersData,
        status: GAME_JUST_STARTED,
        createdAt: new Date().toString()
    };

    return { mockGameData, gameOptionalProps };
};

export const sortPlayersDecks = (game: Game = setupMockGame()): Game => {
    const players: Player[] = chain(game)
        .cloneDeep()
        .invoke('getPlayers')
        .value()
        .map(sortPlayerDeck);
    return game.updatePlayers(players);
};

export const setupGameSpies = (game: Game = setupMockGame()): Game => {
    jest.spyOn(game, 'addToLogs');
    jest.spyOn(game, 'getLatestLog');
    jest.spyOn(game, 'switchStatus');
    jest.spyOn(game, 'updatePlayers');
    return game;
};

export const setupGameWithAnInactivePlayer = (
    totalPlayers: number = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS
): Game => {
    const game: Game = new Game(totalPlayers, totalDecks);
    const players: Player[] = game.getPlayers();
    players[0].clearDeck();
    game.updatePlayers(players);
    return game;
};

export const setupAftermathAndGame = (
    totalPlayers: number = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS
): SetupAftermathAndGame => {
    const game: Game = setupMockGame(totalPlayers, totalDecks);
    const players: Player[] = game.getPlayers();
    const aftermath: Aftermath = createAftermathMock(players);
    return { game, aftermath };
};

export const setupAdapterWithLog = (): BattleLogAdapters => {
    const adapter: BattleLogAdapters = new BattleLogAdapters();
    const { aftermath } = setupAftermathAndGame();
    adapter.addToLogs(aftermath);
    return adapter;
};

export const setupGameWithLog = (): Game => {
    const { game, aftermath } = setupAftermathAndGame();
    game.addToLogs(aftermath);
    return game;
};

export const setupMockGameApp = (
    app?: Application,
    routes?: Router,
    middleware?: MockMiddleware,
    baseRoute?: string
): Application =>
    isUndefined(app) ? setupMockExpressApp(routes, middleware, baseRoute) : app;

export const setupMockGameServer = (
    totalPlayers: number,
    totalDecks: number,
    routes: Router,
    baseRoute: string = BASE_GAME_ROUTE,
    app: Application | undefined = undefined,
    service: IBattleServices = BattleServices
): MockGameServer => ({
    ...setupGameAndGameData(totalPlayers, totalDecks),
    ...setupDatabaseSpies(cache, database),
    app: setupMockGameApp(app, routes, undefined, baseRoute),
    battlePlaySpy: battleServiceSpy(service),
    mockDate: new Date()
});
