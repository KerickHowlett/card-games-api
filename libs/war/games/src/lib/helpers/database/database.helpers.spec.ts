import { FindByID } from '@card-games-api/database/nedb';
import {
    expectedStatusPrintOut,
    mockErrorMessage
} from '@card-games-api/utils/testing';

import {
    EXPECTED_GAME_QUERY,
    MOCK_GAME_ID,
    setupGameAndGameData,
    setupMockGameData,
    TOO_MANY_UPDATES_MOCK,
    UPDATE_SUCCESS_MOCK
} from '../../../testing';
import { Game } from '../../models';
import { GameData, GameIDStates } from '../../types';
import { isGameData } from '../games';
import {
    createDatabaseError,
    getQueryId,
    hasWhichIdState,
    isHasNeither,
    isNoUnderscore,
    isWithUnderscore,
    remapIdProperty,
    removeIdProperties,
    updateSuccessful
} from './database.helpers';

const { HasNeither, NoUnderscore, WithUnderscore } = GameIDStates;

let game: Game;
let gameData: GameData;
let gameDataWithMockId: GameData;
let gameDataWithMockUnderscoreId: GameData;

describe('Database Helpers', () => {
    describe('createDatabaseError', () => {
        it('should create error', async () => {
            expect(String(await createDatabaseError(mockErrorMessage))).toEqual(
                expectedStatusPrintOut()
            );
        });
    });

    describe('getQueryId', () => {
        describe("should return object with _id property & it's proper value based on", () => {
            beforeEach(() => (gameData = setupMockGameData(MOCK_GAME_ID)));

            it('GameData argument (WITHOUT UNDERSCORE ID)', async () => {
                const query: FindByID = await getQueryId(gameData);

                expect(query).toMatchObject(EXPECTED_GAME_QUERY);
                expect(query).toHaveProperty('_id', MOCK_GAME_ID);
            });

            it('GameData argument (WITH UNDERSCORE ID)', async () => {
                const gameDataArg: GameData = {
                    ...gameData,
                    _id: MOCK_GAME_ID
                };
                const query: FindByID = await getQueryId(gameDataArg);

                expect(query).toMatchObject(EXPECTED_GAME_QUERY);
                expect(query).toHaveProperty('_id', MOCK_GAME_ID);
            });

            it('primitive string argument', async () => {
                const query: FindByID = await getQueryId(MOCK_GAME_ID);
                expect(query).toMatchObject(EXPECTED_GAME_QUERY);
                expect(query).toHaveProperty('_id', MOCK_GAME_ID);
            });
        });
    });

    describe('Game ID State Helpers', () => {
        describe('hasWhichIdState', () => {
            describe('should return the correct GameIDState of', () => {
                beforeEach(
                    () =>
                        ({
                            gameData,
                            gameDataWithMockId,
                            gameDataWithMockUnderscoreId
                        } = setupGameAndGameData())
                );

                it('WithUnderscore', async () => {
                    expect(
                        await hasWhichIdState(gameDataWithMockUnderscoreId)
                    ).toEqual(WithUnderscore);
                });

                it('NoUnderscore', async () => {
                    expect(await hasWhichIdState(gameDataWithMockId)).toEqual(
                        NoUnderscore
                    );
                });

                it('HasNeither', async () => {
                    expect(await hasWhichIdState(gameData)).toEqual(HasNeither);
                });
            });
        });

        describe('isHasNeither', () => {
            it('should return a boolean based on whether or not the entered type matches', async () => {
                expect(await isHasNeither(HasNeither)).toBe(true);
                expect(await isHasNeither(NoUnderscore)).toBe(false);
                expect(await isHasNeither(WithUnderscore)).toBe(false);
            });
        });

        describe('isNoUnderscore', () => {
            it('should return a boolean based on whether or not the entered type matches', async () => {
                expect(await isNoUnderscore(HasNeither)).toBe(false);
                expect(await isNoUnderscore(NoUnderscore)).toBe(true);
                expect(await isNoUnderscore(WithUnderscore)).toBe(false);
            });
        });

        describe('isWithUnderscore', () => {
            it('should return a boolean based on whether or not the entered type matches', async () => {
                expect(await isWithUnderscore(HasNeither)).toBe(false);
                expect(await isWithUnderscore(NoUnderscore)).toBe(false);
                expect(await isWithUnderscore(WithUnderscore)).toBe(true);
            });
        });
    });

    describe('remapIdProperty', () => {
        beforeEach(
            () =>
                ({
                    gameData,
                    gameDataWithMockId,
                    gameDataWithMockUnderscoreId
                } = setupGameAndGameData())
        );

        it('when GameData has neither ID property, return JSON data object as-is', async () => {
            expect(await remapIdProperty(gameData)).toMatchObject(gameData);
        });

        it('when GameData has _id (with underscore) property, return back object with id (without underscore) property', async () => {
            expect(
                await remapIdProperty(gameDataWithMockUnderscoreId)
            ).toMatchObject(gameDataWithMockId);
        });

        it('when GameData has id (without underscore) property, return back object with _id (with underscore) property', async () => {
            expect(await remapIdProperty(gameDataWithMockId)).toMatchObject(
                gameDataWithMockUnderscoreId
            );
        });
    });

    describe('removeIdProperties', () => {
        beforeEach(() => ({ game, gameData } = setupGameAndGameData()));

        it('should maintain all needed properties & values', async () => {
            expect(await removeIdProperties(gameData)).toMatchObject(gameData);
        });

        it('should convert to GameData JSON object if entered as Game instance', async () => {
            expect(isGameData(await removeIdProperties(game))).toBeTruthy();
        });

        it('should process GameData without crashing', async () => {
            expect(isGameData(await removeIdProperties(gameData))).toBeTruthy();
        });

        describe('should have neither ID property set to GameData', () => {
            beforeEach(
                () =>
                    ({
                        gameData,
                        gameDataWithMockId,
                        gameDataWithMockUnderscoreId
                    } = setupGameAndGameData())
            );

            it('_id (with underscore) property', async () => {
                const remappedGameData: GameData = await removeIdProperties(
                    gameDataWithMockId
                );

                expect(remappedGameData).not.toHaveProperty('id');
                expect(remappedGameData).not.toHaveProperty('_id');
            });

            it('id (without underscore) property', async () => {
                const remappedGameData: GameData = await removeIdProperties(
                    gameDataWithMockUnderscoreId
                );

                expect(remappedGameData).not.toHaveProperty('id');
                expect(remappedGameData).not.toHaveProperty('_id');
            });

            it('without either ID property', async () => {
                const remappedGameData: GameData = await removeIdProperties(
                    gameData
                );

                expect(remappedGameData).not.toHaveProperty('id');
                expect(remappedGameData).not.toHaveProperty('_id');
            });
        });
    });

    describe('updateSuccessful', () => {
        it('should return boolean based on number of updated records', async () => {
            expect(await updateSuccessful({})).toBe(false);
            expect(await updateSuccessful(TOO_MANY_UPDATES_MOCK)).toBe(false);
            expect(await updateSuccessful(UPDATE_SUCCESS_MOCK)).toBe(true);
        });
    });
});
