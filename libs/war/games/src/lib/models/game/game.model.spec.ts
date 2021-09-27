import {
    createAftermathMock,
    MOCK_LOGS
} from '@card-games-api/battle-logs/testing';
import { Aftermath } from '@card-games-api/battles';
import { Player, PLAYER_ONE_NAME, TWO_PLAYERS } from '@card-games-api/players';
import {
    players as mockPlayers,
    setupFullyLoadedPlayers,
    THREE_PLAYERS
} from '@card-games-api/players/testing';
import { size } from 'lodash';

import {
    MOCK_COMPLETE_GAME,
    MOCK_DATE,
    MOCK_GAME_ID,
    setupGameAndGameData,
    setupGameWithAnInactivePlayer,
    setupGameWithLog,
    setupMockGame
} from '../../../testing';
import { GameData, GameStatuses } from '../../types';
import { Game } from './game.models';

import type { WholeOrPartial } from '@card-games-api/utils';

const { GAME_JUST_STARTED, GAME_OVER, IN_PROGRESS } = GameStatuses;

let game: Game;
let gameData: GameData;

const aftermath: Aftermath = createAftermathMock();

describe('Game', () => {
    beforeEach(() => (game = setupMockGame()));

    it('should initiate without crashing', async () => {
        expect(game).toBeTruthy();
    });

    describe('Getter Properties', () => {
        beforeEach(() => (game = setupMockGame()));

        describe('should return the proper values', () => {
            beforeEach(
                () => (game = setupGameWithAnInactivePlayer(THREE_PLAYERS))
            );

            it('totalActivePlayers', async () => {
                expect(game.totalActivePlayers).toEqual(TWO_PLAYERS);
            });

            it('totalPlayers', async () => {
                expect(game.totalPlayers).toEqual(THREE_PLAYERS);
            });
        });
    });

    describe('BattleLogAdapters', () => {
        beforeEach(() => (game = setupGameWithLog()));

        describe("should have each of the BattleLogAdapters' methods working as expected", () => {
            it('addToLogs', async () => {
                expect(await game.addToLogs(aftermath)).toBeInstanceOf(Game);
            });

            it('getLatestLog', async () => {
                expect(await game.getLatestLog()).toBeTruthy();
            });

            it('getLogs', async () => {
                expect(await game.getLogs()).toBeTruthy();
            });
        });
    });

    describe('getPlayers', () => {
        beforeEach(() => (game = setupMockGame()));

        it('should return array of players instances without crashing', async () => {
            expect(size(await game.getPlayers())).toEqual(TWO_PLAYERS);
        });
    });

    describe('getStatus', () => {
        beforeEach(() => (game = setupMockGame()));

        it('should return score/state of game without crashing', async () => {
            expect(await game.getStatus()).toEqual(GAME_JUST_STARTED);
        });
    });

    describe('updatePlayers', () => {
        beforeEach(() => (game = setupMockGame()));

        it('should update players with new data', async () => {
            const originalPlayers: Player[] = await game.getPlayers();
            const newPlayers: Player[] = setupFullyLoadedPlayers();

            await game.updatePlayers(newPlayers);

            expect(await game.getPlayers()).toMatchObject(newPlayers);
            expect(await game.getPlayers()).not.toMatchObject(originalPlayers);
        });

        it('should be chainable', async () => {
            const newPlayers: Player[] = setupFullyLoadedPlayers();
            expect(await game.updatePlayers(newPlayers)).toBeInstanceOf(Game);
        });
    });

    describe('getScore', () => {
        beforeEach(() => (game = setupGameWithLog()));

        it('should return number of players with decks that are not empty', async () => {
            expect(await game.getScore()).toBeTruthy();
        });
    });

    describe('switchStatus', () => {
        beforeEach(() => (game = setupMockGame()));

        it('should switch up status for game', async () => {
            await game.switchStatus();
            expect(await game.getStatus()).toEqual(IN_PROGRESS);
        });

        it('should be chainable', async () => {
            expect(await game.switchStatus()).toBeInstanceOf(Game);
        });
    });

    describe('toJson', () => {
        describe('Default/Standard Property Values', () => {
            beforeEach(() => ({ game, gameData } = setupGameAndGameData()));

            it('should return correct game data in JSON format', async () => {
                expect(await game.toJson()).toMatchObject(gameData);
            });

            it('should have correct values for its defined properties', async () => {
                const { status, players } = await game.toJson();
                expect(status).toEqual(GAME_JUST_STARTED);
                expect(size(players)).toEqual(size(mockPlayers));
            });

            it('should omit undefined properties', async () => {
                const gameData: WholeOrPartial<GameData> = await game.toJson();

                expect(gameData).not.toHaveProperty('id');
                expect(gameData).not.toHaveProperty('createdAt');
                expect(gameData).not.toHaveProperty('updatedAt');
                expect(gameData).not.toHaveProperty('winner');
            });

            it('should omit logs property if it is empty', async () => {
                expect(await game.toJson()).not.toHaveProperty('logs');
            });
        });

        describe('Complete/Other Game Data Returns', () => {
            beforeEach(() => (game = setupMockGame(MOCK_COMPLETE_GAME)));

            it('should return complate game data', async () => {
                expect(await game.toJson()).toMatchObject(MOCK_COMPLETE_GAME);
            });

            it('should return the properties that are undefined by default', async () => {
                const { id, logs, createdAt, updatedAt, winner } =
                    await game.toJson();
                expect(id).toEqual(MOCK_GAME_ID);
                expect(logs).toEqual(MOCK_LOGS);
                expect(createdAt).toEqual(MOCK_DATE);
                expect(updatedAt).toEqual(MOCK_DATE);
                expect(winner).toEqual(PLAYER_ONE_NAME);
            });

            it('should still return the other props like normal', async () => {
                const { status, players } = await game.toJson();
                expect(status).toEqual(GAME_OVER);
                expect(size(players)).toEqual(size(mockPlayers));
            });
        });
    });
});
