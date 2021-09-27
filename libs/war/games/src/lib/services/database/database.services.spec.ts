import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import {
    haveExactSameDeckSize,
    isEveryDeckDifferent
} from '@card-games-api/players/testing';
import { hasDefinedString } from '@card-games-api/utils';
import { JestSpy, mockErrorMessage } from '@card-games-api/utils/testing';

import {
    getMockUpdateResponse,
    MOCK_GAME_ID,
    setupGameDatabaseTests
} from '../../../testing';
import { DEFAULT_TOTAL_PLAYERS } from '../../constants';
import { remapIdProperty } from '../../helpers/database';
import { Game } from '../../models/game';
import { GameData, GameStatuses } from '../../types';
import { DatabaseServices as service } from './database.services';

const { GAME_JUST_STARTED, IN_PROGRESS } = GameStatuses;

let cacheGetSpy: JestSpy;
let cacheSetSpy: JestSpy;

let getDataSpy: JestSpy;
let insertDataSpy: JestSpy;
let updateDataSpy: JestSpy;

let mockDate: Date;

let game: Game;
let gameData: GameData;
let gameDataWithMockId: GameData;

describe('DatabaseServices', () => {
    it('should create instance without crashing', async () => {
        expect(service).toBeTruthy();
    });

    describe('addNewGame', () => {
        beforeEach(
            () =>
                ({ cacheSetSpy, game, insertDataSpy, mockDate } =
                    setupGameDatabaseTests())
        );

        it('should add game data and return ID number for saved game', async () => {
            const { id } = await service.addNewGame(game);

            expect(hasDefinedString(id)).toBe(true);
            expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        });

        it('should save it in the database', async () => {
            const { id: responseId } = await service.addNewGame(game);

            const {
                _id,
                logs,
                players,
                status: gameStatus,
                createdAt,
                updatedAt,
                winner
            } = await database.getOne<GameData>({ _id: responseId });

            expect(_id).toEqual(responseId);

            expect(gameStatus).toEqual(GAME_JUST_STARTED);

            expect(createdAt).toEqual(mockDate);
            expect(updatedAt).toEqual(mockDate);

            expect(players).toHaveLength(DEFAULT_TOTAL_PLAYERS);
            expect(haveExactSameDeckSize(players)).toBe(true);
            expect(isEveryDeckDifferent(players)).toBe(true);

            expect(logs).toBeUndefined();
            expect(winner).toBeUndefined();
        });

        it('should save it in the cache', async () => {
            const { id: newGameId } = await service.addNewGame(game);

            const {
                id,
                logs,
                players,
                status: gameStatus,
                createdAt,
                updatedAt,
                winner
            } = await cache.get<GameData>(newGameId);

            expect(id).toEqual(newGameId);

            expect(gameStatus).toEqual(GAME_JUST_STARTED);

            expect(createdAt).toEqual(mockDate);
            expect(updatedAt).toEqual(mockDate);

            expect(players).toHaveLength(DEFAULT_TOTAL_PLAYERS);
            expect(haveExactSameDeckSize(players)).toBe(true);
            expect(isEveryDeckDifferent(players)).toBe(true);

            expect(logs).toBeUndefined();
            expect(winner).toBeUndefined();
        });

        it('should have GameData match in both database & cache', async () => {
            const { id: responseId } = await service.addNewGame(game);

            const databaseResponse: GameData = await database.getOne<GameData>({
                _id: responseId
            });
            const cacheResponse: GameData = await cache.get<GameData>(
                responseId
            );
            const remappedCache: GameData = remapIdProperty(cacheResponse);

            expect(databaseResponse).toMatchObject(remappedCache);
        });

        describe('should map the ID properties correctly', () => {
            it('saved in the database', async () => {
                const { id: responseId } = await service.addNewGame(game);

                const { id, _id } = await database.getOne<GameData>({
                    _id: responseId
                });

                expect(_id).toEqual(responseId);
                expect(id).toBeUndefined();
            });

            it('saved in the cache', async () => {
                const { id: responseId } = await service.addNewGame(game);

                const { id, _id } = await cache.get<GameData>(responseId);

                expect(_id).toBeUndefined();
                expect(id).toEqual(responseId);
            });
        });

        describe("should return null if the database insert returns with a response that's", () => {
            beforeEach(
                () =>
                    ({ cacheSetSpy, game, insertDataSpy, mockDate } =
                        setupGameDatabaseTests())
            );

            it('Null', async () => {
                insertDataSpy.mockResolvedValue(null);
                expect(await service.addNewGame(game)).toBeNull();
            });

            it('Undefined', async () => {
                insertDataSpy.mockResolvedValue(undefined);
                expect(await service.addNewGame(game)).toBeNull();
            });
        });

        describe('should throw error when', () => {
            beforeEach(
                () =>
                    ({ cacheSetSpy, game, insertDataSpy } =
                        setupGameDatabaseTests())
            );

            it('inserts into the database', async () => {
                insertDataSpy.mockRejectedValue(mockErrorMessage);

                await expect(service.addNewGame(game)).rejects.toThrow();

                expect(insertDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).not.toHaveBeenCalled();
            });

            it('sets into the cache', async () => {
                cacheSetSpy.mockRejectedValue(mockErrorMessage);

                await expect(service.addNewGame(game)).rejects.toThrow();

                expect(insertDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('getGame', () => {
        describe('should return saved GameData without crashing', () => {
            beforeEach(
                () =>
                    ({
                        cacheGetSpy,
                        cacheSetSpy,
                        game,
                        gameData,
                        getDataSpy,
                        updateDataSpy
                    } = setupGameDatabaseTests())
            );

            it('from the cache without needing to call the database', async () => {
                await cache.set<GameData>(MOCK_GAME_ID, gameData);
                cacheSetSpy.mockClear();

                expect(await service.getGame(MOCK_GAME_ID)).toEqual(gameData);

                expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).not.toHaveBeenCalled();
                expect(getDataSpy).not.toHaveBeenCalled();
            });

            it('from the database if not already cached', async () => {
                const {
                    _id: id,
                    createdAt,
                    updatedAt
                } = await database.insert<GameData>(gameData);

                const expectedData: GameData = {
                    ...gameData,
                    id,
                    createdAt,
                    updatedAt
                };
                cacheSetSpy.mockClear();

                expect(await service.getGame(id)).toEqual(expectedData);

                expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(1);
                expect(getDataSpy).toHaveBeenCalledTimes(1);
            });

            it('unless in case of 404, it should instead return NULL', async () => {
                expect(await service.getGame(MOCK_GAME_ID)).toBeNull();

                expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                expect(getDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(0);
            });
        });

        describe('should map the ID properties correctly', () => {
            beforeEach(
                () =>
                    ({
                        cacheGetSpy,
                        cacheSetSpy,
                        gameData,
                        gameDataWithMockId,
                        getDataSpy
                    } = setupGameDatabaseTests())
            );

            it('pulled from the cache', async () => {
                await cache.set<GameData>(MOCK_GAME_ID, gameDataWithMockId);
                cacheSetSpy.mockClear();

                const { _id, id } = await service.getGame(MOCK_GAME_ID);

                expect(_id).toBeUndefined();
                expect(id).toEqual(MOCK_GAME_ID);

                expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                expect(getDataSpy).not.toHaveBeenCalled();
                expect(cacheSetSpy).not.toHaveBeenCalled();
            });

            it('pulled from the database', async () => {
                const { _id: responseId } = await database.insert<GameData>(
                    gameData
                );

                const { _id, id } = await service.getGame(responseId);

                expect(_id).toBeUndefined();
                expect(id).toEqual(responseId);

                expect(cacheGetSpy).toHaveBeenCalledTimes(1);
                expect(getDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(1);
            });

            it('saved in the cache', async () => {
                const { _id: responseId } = await database.insert<GameData>(
                    gameData
                );

                expect(await service.getGame(responseId)).toBeTruthy();

                const { id, _id } = await cache.get<GameData>(responseId);

                expect(_id).toBeUndefined();
                expect(id).toEqual(responseId);

                //! 1 call in function + 1 call in test.
                expect(cacheGetSpy).toHaveBeenCalledTimes(2);

                expect(getDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('should throw if something goes wrong with fetching', () => {
            beforeEach(
                () =>
                    ({
                        cacheGetSpy,
                        cacheSetSpy,
                        game,
                        gameData,
                        getDataSpy,
                        updateDataSpy
                    } = setupGameDatabaseTests())
            );

            it('from the cache', async () => {
                cacheGetSpy.mockRejectedValue(mockErrorMessage);

                await expect(service.getGame(MOCK_GAME_ID)).rejects.toThrow();

                expect(cacheSetSpy).not.toHaveBeenCalled();
                expect(getDataSpy).not.toHaveBeenCalled();
            });

            it('from the database', async () => {
                getDataSpy.mockRejectedValue(mockErrorMessage);

                await expect(service.getGame(MOCK_GAME_ID)).rejects.toThrow();

                expect(cacheSetSpy).not.toHaveBeenCalled();
            });

            it('or setting updated data to the cache', async () => {
                cacheSetSpy.mockRejectedValue(mockErrorMessage);

                const { _id: id } = await database.insert<GameData>(gameData);

                await expect(service.getGame(id)).rejects.toThrow();
            });
        });
    });

    describe('updateGame', () => {
        describe('should execute without crashing and return boolean of', () => {
            beforeEach(
                () =>
                    ({
                        cacheGetSpy,
                        cacheSetSpy,
                        game,
                        gameData,
                        getDataSpy,
                        updateDataSpy
                    } = setupGameDatabaseTests())
            );

            it('TRUE when update was successful', async () => {
                const insertedGameData: GameData =
                    await database.insert<GameData>(gameData);

                const remappedGameData: GameData = await remapIdProperty(
                    insertedGameData
                );
                const insertedGame: Game = new Game(remappedGameData);

                insertedGame.switchStatus();

                expect(await service.updateGame(insertedGame)).toBe(true);
                expect(updateDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(1);
            });

            it('FALSE if no document entries were actually updated', async () => {
                updateDataSpy.mockResolvedValue({ totalRecordsUpdated: 0 });
                expect(await service.updateGame(game)).toBe(false);
            });
        });

        describe('should persist the new updated GameData', () => {
            beforeEach(
                () =>
                    ({
                        cacheGetSpy,
                        cacheSetSpy,
                        game,
                        gameData,
                        getDataSpy,
                        mockDate,
                        updateDataSpy
                    } = setupGameDatabaseTests())
            );

            it('in the database', async () => {
                const insertedGameData: GameData =
                    await database.insert<GameData>(gameData);
                const { _id, status: originalStatus } = insertedGameData;

                expect(originalStatus).toEqual(GAME_JUST_STARTED);

                const remappedGameData: GameData = await remapIdProperty(
                    insertedGameData
                );
                const insertedGame: Game = new Game(remappedGameData);

                insertedGame.switchStatus();

                await service.updateGame(insertedGame);

                const insertedData: GameData = await remapIdProperty(
                    insertedGame.toJson()
                );

                const databaseResponse: GameData =
                    await database.getOne<GameData>({ _id });

                expect(insertedData).toMatchObject(databaseResponse);
                expect(databaseResponse.status).toEqual(IN_PROGRESS);
            });

            it('in the cache', async () => {
                const insertedGameData: GameData =
                    await database.insert<GameData>(gameData);
                const { _id, status: originalStatus } = insertedGameData;

                expect(originalStatus).toEqual(GAME_JUST_STARTED);

                const remappedGameData: GameData = await remapIdProperty(
                    insertedGameData
                );
                const insertedGame: Game = new Game(remappedGameData);

                insertedGame.switchStatus();

                await service.updateGame(insertedGame);

                const insertedData: GameData = insertedGame.toJson();
                const cacheResponse: GameData = await cache.get<GameData>(_id);

                expect(insertedData).toMatchObject(cacheResponse);
                expect(cacheResponse.status).toEqual(IN_PROGRESS);
            });
        });

        describe('should map ID properties correctly', () => {
            beforeEach(() => ({ gameData } = setupGameDatabaseTests()));

            it('when saving the updated data into the database', async () => {
                const { _id: responseId } = await database.insert<GameData>(
                    gameData
                );

                const gameDataWithResponseId: GameData = {
                    ...gameData,
                    id: responseId
                };
                const updatedGame: Game = new Game(gameDataWithResponseId);

                expect(await service.updateGame(updatedGame)).toBeTruthy();

                const { id, _id }: GameData = await database.getOne<GameData>({
                    _id: responseId
                });

                expect(_id).toEqual(responseId);
                expect(id).toBeUndefined();
            });

            it('when saving the updated data into the cache', async () => {
                const { _id: responseId } = await database.insert<GameData>(
                    gameData
                );

                const gameDataWithResponseId: GameData = {
                    ...gameData,
                    id: responseId
                };
                const updatedGame: Game = new Game(gameDataWithResponseId);

                expect(await service.updateGame(updatedGame)).toBeTruthy();

                const { id, _id }: GameData = await cache.get<GameData>(
                    responseId
                );

                expect(_id).toBeUndefined();
                expect(id).toEqual(responseId);
            });
        });

        describe('should throw error if something goes wrong', () => {
            beforeEach(
                () =>
                    ({
                        cacheGetSpy,
                        cacheSetSpy,
                        game,
                        gameData,
                        getDataSpy,
                        updateDataSpy
                    } = setupGameDatabaseTests())
            );

            it('with updating to the database', async () => {
                updateDataSpy.mockRejectedValue(mockErrorMessage);

                await expect(service.updateGame(game)).rejects.toThrow();

                expect(cacheSetSpy).not.toHaveBeenCalled();
            });

            it('with setting to the cache', async () => {
                updateDataSpy.mockResolvedValue(
                    getMockUpdateResponse(gameData)
                );
                cacheSetSpy.mockRejectedValue(mockErrorMessage);

                await expect(service.updateGame(game)).rejects.toThrow();

                expect(updateDataSpy).toHaveBeenCalledTimes(1);
                expect(cacheSetSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
