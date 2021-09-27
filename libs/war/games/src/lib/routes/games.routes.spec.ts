import { BattleLog, PlayerLog } from '@card-games-api/battle-logs';
import {
    getGrandTotalScore,
    getTotalCardsPlayed
} from '@card-games-api/battle-logs/testing';
import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import { isTwoPlayers, PlayerData } from '@card-games-api/players';
import {
    haveExactSameDeckSize,
    isEveryDeckDifferent,
    isExistingPlayerName,
    moreThanTwoPlayers
} from '@card-games-api/players/testing';
import { hasDefinedString, remainderOf } from '@card-games-api/utils';
import { JestSpy, mockErrorMessage } from '@card-games-api/utils/testing';
import { StatusCodes } from 'http-status-codes';
import { size } from 'lodash';
import request from 'supertest';

import {
    GAME_TEST_PARAM_SETS,
    GameTestParamSet,
    getGameDataCardTotal,
    injectGameId,
    MOCK_COMPLETE_GAME,
    MOCK_GAME_ID,
    setupMockGameServer
} from '../../testing';
import { remapIdProperty } from '../helpers/database';
import { Game } from '../models/game';
import { GameData, GameScore, GameStatuses } from '../types';
import { gameRoutes } from './games.routes';

import type { Application } from 'express';
const { INTERNAL_SERVER_ERROR, NOT_FOUND: GAME_NOT_FOUND, OK } = StatusCodes;

const { GAME_JUST_STARTED, GAME_OVER, IN_PROGRESS } = GameStatuses;

let app: Application;

let gameData: GameData;
let gameScore: GameScore;

let battlePlaySpy: JestSpy;

let cacheGetSpy: JestSpy;
let cacheSetSpy: JestSpy;

let getDataSpy: JestSpy;
let insertDataSpy: JestSpy;
let updateDataSpy: JestSpy;

let mockDate: Date;

jest.retryTimes(2);
describe('Games Routes', () => {
    it('should build routes without crashing', async () => {
        expect(gameRoutes).toBeTruthy();
    });

    describe('startNewGame', () => {
        describe.each(GAME_TEST_PARAM_SETS)(
            'PUT: $mockPutRoute',
            (set: GameTestParamSet) => {
                const { totalDecks, totalPlayers, mockPutRoute } = set;

                beforeEach(
                    () =>
                        ({ app, cacheSetSpy, insertDataSpy, mockDate } =
                            setupMockGameServer(
                                totalPlayers,
                                totalDecks,
                                gameRoutes
                            ))
                );

                it('should create new game, save it, cache it, and return with game ID', async () => {
                    const { body: newGameResponse } = await request(app)
                        .put(mockPutRoute)
                        .send()
                        .expect(OK);

                    expect(newGameResponse).toMatchObject({
                        id: expect.any(String)
                    });

                    const id: string = newGameResponse.id;
                    expect(hasDefinedString(id)).toBe(true);

                    expect(insertDataSpy).toHaveBeenCalledTimes(1);
                    expect(cacheSetSpy).toHaveBeenCalledTimes(1);

                    const databaseResponse: GameData =
                        await database.getOne<GameData>({ _id: id });

                    const {
                        _id,
                        logs,
                        players,
                        status,
                        createdAt,
                        updatedAt,
                        winner
                    } = databaseResponse;

                    expect(id).toEqual(_id);

                    expect(status).toEqual(GAME_JUST_STARTED);

                    expect(createdAt).toEqual(mockDate);
                    expect(updatedAt).toEqual(mockDate);

                    expect(players).toHaveLength(totalPlayers);
                    expect(haveExactSameDeckSize(players)).toBe(true);
                    expect(isEveryDeckDifferent(players)).toBe(true);

                    expect(logs).toBeUndefined();
                    expect(winner).toBeUndefined();

                    const cacheResponse: GameData = await cache.get<GameData>(
                        _id
                    );
                    const remappedCacheResponse: GameData =
                        remapIdProperty(cacheResponse);

                    expect(remappedCacheResponse).toMatchObject(
                        databaseResponse
                    );
                });

                describe('should throw error', () => {
                    beforeEach(
                        () =>
                            ({ app, cacheSetSpy, insertDataSpy } =
                                setupMockGameServer(
                                    totalPlayers,
                                    totalDecks,
                                    gameRoutes
                                ))
                    );

                    it('if something goes wrong with saving to the database', async () => {
                        insertDataSpy.mockRejectedValue(mockErrorMessage);

                        await request(app)
                            .put(mockPutRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(insertDataSpy).toHaveBeenCalledTimes(1);
                        expect(cacheSetSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with storing in the cache', async () => {
                        cacheSetSpy.mockRejectedValue(mockErrorMessage);

                        await request(app)
                            .put(mockPutRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(insertDataSpy).toHaveBeenCalledTimes(1);
                        expect(cacheSetSpy).toHaveBeenCalledTimes(1);
                    });

                    describe('if inserting to the database responds with', () => {
                        it('NULL', async () => {
                            insertDataSpy.mockResolvedValue(null);

                            await request(app)
                                .put(mockPutRoute)
                                .send()
                                .expect(INTERNAL_SERVER_ERROR);

                            expect(insertDataSpy).toHaveBeenCalledTimes(1);
                            expect(cacheSetSpy).not.toHaveBeenCalled();
                        });

                        it('boolean of FALSE', async () => {
                            insertDataSpy.mockResolvedValue(false);

                            await request(app)
                                .put(mockPutRoute)
                                .send()
                                .expect(INTERNAL_SERVER_ERROR);

                            expect(insertDataSpy).toHaveBeenCalledTimes(1);
                            expect(cacheSetSpy).not.toHaveBeenCalled();
                        });

                        it('UNDEFINED', async () => {
                            insertDataSpy.mockResolvedValue(undefined);

                            await request(app)
                                .put(mockPutRoute)
                                .send()
                                .expect(INTERNAL_SERVER_ERROR);

                            expect(insertDataSpy).toHaveBeenCalledTimes(1);
                            expect(cacheSetSpy).not.toHaveBeenCalled();
                        });

                        it('Empty Object (a JSON without the Game ID property)', async () => {
                            insertDataSpy.mockResolvedValue({});

                            await request(app)
                                .put(mockPutRoute)
                                .send()
                                .expect(INTERNAL_SERVER_ERROR);

                            expect(insertDataSpy).toHaveBeenCalledTimes(1);
                            expect(cacheSetSpy).not.toHaveBeenCalled();
                        });
                    });
                });
            }
        );
    });

    describe('getGameScore', () => {
        describe.each(GAME_TEST_PARAM_SETS)(
            'GET: $mockGetRoute | $totalPlayers Players & $totalDecks Decks',
            (set: GameTestParamSet) => {
                const { totalDecks, totalPlayers, mockGetRoute } = set;

                beforeEach(
                    () =>
                        ({
                            app,
                            cacheGetSpy,
                            cacheSetSpy,
                            gameData,
                            gameScore,
                            getDataSpy
                        } = setupMockGameServer(
                            totalPlayers,
                            totalDecks,
                            gameRoutes
                        ))
                );

                it('from the database when NOT cached', async () => {
                    const { _id: id } = await database.insert(gameData);

                    const mockRoute: string = injectGameId(mockGetRoute, id);
                    const { body: savedGameScore } = await request(app)
                        .get(mockRoute)
                        .send()
                        .expect(OK);

                    expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                    expect(cacheGetSpy).toHaveBeenCalledWith(id);

                    expect(getDataSpy).toHaveBeenCalledTimes(1);
                    expect(getDataSpy).toHaveBeenCalledWith({ _id: id });

                    expect(cacheSetSpy).toHaveBeenCalledTimes(1);

                    expect(savedGameScore).toMatchObject(gameScore);

                    if (isTwoPlayers(totalPlayers)) {
                        expect(savedGameScore).toHaveProperty(
                            'playerOne',
                            expect.any(Number)
                        );
                        expect(savedGameScore).toHaveProperty(
                            'playerTwo',
                            expect.any(Number)
                        );

                        expect(savedGameScore).not.toHaveProperty('players');
                        expect(savedGameScore.players).toBeUndefined();
                    }

                    if (moreThanTwoPlayers(totalPlayers)) {
                        expect(savedGameScore).not.toHaveProperty('playerOne');
                        expect(savedGameScore.playerOne).toBeUndefined();

                        expect(savedGameScore).not.toHaveProperty('playerTwo');
                        expect(savedGameScore.playerTwo).toBeUndefined();

                        expect(savedGameScore).toHaveProperty(
                            'players',
                            expect.any(Array)
                        );
                    }

                    const databaseResponse: GameData =
                        await database.getOne<GameData>({ _id: id });

                    const cacheResponse: GameData = await cache.get<GameData>(
                        id
                    );
                    const remappedCacheResponse: GameData =
                        remapIdProperty(cacheResponse);

                    expect(remappedCacheResponse).toMatchObject(
                        databaseResponse
                    );
                });

                it('from memory when data IS cached', async () => {
                    const { _id: id } = await database.insert(gameData);
                    await cache.set(id, { id: id, ...gameData });
                    cacheSetSpy.mockClear();

                    const mockRoute: string = injectGameId(mockGetRoute, id);
                    const { body: savedGameScore } = await request(app)
                        .get(mockRoute)
                        .send()
                        .expect(OK);

                    expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                    expect(cacheGetSpy).toHaveBeenCalledWith(id);

                    expect(getDataSpy).not.toHaveBeenCalled();
                    expect(cacheSetSpy).not.toHaveBeenCalled();

                    expect(savedGameScore).toMatchObject(gameScore);

                    if (isTwoPlayers(totalPlayers)) {
                        expect(savedGameScore).toHaveProperty(
                            'playerOne',
                            expect.any(Number)
                        );
                        expect(savedGameScore).toHaveProperty(
                            'playerTwo',
                            expect.any(Number)
                        );

                        expect(savedGameScore).not.toHaveProperty('players');
                        expect(savedGameScore.players).toBeUndefined();
                    }

                    if (moreThanTwoPlayers(totalPlayers)) {
                        expect(savedGameScore).not.toHaveProperty('playerOne');
                        expect(savedGameScore.playerOne).toBeUndefined();

                        expect(savedGameScore).not.toHaveProperty('playerTwo');
                        expect(savedGameScore.playerTwo).toBeUndefined();

                        expect(savedGameScore).toHaveProperty(
                            'players',
                            expect.any(Array)
                        );
                    }

                    const cacheResponse: GameData = await cache.get<GameData>(
                        id
                    );
                    const dataToBeCached: GameData = { ...gameData, id };

                    expect(cacheResponse).toMatchObject(dataToBeCached);
                });

                describe('Error Handling', () => {
                    beforeEach(
                        () =>
                            ({
                                app,
                                cacheGetSpy,
                                cacheSetSpy,
                                gameData,
                                getDataSpy
                            } = setupMockGameServer(
                                totalPlayers,
                                totalDecks,
                                gameRoutes
                            ))
                    );

                    it('should return HTTP status of 404 if no game is found', async () => {
                        const mockRoute: string = injectGameId(
                            mockGetRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .get(mockRoute)
                            .send()
                            .expect(GAME_NOT_FOUND);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({
                            _id: MOCK_GAME_ID
                        });

                        expect(cacheSetSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with the cache fetch', async () => {
                        cacheGetSpy.mockRejectedValue(mockErrorMessage);

                        const mockRoute: string = injectGameId(
                            mockGetRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .get(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).not.toHaveBeenCalled();
                        expect(cacheSetSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with the database fetch', async () => {
                        getDataSpy.mockRejectedValue(mockErrorMessage);

                        const mockRoute: string = injectGameId(
                            mockGetRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .get(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({
                            _id: MOCK_GAME_ID
                        });

                        expect(cacheSetSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with setting the refreshed data into the cache', async () => {
                        const { _id: id } = await database.insert(gameData);

                        cacheSetSpy.mockRejectedValue(mockErrorMessage);

                        const mockRoute: string = injectGameId(
                            mockGetRoute,
                            id
                        );
                        await request(app)
                            .get(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(id);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({ _id: id });

                        expect(cacheSetSpy).toHaveBeenCalledTimes(1);
                    });
                });
            }
        );
    });

    describe('play', () => {
        describe.each(GAME_TEST_PARAM_SETS)(
            'POST: $mockPostRoute | $totalPlayers Players & $totalDecks Decks',
            (set: GameTestParamSet) => {
                const { totalDecks, totalPlayers, mockPostRoute } = set;

                describe('should run a single battle and return the results of it', () => {
                    beforeEach(
                        () =>
                            ({
                                app,
                                battlePlaySpy,
                                cacheGetSpy,
                                cacheSetSpy,
                                gameData,
                                getDataSpy,
                                updateDataSpy
                            } = setupMockGameServer(
                                totalPlayers,
                                totalDecks,
                                gameRoutes
                            ))
                    );

                    it('with data from the database and not cached', async () => {
                        const { _id: id } = await database.insert(gameData);

                        const originalTotalCardsInGame: number =
                            getGameDataCardTotal(gameData);

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            id
                        );
                        const { body: battleResults } = await request(app)
                            .post(mockRoute)
                            .expect(OK)
                            .send();

                        expect(battlePlaySpy).toHaveBeenCalled();

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(id);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({ _id: id });

                        expect(updateDataSpy).toHaveBeenCalledTimes(1);
                        expect(cacheSetSpy).toHaveBeenCalledTimes(2);

                        const totalCardsInGameNow: number =
                            getGrandTotalScore(battleResults);
                        expect(totalCardsInGameNow).toEqual(
                            originalTotalCardsInGame
                        );

                        const totalCardsPlayed: number =
                            getTotalCardsPlayed(battleResults);
                        expect(
                            remainderOf(totalCardsPlayed, totalPlayers)
                        ).toEqual(0);

                        const isWinnerIdentified: boolean =
                            isExistingPlayerName(
                                battleResults.winner,
                                totalPlayers
                            );
                        expect(isWinnerIdentified).toBe(true);

                        const updatedDatabaseGameData: GameData =
                            await database.getOne({ _id: id });
                        const {
                            players: updatedPlayers,
                            status: currentStatus,
                            logs: battleLog
                        } = updatedDatabaseGameData;

                        expect(updatedPlayers).not.toMatchObject(
                            gameData.players
                        );

                        if (isTwoPlayers(totalPlayers)) {
                            const { playerOne, playerTwo } = battleResults;
                            expect(updatedPlayers[0].deckSize).toEqual(
                                playerOne.deck
                            );
                            expect(updatedPlayers[1].deckSize).toEqual(
                                playerTwo.deck
                            );
                        }

                        if (moreThanTwoPlayers(totalPlayers)) {
                            let playerNumber = 0;
                            while (playerNumber < size(updatedPlayers)) {
                                const updatedPlayer: PlayerData =
                                    updatedPlayers[playerNumber];
                                const battlePlayer: PlayerLog =
                                    battleResults.players[playerNumber];
                                expect(updatedPlayer.deckSize).toEqual(
                                    battlePlayer.deck
                                );
                                playerNumber = playerNumber + 1;
                            }
                            expect(playerNumber).toEqual(totalPlayers);
                        }

                        expect(battleLog).toHaveLength(1);

                        expect(currentStatus).toEqual(IN_PROGRESS);

                        const updatedDatabaseGame: Game = new Game(
                            updatedDatabaseGameData
                        );
                        const latestLogFromDatabase: BattleLog =
                            updatedDatabaseGame.getLatestLog();

                        expect(latestLogFromDatabase).toEqual(battleResults);

                        const updatedCacheGameData: GameData = await cache.get(
                            id
                        );
                        const remappedCacheResponse: GameData =
                            remapIdProperty(updatedCacheGameData);

                        expect(remappedCacheResponse).toMatchObject(
                            updatedDatabaseGameData
                        );
                    });

                    it('with data from the cached memory', async () => {
                        const { _id: id } = await database.insert(gameData);
                        await cache.set(id, { ...gameData, id });
                        cacheSetSpy.mockClear();

                        const originalTotalCardsInGame: number =
                            getGameDataCardTotal(gameData);

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            id
                        );
                        const { body: battleResults } = await request(app)
                            .post(mockRoute)
                            .expect(OK)
                            .send();

                        expect(battlePlaySpy).toHaveBeenCalled();

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(id);

                        expect(getDataSpy).not.toHaveBeenCalled();

                        expect(updateDataSpy).toHaveBeenCalledTimes(1);
                        expect(cacheSetSpy).toHaveBeenCalledTimes(1);

                        const totalCardsInGameNow: number =
                            getGrandTotalScore(battleResults);
                        expect(totalCardsInGameNow).toEqual(
                            originalTotalCardsInGame
                        );

                        const totalCardsPlayed: number =
                            getTotalCardsPlayed(battleResults);
                        expect(
                            remainderOf(totalCardsPlayed, totalPlayers)
                        ).toEqual(0);

                        const isWinnerIdentified: boolean =
                            isExistingPlayerName(
                                battleResults.winner,
                                totalPlayers
                            );
                        expect(isWinnerIdentified).toBe(true);

                        const updatedDatabaseGameData: GameData =
                            await database.getOne({ _id: id });
                        const {
                            players: updatedPlayers,
                            status: currentStatus,
                            logs: battleLog
                        } = updatedDatabaseGameData;

                        expect(updatedPlayers).not.toMatchObject(
                            gameData.players
                        );

                        if (isTwoPlayers(totalPlayers)) {
                            const { playerOne, playerTwo } = battleResults;
                            expect(updatedPlayers[0].deckSize).toEqual(
                                playerOne.deck
                            );
                            expect(updatedPlayers[1].deckSize).toEqual(
                                playerTwo.deck
                            );
                        }

                        if (moreThanTwoPlayers(totalPlayers)) {
                            let playerNumber = 0;
                            while (playerNumber < size(updatedPlayers)) {
                                const updatedPlayer: PlayerData =
                                    updatedPlayers[playerNumber];
                                const battlePlayer: PlayerLog =
                                    battleResults.players[playerNumber];
                                expect(updatedPlayer.deckSize).toEqual(
                                    battlePlayer.deck
                                );
                                playerNumber = playerNumber + 1;
                            }
                            expect(playerNumber).toEqual(totalPlayers);
                        }

                        expect(battleLog).toHaveLength(1);

                        expect(currentStatus).toEqual(IN_PROGRESS);

                        const updatedDatabaseGame: Game = new Game(
                            updatedDatabaseGameData
                        );
                        const latestLogFromDatabase: BattleLog =
                            updatedDatabaseGame.getLatestLog();

                        expect(latestLogFromDatabase).toEqual(battleResults);

                        const updatedCacheGameData: GameData = await cache.get(
                            id
                        );
                        const remappedCacheResponse: GameData =
                            remapIdProperty(updatedCacheGameData);

                        expect(remappedCacheResponse).toMatchObject(
                            updatedDatabaseGameData
                        );
                    });
                });

                describe("should return the final score if the game's status is set to GAME_OVER", () => {
                    beforeEach(
                        () =>
                            ({
                                app,
                                battlePlaySpy,
                                cacheGetSpy,
                                cacheSetSpy,
                                getDataSpy,
                                updateDataSpy
                            } = setupMockGameServer(
                                totalPlayers,
                                totalDecks,
                                gameRoutes
                            ))
                    );

                    it('with data pulled from the database', async () => {
                        const { _id: id } = await database.insert(
                            MOCK_COMPLETE_GAME
                        );

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            id
                        );
                        const {
                            body: { status, winner }
                        } = await request(app)
                            .post(mockRoute)
                            .expect(OK)
                            .send();

                        expect(battlePlaySpy).not.toHaveBeenCalled();

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(id);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({ _id: id });

                        expect(updateDataSpy).not.toHaveBeenCalled();
                        expect(cacheSetSpy).toHaveBeenCalledTimes(1);

                        expect(isExistingPlayerName(winner, totalPlayers)).toBe(
                            true
                        );

                        expect(status).toEqual(GAME_OVER);
                    });

                    it('with data pulled from the cache', async () => {
                        await cache.set(MOCK_GAME_ID, MOCK_COMPLETE_GAME);
                        cacheSetSpy.mockClear();

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            MOCK_GAME_ID
                        );
                        const {
                            body: { status, winner }
                        } = await request(app)
                            .post(mockRoute)
                            .expect(OK)
                            .send();

                        expect(battlePlaySpy).not.toHaveBeenCalled();

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).toHaveBeenCalledTimes(0);

                        expect(updateDataSpy).not.toHaveBeenCalled();
                        expect(cacheSetSpy).not.toHaveBeenCalled();

                        expect(isExistingPlayerName(winner, totalPlayers)).toBe(
                            true
                        );

                        expect(status).toEqual(GAME_OVER);
                    });
                });

                describe('Error Handling', () => {
                    beforeEach(
                        () =>
                            ({
                                app,
                                battlePlaySpy,
                                cacheGetSpy,
                                cacheSetSpy,
                                gameData,
                                getDataSpy,
                                updateDataSpy
                            } = setupMockGameServer(
                                totalPlayers,
                                totalDecks,
                                gameRoutes
                            ))
                    );

                    it('should return 404 status if no game is found', async () => {
                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .post(mockRoute)
                            .send()
                            .expect(GAME_NOT_FOUND);

                        expect(battlePlaySpy).not.toHaveBeenCalled();

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({
                            _id: MOCK_GAME_ID
                        });

                        expect(cacheSetSpy).not.toHaveBeenCalled();

                        expect(updateDataSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with the cache fetch', async () => {
                        cacheGetSpy.mockRejectedValue(mockErrorMessage);

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .post(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).not.toHaveBeenCalled();
                        expect(cacheSetSpy).not.toHaveBeenCalled();

                        expect(battlePlaySpy).not.toHaveBeenCalled();
                        expect(updateDataSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with the database fetch', async () => {
                        getDataSpy.mockRejectedValue(mockErrorMessage);

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .post(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({
                            _id: MOCK_GAME_ID
                        });

                        expect(cacheSetSpy).not.toHaveBeenCalled();
                        expect(battlePlaySpy).not.toHaveBeenCalled();
                        expect(updateDataSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with setting the refreshed data via getGameData', async () => {
                        const { _id: id } = await database.insert(gameData);

                        cacheSetSpy.mockRejectedValue(mockErrorMessage);

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            id
                        );
                        await request(app)
                            .post(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(id);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({ _id: id });

                        expect(cacheSetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheSetSpy).not.toHaveBeenCalledTimes(2);

                        expect(battlePlaySpy).not.toHaveBeenCalled();
                        expect(updateDataSpy).not.toHaveBeenCalled();
                    });

                    it('if something goes wrong with updating the new data into the database', async () => {
                        battlePlaySpy.mockClear();
                        updateDataSpy.mockRejectedValue(mockErrorMessage);

                        const { _id: id } = await database.insert(gameData);

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            id
                        );
                        await request(app)
                            .post(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(id);

                        expect(getDataSpy).toHaveBeenCalledTimes(1);
                        expect(getDataSpy).toHaveBeenCalledWith({ _id: id });

                        expect(cacheSetSpy).toHaveBeenCalledTimes(1);

                        expect(battlePlaySpy).toHaveBeenCalled();

                        expect(updateDataSpy).toHaveBeenCalledTimes(1);
                    });

                    it('if the database reports that nothing was updated', async () => {
                        await cache.set(MOCK_GAME_ID, {
                            ...gameData,
                            MOCK_GAME_ID
                        });
                        cacheSetSpy.mockClear();

                        const mockRoute: string = injectGameId(
                            mockPostRoute,
                            MOCK_GAME_ID
                        );
                        await request(app)
                            .post(mockRoute)
                            .send()
                            .expect(INTERNAL_SERVER_ERROR);

                        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                        expect(cacheGetSpy).toHaveBeenCalledWith(MOCK_GAME_ID);

                        expect(battlePlaySpy).toHaveBeenCalled();

                        expect(updateDataSpy).toHaveBeenCalledTimes(1);
                        expect(cacheSetSpy).not.toHaveBeenCalled();
                    });
                });
            }
        );
    });
});
