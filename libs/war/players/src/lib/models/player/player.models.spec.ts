import { Card, STANDARD_DECK_SIZE } from '@card-games-api/decks';
import { TEST_DECK } from '@card-games-api/decks/testing';
import { size, subtract } from 'lodash';

import {
    playerOneData,
    setupCardlessPlayer,
    setupSingleFullyLoadedPlayer
} from '../../../testing';
import { Player } from './player.models';

let player: Player;

describe('Player', () => {
    describe('constructor', () => {
        it('should create instance successfully with NUMBER input', async () => {
            expect(await new Player(0)).toBeTruthy();
        });

        it('should create instance successfully with PlayerData input', async () => {
            expect(await new Player(playerOneData)).toBeTruthy();
        });
    });

    describe('properties should properly handle values', () => {
        beforeEach(() => (player = setupCardlessPlayer()));

        it('isDeckEmpty', async () => {
            expect(player.isDeckEmpty).toBe(true);
        });

        it('deckSize', async () => {
            expect(player.deckSize).toEqual(0);
        });
    });

    describe('addCards', () => {
        beforeEach(() => (player = setupCardlessPlayer()));

        it('should add cards, shuffle deck, and be chainable', async () => {
            expect(player.deckSize).toEqual(0);
            await player.addCards(TEST_DECK);
            expect(player.deckSize).toEqual(size(TEST_DECK));
        });
    });

    describe('drawCards', () => {
        beforeEach(() => (player = setupSingleFullyLoadedPlayer()));

        it('should draw default single card from deck', async () => {
            const hand: Card[] = await player.drawCards();

            expect(hand).toHaveLength(1);
            expect(player.deckSize).toEqual(
                subtract(STANDARD_DECK_SIZE, size(hand))
            );
        });

        it('should draw cards and then shuffle deck', async () => {
            const totalRequestedCards = 2;
            const hand: Card[] = await player.drawCards(totalRequestedCards);

            expect(hand).toHaveLength(totalRequestedCards);
            expect(player.deckSize).toEqual(
                subtract(STANDARD_DECK_SIZE, size(hand))
            );
        });
    });

    describe('toJson', () => {
        beforeEach(() => (player = setupCardlessPlayer()));

        it('should return JSON object', async () => {
            expect(await player.toJson()).toMatchObject(playerOneData);
        });
    });
});
