import { size } from 'lodash';

import {
    deckCountToCardCount,
    mockDecksSetup,
    EACH_DECK_VARIANT,
    TEST_DECK_DATA,
    TEST_DECK
} from '../../../testing';
import { STANDARD_DECK_SIZE } from '../../constants';
import { isCardDataArray } from '../../helpers/card';
import { CardData, DeckBuilderOptions } from '../../types';
import { Card } from '../card';
import { Deck } from './deck.models';

const { EMPTY_STARTER, FULL_STARTER } = DeckBuilderOptions;

describe('Deck', () => {
    describe('should construct instance without crahsing with', () => {
        it('DEFAULT (no arguments)', async () => {
            expect(await new Deck()).toBeInstanceOf(Deck);
        });

        it('EMPTY_STARTER argument', async () => {
            expect(await new Deck(EMPTY_STARTER)).toBeInstanceOf(Deck);
        });

        it('FULL_DECK_VARIANT', async () => {
            expect(await new Deck(FULL_STARTER)).toBeInstanceOf(Deck);
        });

        it('CardData', async () => {
            expect(await new Deck(TEST_DECK_DATA)).toBeInstanceOf(Deck);
        });

        describe.each(EACH_DECK_VARIANT)(
            'entered request parameters of',
            (request: number) => {
                it(`${request} total decks`, async () => {
                    const deck: Deck = await new Deck(FULL_STARTER, request);
                    expect(deck).toBeInstanceOf(Deck);
                    expect(deck.size).toEqual(
                        await deckCountToCardCount(request)
                    );
                });
            }
        );
    });

    describe('size', () => {
        it('should return the correct number value dependency on length of array/deck', async () => {
            const { dealerDeck, playerDeck } = mockDecksSetup();
            expect(dealerDeck.size).toEqual(STANDARD_DECK_SIZE);
            expect(playerDeck.size).toEqual(0);
        });
    });

    describe('addCards', () => {
        it('should return the correct number value dependency on length of array/deck', async () => {
            const { playerDeck: deck } = mockDecksSetup();
            const response: Deck = await deck.addCards(TEST_DECK);
            expect(response).toMatchObject(deck);
            expect(deck.size).toEqual(size(TEST_DECK));
        });
    });

    describe('clear', () => {
        it('should empty out the deck', async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            await deck.clear();
            expect(deck.isEmpty).toBe(true);
            expect(deck.size).toEqual(0);
        });
    });

    describe('clearDeckHolder', () => {
        it('should empty out the deck', async () => {
            const { assignedDeck: deck } = mockDecksSetup();
            expect(await deck.clearDeckHolder()).toBeTruthy();

            const responseDeck: Card[] = await deck.take();

            for (const responseCard of responseDeck) {
                expect(responseCard.getHolderName()).toBeNull();
            }
        });
    });

    describe('drawCards', () => {
        it('should return the correct number value dependency on length of array/deck', async () => {
            const totalCards = 3;

            const { dealerDeck: deck } = mockDecksSetup();

            const hand: Card[] = await deck.drawCards(totalCards);
            expect(size(hand)).toEqual(totalCards);

            const finalDeckSize = STANDARD_DECK_SIZE - totalCards;
            expect(deck.size).toEqual(finalDeckSize);
        });

        it('should draw cards without any arguments entered', async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            expect(await deck.drawCards()).toBeTruthy();
        });
    });

    describe('get', () => {
        it('should return the correct number value dependency on length of array/deck', async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            const response: Card[] = await deck.get();
            expect(response.length).toEqual(STANDARD_DECK_SIZE);
            expect(deck.isEmpty).toBe(false);
        });
    });

    describe('replace', () => {
        it("should replace the deck with what's given", async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            expect(deck.size).toEqual(STANDARD_DECK_SIZE);

            await deck.replace(TEST_DECK);
            expect(deck.size).toEqual(TEST_DECK.length);
        });
    });

    describe('shuffle', () => {
        it('should call service to shuffle deck and return instance', async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            expect(await deck.shuffle()).toBeTruthy();
        });
    });

    describe('take', () => {
        it('should return the correct number value dependency on length of array/deck', async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            const response: Card[] = await deck.take();
            expect(response.length).toEqual(STANDARD_DECK_SIZE);
            expect(deck.isEmpty).toBe(true);
        });
    });

    describe('toJson', () => {
        it('should return JSON CardData array payload', async () => {
            const { dealerDeck: deck } = mockDecksSetup();
            const payload: CardData[] = await deck.toJson();
            expect(await isCardDataArray(payload)).toBe(true);
        });
    });
});
