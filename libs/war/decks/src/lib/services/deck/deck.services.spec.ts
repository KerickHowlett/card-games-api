import _, { cloneDeep, every, multiply, size, subtract } from 'lodash';

import {
    EACH_DECK_VARIANT,
    mockDecksSetup,
    TEST_DECK_DATA,
    TEST_DECK
} from '../../../testing';
import { STANDARD_DECK_SIZE, TWO_CARDS } from '../../constants';
import { buildDeck, getEmptyDeck, isCardDataArray } from '../../helpers';
import { Card } from '../../models/card';
import { CardData, DeckBuilderOptions } from '../../types';
import { DeckServices as services } from './deck.services';

const { EMPTY_STARTER, FULL_STARTER } = DeckBuilderOptions;

jest.spyOn(_, 'shuffle');

let cards: Card[];

describe('DeckServices', () => {
    it('should initialize without crashing', async () => services);

    describe('addCards', () => {
        beforeEach(() => (cards = buildDeck()));

        it('should append cards to array', async () => {
            const appendedCards: Card[] = await services.addCards([], cards);
            expect(appendedCards).toHaveLength(size(cards));
        });
    });

    describe('clearDeckHolder', () => {
        beforeEach(() => {
            const { assignedDeck } = mockDecksSetup();
            cards = assignedDeck.get();
        });

        it('should empty out the deck', async () => {
            const sanitizedCards: Card[] = await services.clearDeckHolderName(
                cards
            );
            expect(every(sanitizedCards, { holderName: undefined })).toBe(true);
        });
    });

    describe('drawCards', () => {
        beforeEach(() => (cards = buildDeck()));

        it('should return the correct number value dependency on length of array/deck', async () => {
            const [hand, newDeck] = await services.drawCards(TWO_CARDS, cards);

            expect(hand).toHaveLength(TWO_CARDS);
            expect(newDeck).toHaveLength(
                subtract(STANDARD_DECK_SIZE, TWO_CARDS)
            );
        });
    });

    describe('getCards', () => {
        beforeEach(() => (cards = buildDeck()));

        it('should return the correct number value dependency on length of array/deck', async () => {
            expect(await services.getCards(cards)).toMatchObject(cards);
        });
    });

    describe('getDeck', () => {
        it('should return an empty deck if DeckBuilderOption is EMPTY_STARTER', async () => {
            const deck: Card[] = await services.getDeck(EMPTY_STARTER);
            expect(size(deck)).toEqual(0);
            expect(deck).toMatchObject(await getEmptyDeck());
        });

        it('should return deck from previously existing game data', async () => {
            const deck: Card[] = await services.getDeck(TEST_DECK_DATA);
            expect(size(deck)).toEqual(size(TEST_DECK));
        });

        describe('should return a fully stacked deck if DeckBuilderOption is FULL_STARTER', () => {
            it('WITHOUT number of decks argument', async () => {
                const deck: Card[] = await services.getDeck(FULL_STARTER);
                expect(size(deck)).toEqual(STANDARD_DECK_SIZE);
            });

            describe.each(EACH_DECK_VARIANT)(
                'WITH number of decks argument of',
                (totalDecks: number) => {
                    jest.retryTimes(2);
                    it(`WITH ${totalDecks} decks`, async () => {
                        const expectDeckSize: number = multiply(
                            totalDecks,
                            STANDARD_DECK_SIZE
                        );
                        const deck: Card[] = await services.getDeck(
                            FULL_STARTER,
                            totalDecks
                        );
                        expect(size(deck)).toEqual(expectDeckSize);
                    });
                }
            );
        });
    });

    describe('replace', () => {
        it('should return with the desired deck', async () => {
            expect(await services.replace(TEST_DECK)).toMatchObject(TEST_DECK);
        });

        it('should return with clean & empty deck without deck argument', async () => {
            expect(await services.replace()).toMatchObject(getEmptyDeck());
        });

        it('should load deck from CardData array', async () => {
            expect(await services.replace(TEST_DECK_DATA)).toMatchObject(
                TEST_DECK
            );
        });
    });

    describe('shuffle', () => {
        beforeEach(() => (cards = buildDeck()));

        it('should shuffle deck and return deck', async () => {
            jest.clearAllMocks();
            expect(cloneDeep(await services.shuffle(cards))).not.toMatchObject(
                cards
            );
            expect(_.shuffle).toHaveBeenCalledTimes(1);
            expect(_.shuffle).toHaveBeenCalledWith(cards);
        });
    });

    describe('take', () => {
        beforeEach(() => (cards = buildDeck()));

        it('should return the correct number value dependency on length of array/deck', async () => {
            expect(await services.take(cards)).toMatchObject([cards, []]);
        });
    });

    describe('toJson', () => {
        beforeEach(() => (cards = buildDeck()));

        it('should return JSON CardData array payload', async () => {
            const cardData: CardData[] = await services.toJson(cards);
            expect(await isCardDataArray(cardData)).toBe(true);
        });
    });
});
