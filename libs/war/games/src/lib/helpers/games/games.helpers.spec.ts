import { ONE_PLAYER, TWO_PLAYERS } from '@card-games-api/players';
import { EXPECTED_PARAM_RETURN } from '@card-games-api/players/testing';
import { failMock } from '@card-games-api/utils/testing';

import {
    MOCK_GAME_ID,
    MOCK_QUERY_PARAMS,
    setupGameWithWinner,
    setupMockGamesData
} from '../../../testing';
import { DEFAULT_TOTAL_PLAYERS } from '../../constants';
import { Game } from '../../models/game';
import { GameData, GameStatuses } from '../../types';
import {
    clampParam,
    handleQueryParams,
    hasJustStarted,
    isGame,
    isGameData,
    isGameOver,
    isInProgress,
    isNewGameSaved,
    toJsonFilter
} from './games.helpers';

let game: Game;
let failGameData: GameData;
let mockGameData: GameData;
let gameOptionalProps: GameData;

const { GAME_JUST_STARTED, GAME_OVER, IN_PROGRESS } = GameStatuses;

describe('Game Helpers', () => {
    describe('clampParam', () => {
        it('should return entered value if valid', async () => {
            expect(await clampParam(1, DEFAULT_TOTAL_PLAYERS)).toEqual(1);
        });

        it('should return default value if entered value is empty or invalid', async () => {
            expect(await clampParam(0, DEFAULT_TOTAL_PLAYERS)).toEqual(
                DEFAULT_TOTAL_PLAYERS
            );
            expect(await clampParam(null, DEFAULT_TOTAL_PLAYERS)).toEqual(
                DEFAULT_TOTAL_PLAYERS
            );
            expect(await clampParam(undefined, DEFAULT_TOTAL_PLAYERS)).toEqual(
                DEFAULT_TOTAL_PLAYERS
            );
            expect(
                await clampParam(Number('test'), DEFAULT_TOTAL_PLAYERS)
            ).toEqual(DEFAULT_TOTAL_PLAYERS);
        });
    });

    describe('handleQueryParams', () => {
        it('should return back default properties with undefined/null arguments', async () => {
            expect(await handleQueryParams()).toMatchObject(
                EXPECTED_PARAM_RETURN
            );
        });

        it('should return back same params when entered as individual numbers', async () => {
            expect(await handleQueryParams(2, 1)).toMatchObject(
                EXPECTED_PARAM_RETURN
            );
        });

        it('should return params when submitted as HTTP Request', async () => {
            expect(await handleQueryParams(MOCK_QUERY_PARAMS)).toMatchObject(
                EXPECTED_PARAM_RETURN
            );
        });
    });

    describe('Game Status Checkers', () => {
        describe('hasJustStarted', () => {
            it('should return boolean to confirm current status', async () => {
                expect(await hasJustStarted(GAME_JUST_STARTED)).toBe(true);
                expect(await hasJustStarted(IN_PROGRESS)).toBe(false);
                expect(await hasJustStarted(GAME_OVER)).toBe(false);
            });
        });

        describe('isGameOver', () => {
            describe('should return boolean value based on', () => {
                it('current status', async () => {
                    expect(await isGameOver(GAME_JUST_STARTED)).toBe(false);
                    expect(await isGameOver(IN_PROGRESS)).toBe(false);
                    expect(await isGameOver(GAME_OVER)).toBe(true);
                });

                it('number of active players', async () => {
                    expect(await isGameOver(IN_PROGRESS, ONE_PLAYER)).toBe(
                        true
                    );
                    expect(await isGameOver(IN_PROGRESS, TWO_PLAYERS)).toBe(
                        false
                    );
                });
            });
        });

        describe('isInProgress', () => {
            it('should return boolean to confirm current status', async () => {
                expect(await isInProgress(GAME_JUST_STARTED)).toBe(false);
                expect(await isInProgress(IN_PROGRESS)).toBe(true);
                expect(await isInProgress(GAME_OVER)).toBe(false);
            });
        });
    });

    describe('isGame', () => {
        beforeEach(() => ([game] = setupGameWithWinner()));

        it('should return the proper booelan value dependent on card argument', async () => {
            expect(await isGame(game)).toBe(true);
            expect(await isGame(failMock)).toBe(false);
        });
    });

    describe('isGameData', () => {
        beforeEach(
            () => ({ mockGameData, gameOptionalProps } = setupMockGamesData())
        );

        it('should return TRUE boolean with default params', async () => {
            expect(await isGameData(mockGameData)).toBe(true);
        });

        it('should return TRUE boolean with optional properties', async () => {
            expect(await isGameData(gameOptionalProps)).toBe(true);
        });

        it('should return FALSE boolean with invalid players', async () => {
            expect(await isGameData(failGameData)).toBe(false);
        });
    });

    describe('isNewGameSaved', () => {
        describe('should return a boolean value based on the entered argument', () => {
            it('boolean type argument', async () => {
                expect(await isNewGameSaved(false)).toBe(false);
                expect(await isNewGameSaved(true)).toBe(true);
            });

            it('populated NewGameResponse argument', async () => {
                expect(await isNewGameSaved({ id: MOCK_GAME_ID })).toBe(true);
                expect(await isNewGameSaved({})).toBe(false);
            });
        });
    });

    describe('toJsonFilter', () => {
        it('should return boolean value based on GameData property value', async () => {
            expect(await toJsonFilter(undefined)).toBe(true);
            expect(await toJsonFilter([])).toBe(true);
            expect(await toJsonFilter('TEST')).toBe(false);
        });
    });
});
