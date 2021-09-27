import { STANDARD_DECK_SIZE } from '@card-games-api/decks';
import { TEST_DECK } from '@card-games-api/decks/testing';

import {
    players as mockPlayers,
    setupFullyLoadedPlayers
} from '../../../testing';
import { Player } from '../../models/player';
import {
    enoughCardsPerPlayer,
    shuffleIfDecksAreIdentical
} from './dealer.helpers';

let players: Player[];

describe('Dealer Helpers', () => {
    describe('enoughCardsPerPlayer', () => {
        it('should return boolean dependent on total players versus total cards', async () => {
            expect(await enoughCardsPerPlayer(2, 2)).toBe(true);
            expect(await enoughCardsPerPlayer(mockPlayers, TEST_DECK)).toBe(
                true
            );
            expect(await enoughCardsPerPlayer(2, STANDARD_DECK_SIZE)).toBe(
                true
            );
        });
    });

    describe('shuffleIfDecksAreIdentical', () => {
        beforeEach(() => (players = setupFullyLoadedPlayers()));

        it('should reshuffle deck until decks are different', async () => {
            const [playerOne, playerTwo] = await shuffleIfDecksAreIdentical(
                players
            );
            expect(playerOne.getDeck()).not.toEqual(playerTwo.getDeck());
        });
    });
});
