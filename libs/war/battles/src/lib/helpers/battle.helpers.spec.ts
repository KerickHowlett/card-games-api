import {
    players,
    deckWithAceAndTwo,
    KING_OF_HEARTS,
    TEST_DECK,
    TWO_CARD
} from '@card-games-api/decks/testing';
import { notEmpty, Player } from '@card-games-api/players';
import { setupFullyLoadedPlayers } from '@card-games-api/players/testing';
import { every, size } from 'lodash';

import {
    findWinningCards,
    hasAceAndTwo,
    ineligibleHandler,
    isTied
} from './battle.helpers';

describe('Battle Helpers', () => {
    describe('findWinningCards', () => {
        describe('should find the winning cards', () => {
            it('with no Ace card being a factor', async () => {
                expect(await findWinningCards(TEST_DECK)).toMatchObject([
                    KING_OF_HEARTS
                ]);
            });

            it('with both an Ace & Two cards', async () => {
                expect(await findWinningCards(deckWithAceAndTwo)).toMatchObject(
                    [TWO_CARD]
                );
            });
        });
    });

    describe('hasAceAndTwo', () => {
        it('should return boolean value based on if there is both an ace and two card', async () => {
            expect(await hasAceAndTwo(deckWithAceAndTwo)).toBe(true);
            expect(await hasAceAndTwo(TEST_DECK)).toBe(false);
        });
    });

    describe('ineligibleHandler', () => {
        it('return as-is if all players are eligible', async () => {
            const players: Player[] = setupFullyLoadedPlayers();

            const { updatedPlayers, thePot } = await ineligibleHandler(players);

            expect(every(updatedPlayers, notEmpty)).toBe(true);
            expect(size(thePot)).toEqual(0);
        });

        it('empty decks of those who do not have enough cards and add to pot contribution', async () => {
            const remainingDeckSize: number = players[0].deckSize;
            const { updatedPlayers, thePot } = await ineligibleHandler(
                players,
                500
            );

            expect(updatedPlayers[0].isDeckEmpty).toBe(true);
            expect(size(thePot)).toBeGreaterThanOrEqual(remainingDeckSize);
        });
    });

    describe('isTied', () => {
        it('should return boolean value based the number of entered cards', async () => {
            expect(await isTied(TEST_DECK)).toBe(true);
            expect(await isTied([KING_OF_HEARTS])).toBe(false);
        });
    });
});
