import { Card, STANDARD_DECK_SIZE } from '@card-games-api/decks';
import {
    assignTestCards,
    clearTestCards,
    holderNameIs,
    TEST_DECK
} from '@card-games-api/decks/testing';
import { failObject } from '@card-games-api/utils/testing';

import {
    MIN_PLAYERS,
    playerOne,
    playerOneData,
    players,
    setupPlayersWithNoCards,
    setupSomeEmptyPlayers
} from '../../../testing';
import { PLAYER_ONE_NAME, PLAYER_TWO_NAME } from '../../constants';
import { Player } from '../../models';
import {
    createPlayer,
    enoughPlayers,
    hasPlayers,
    indexToName,
    isEveryPlayerDeckEmpty,
    isPlayer,
    isPlayerArray,
    isPlayerData,
    isPlayerDataArray,
    isQueriedPlayer,
    isTwoPlayers,
    onlyOnePlayer,
    setNameToCards,
    tooManyPlayers
} from './player.helpers';

let assignedCards: Card[];
let mockCards: Card[] = TEST_DECK;
let loadedPlayer: Player;
let semiLoadedPlayers: Player[];

describe('Player Helpers', () => {
    describe('createPlayer', () => {
        describe('should initiate instance without crashing with argument of', () => {
            it('primitive number', async () => {
                expect(await createPlayer(0)).toBeTruthy();
            });

            it('PlayerData JSON Object', async () => {
                expect(await createPlayer(playerOneData)).toBeTruthy();
            });
        });
    });

    describe('enoughPlayers', () => {
        it('should return the proper boolean value based on the number of players entered', async () => {
            expect(await enoughPlayers(3, MIN_PLAYERS)).toBe(true);
            expect(await enoughPlayers(1, MIN_PLAYERS)).toBe(false);
            expect(await enoughPlayers(0, MIN_PLAYERS)).toBe(false);
            expect(await enoughPlayers(-5, MIN_PLAYERS)).toBe(false);
        });
    });

    describe('hasPlayers', () => {
        it('should return boolean based on entered number', async () => {
            expect(await hasPlayers(players)).toBe(true);
            expect(await hasPlayers([])).toBe(false);
            expect(await hasPlayers(-1)).toBe(false);
        });
    });

    describe('isEveryPlayerDeckEmpty', () => {
        describe('should return a boolean value of', () => {
            it("FALSE if every player's deck is NOT empty", async () => {
                const semiLoadedPlayers: Player[] = setupSomeEmptyPlayers();
                expect(await isEveryPlayerDeckEmpty(semiLoadedPlayers)).toBe(
                    false
                );
            });

            it("TRUE if every player's deck still contains cards", async () => {
                const playersWithEmptyDecks: Player[] =
                    setupPlayersWithNoCards();
                expect(
                    await isEveryPlayerDeckEmpty(playersWithEmptyDecks)
                ).toBe(true);
            });
        });
    });

    describe('indexToName', () => {
        it('should take in player index number and convert it to readable player name', async () => {
            expect(await indexToName(0)).toEqual(PLAYER_ONE_NAME);
            expect(await indexToName(1)).toEqual(PLAYER_TWO_NAME);
        });
    });

    describe('isPlayerData', () => {
        beforeEach(() => (semiLoadedPlayers = setupSomeEmptyPlayers()));

        it('should return proper boolean value based on input', async () => {
            expect(await isPlayerData(playerOneData)).toBe(true);
            expect(await isPlayerData(failObject)).toBe(false);
        });
    });

    describe('isPlayerDataArray', () => {
        beforeEach(() => (semiLoadedPlayers = setupSomeEmptyPlayers()));

        describe('should return proper boolean value based on input', () => {
            it('should return TRUE if all elements are PlayerData bbjects', async () => {
                expect(
                    await isPlayerDataArray([playerOneData, playerOneData])
                ).toBe(true);
            });

            it('should return FALSE if just a single object -- PlayerData or otherwise', async () => {
                expect(await isPlayerDataArray(playerOneData)).toBe(false);
                expect(await isPlayerDataArray(failObject)).toBe(false);
            });

            it('should return FALSE if all elements are NOT PlayerData objects', async () => {
                expect(await isPlayerDataArray([failObject, failObject])).toBe(
                    false
                );
            });

            it('should return FALSE if even one element is NOT an PlayerData object', async () => {
                expect(
                    await isPlayerDataArray([playerOneData, failObject])
                ).toBe(false);
            });
        });
    });

    describe('isPlayer', () => {
        beforeEach(() => (semiLoadedPlayers = setupSomeEmptyPlayers()));

        it('should return proper boolean value based on input', async () => {
            expect(await isPlayer(playerOne)).toBe(true);
            expect(await isPlayer(failObject)).toBe(false);
        });
    });

    describe('isPlayerArray', () => {
        beforeEach(() => (semiLoadedPlayers = setupSomeEmptyPlayers()));

        describe('should return proper boolean value based on input', () => {
            it('should return TRUE if all elements are Player bbjects', async () => {
                expect(await isPlayerArray(semiLoadedPlayers)).toBe(true);
            });

            it('should return FALSE if just a single object -- Player or otherwise', async () => {
                expect(await isPlayerArray(playerOne)).toBe(false);
                expect(await isPlayerArray(failObject)).toBe(false);
            });

            it('should return FALSE if all elements are NOT Player objects', async () => {
                expect(await isPlayerArray([failObject, failObject])).toBe(
                    false
                );
            });

            it('should return FALSE if even one element is NOT an Player object', async () => {
                expect(await isPlayerArray([playerOne, failObject])).toBe(
                    false
                );
            });
        });
    });

    describe('isTwoPlayers', () => {
        describe('should determine if there is only one player based on the entered', () => {
            it('primitive number', async () => {
                expect(await isTwoPlayers(1)).toBe(false);
                expect(await isTwoPlayers(2)).toBe(true);
            });

            it('array of Player instances', async () => {
                expect(await isTwoPlayers(playerOne)).toBe(false);
                expect(await isTwoPlayers(semiLoadedPlayers)).toBe(true);
            });
        });
    });

    describe('onlyOnePlayer', () => {
        describe('should determine if there is only one player based on the entered', () => {
            beforeEach(() => (semiLoadedPlayers = setupSomeEmptyPlayers()));

            it('primitive number', async () => {
                expect(await onlyOnePlayer(1)).toBe(true);
                expect(await onlyOnePlayer(2)).toBe(false);
            });

            it('array of Player instances', async () => {
                expect(await onlyOnePlayer(semiLoadedPlayers[0])).toBe(true);
                expect(await onlyOnePlayer(semiLoadedPlayers)).toBe(false);
            });
        });
    });

    describe('isQueriedPlayer', () => {
        beforeEach(() => (loadedPlayer = setupSomeEmptyPlayers()[0]));

        it('should return boolean value based on number of entered players', async () => {
            expect(
                await isQueriedPlayer(loadedPlayer, 'name', PLAYER_ONE_NAME)
            ).toBe(true);
            expect(await isQueriedPlayer(loadedPlayer, 'name', 'derp')).toBe(
                false
            );
        });
    });

    describe('setNameToCards', () => {
        beforeEach(() => (mockCards = clearTestCards(mockCards)));
        afterEach(() => (mockCards = clearTestCards(mockCards)));

        it("should return cards with player's name assigned to each of them", async () => {
            expect(await holderNameIs(mockCards)).toBe(true);
            const responseCards: Card[] = await setNameToCards(
                mockCards,
                PLAYER_ONE_NAME
            );
            expect(await holderNameIs(responseCards, PLAYER_ONE_NAME)).toBe(
                true
            );
        });

        describe('should return null if the property is set with', () => {
            beforeEach(() => (assignedCards = assignTestCards()));

            afterAll(() => (assignedCards = clearTestCards(assignedCards)));

            it('NULL', async () => {
                const responseCards: Card[] = await setNameToCards(
                    assignedCards,
                    null
                );
                expect(await holderNameIs(responseCards)).toBe(true);
            });

            it('UNDEFINED', async () => {
                const responseCards: Card[] = await setNameToCards(
                    assignedCards,
                    undefined
                );
                expect(await holderNameIs(responseCards)).toBe(true);
            });

            it('an empty string', async () => {
                const responseCards: Card[] = await setNameToCards(
                    assignedCards,
                    ''
                );
                expect(await holderNameIs(responseCards)).toBe(true);
            });
        });
    });

    describe('tooManyPlayers', () => {
        it('should return the proper boolean value based on the number of players entered and the number of cards in the deck', async () => {
            expect(await tooManyPlayers(MIN_PLAYERS, STANDARD_DECK_SIZE)).toBe(
                false
            );
            expect(await tooManyPlayers(100, STANDARD_DECK_SIZE)).toBe(true);
        });
    });
});
