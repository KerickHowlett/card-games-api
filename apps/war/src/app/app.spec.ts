import { BattleLog } from '@card-games-api/battle-logs';
import { ONE_BATTLELOG } from '@card-games-api/battle-logs/testing';
import { NeDBCore as database } from '@card-games-api/database/nedb';
import { NodeCacheCore as cache } from '@card-games-api/database/node-cache';
import {
    BASE_GAME_ROUTE,
    Game,
    GameData,
    gameRoutes,
    GameScore,
    GameStatus,
    GameStatuses,
    isGameOver,
    remapIdProperty
} from '@card-games-api/games';
import {
    injectGameId,
    setupMockGameServer
} from '@card-games-api/games/testing';
import {
    haveExactSameDeckSize,
    isEveryDeckDifferent,
    isExistingPlayerName
} from '@card-games-api/players/testing';
import { hasDefinedString } from '@card-games-api/utils';
import { StatusCodes } from 'http-status-codes';
import { add, size } from 'lodash';
import request from 'supertest';

import {
    mockGetRoute,
    mockPostRoute,
    mockPutRoute,
    totalDecks,
    totalPlayers
} from '../testing';
import app from './app';

const { OK } = StatusCodes;

const { GAME_OVER } = GameStatuses;

jest.retryTimes(2);
describe('App', () => {
    it('should create Express App instance without crashing', () => {
        expect(app).toBeTruthy();
    });

    describe('War E2E Smoke Testing', () => {
        beforeEach(() =>
            setupMockGameServer(
                totalPlayers,
                totalDecks,
                gameRoutes,
                BASE_GAME_ROUTE,
                app
            )
        );

        it('should complete all features of the app from start to finish without crashing', async () => {
            const { body: newGameResponse } = await request(app)
                .put(mockPutRoute)
                .send()
                .expect(OK);

            expect(newGameResponse).toMatchObject({ id: expect.any(String) });

            const id: string = newGameResponse.id;
            expect(hasDefinedString(id)).toBe(true);

            const newGameDatabaseResponse: GameData =
                await database.getOne<GameData>({ _id: id });

            const { players: newGamePlayers, status: newGameStatus } =
                newGameDatabaseResponse;

            expect(newGamePlayers).toHaveLength(totalPlayers);
            expect(haveExactSameDeckSize(newGamePlayers)).toBe(true);
            expect(isEveryDeckDifferent(newGamePlayers)).toBe(true);

            const newGameCacheResponse: GameData = await cache.get<GameData>(
                id
            );
            const remappedCachedNewGame: GameData =
                remapIdProperty(newGameCacheResponse);

            expect(remappedCachedNewGame).toMatchObject(
                newGameDatabaseResponse
            );

            let currentGameStatus: GameStatus = newGameStatus;

            const mockPostRouteWithGameId: string = injectGameId(
                mockPostRoute,
                id
            );

            while (!isGameOver(currentGameStatus)) {
                const preBattleGameData: GameData =
                    await database.getOne<GameData>({ _id: id });

                const preBattleGame: Game = new Game(preBattleGameData);
                const preBattleScore: GameScore = preBattleGame.getScore();
                const preBattleLogsSize: number =
                    size(preBattleGameData.logs) || 0;

                const mockGetRouteWithGameId: string = injectGameId(
                    mockGetRoute,
                    id
                );
                const { body: savedGameScore } = await request(app)
                    .get(mockGetRouteWithGameId)
                    .send()
                    .expect(OK);

                expect(savedGameScore).toMatchObject(preBattleScore);

                const scoreCacheResponse: GameData = await cache.get<GameData>(
                    id
                );
                const scoreDatabaseResponse: GameData =
                    await database.getOne<GameData>({ _id: id });

                expect({ ...scoreCacheResponse, _id: id }).toMatchObject(
                    scoreDatabaseResponse
                );

                const { body: battleResults } = await request(app)
                    .post(mockPostRouteWithGameId)
                    .expect(OK)
                    .send();

                const postBattleGameData: GameData = await database.getOne({
                    _id: id
                });

                const updatedDatabaseGame: Game = new Game(postBattleGameData);
                const latestLogFromDatabase: BattleLog =
                    updatedDatabaseGame.getLatestLog();

                expect(latestLogFromDatabase).toEqual(battleResults);
                const { status: latestStatus, logs: updatedBattleLogs } =
                    postBattleGameData;

                expect(updatedBattleLogs).toHaveLength(
                    add(preBattleLogsSize, ONE_BATTLELOG)
                );

                const updatedCacheGameData: GameData = await cache.get(id);
                const remappedCachedUpdatedGame: GameData =
                    remapIdProperty(updatedCacheGameData);
                expect(remappedCachedUpdatedGame).toMatchObject(
                    postBattleGameData
                );

                currentGameStatus = latestStatus;
            }

            const finalDatabaseGameData: GameData =
                await database.getOne<GameData>({ _id: id });

            const finalCacheGameData: GameData = await cache.get<GameData>(id);
            const finalRemappedCachedData: GameData =
                remapIdProperty(finalCacheGameData);

            expect(finalRemappedCachedData).toMatchObject(
                finalDatabaseGameData
            );

            const { body: finalScore } = await request(app)
                .post(mockPostRouteWithGameId)
                .expect(OK)
                .send();

            const finalGame: Game = new Game(finalDatabaseGameData);
            const finalScoreAsInDatabase: GameScore = finalGame.getScore();

            expect(finalScore).toMatchObject(finalScoreAsInDatabase);

            const { status: finalStatus, winner: gameWinner } = finalScore;

            expect(isExistingPlayerName(gameWinner, totalPlayers)).toBe(true);

            expect(finalStatus).toEqual(GAME_OVER);
        });
    });
});
