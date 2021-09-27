import { remainderOf } from '@card-games-api/utils';
import _, { chain, every, isEmpty, lte, multiply, size } from 'lodash';

import {
    EACH_DECK_VARIANT,
    EACH_DECK_VARIANT_WITH_NEGATIVE,
    getCardsFromFullDeck,
    hashCard,
    KING_OF_HEARTS,
    QUEEN_DECK,
    QUEEN_OF_HEARTS,
    QUEEN_OF_SPADES,
    TEST_DECK,
    TEST_DECK_DATA
} from '../../../testing';
import { EMPTY_DECK, ONE_DECK, STANDARD_DECK_SIZE } from '../../constants';
import { Card, Deck } from '../../models';
import { DeckBuilderOptions, Ranks } from '../../types';
import {
    addDeck,
    buildDeck,
    findCards,
    getEmptyDeck,
    getHighCards,
    getNewDeck,
    getTotalCards,
    getValidDeckTotal,
    hasCard,
    hasExactCards,
    isDeck,
    isDeckEmpty,
    isEmptyStarter,
    isFullStarter,
    isOnlyOneCard,
    isQueriedCard,
    loadExistingDeck
} from './deck.helpers';

const { FIVE, KING, QUEEN } = Ranks;
const { EMPTY_STARTER, FULL_STARTER } = DeckBuilderOptions;

describe('Deck Helpers', () => {
    describe('addDeck', () => {
        it('should return payload', async () => {
            const deckToAdd: Card[] = getCardsFromFullDeck();
            const expectedAddedSize: number = chain(deckToAdd)
                .size()
                .add(STANDARD_DECK_SIZE)
                .value();
            expect(size(await addDeck(deckToAdd))).toEqual(expectedAddedSize);
        });
    });

    describe('buildDeck', () => {
        describe('should build deck', () => {
            it('without crashing', async () => {
                expect(await buildDeck()).toBeTruthy();
            });

            it('with the standard number of cards for a single playing card deck (52)', async () => {
                expect(size(await buildDeck())).toEqual(STANDARD_DECK_SIZE);
            });

            it('with absolutely no duplidate cards', async () => {
                const totalUniqueCards: number = chain(await buildDeck())
                    .uniq()
                    .size()
                    .value();
                expect(totalUniqueCards).toEqual(STANDARD_DECK_SIZE);
            });
        });
    });

    describe('findCards', () => {
        it('should generate array of Card objects without crahsing', async () => {
            expect(findCards(TEST_DECK, 'rank', KING)).toBeTruthy();
        });

        it('should return only cards matching the requested query', async () => {
            const responseCards: Card[] = findCards(TEST_DECK, 'rank', QUEEN);
            expect(every(responseCards, { rank: QUEEN })).toBe(true);
        });
    });

    describe('getEmptyDeck', () => {
        it('should return new instance of an empty Card instace array', async () => {
            expect(isEmpty(await getEmptyDeck())).toBe(true);
        });

        it('should be a cloned instance value and not the reference -- edits to one not affecting the other', async () => {
            const emptyDeckOne: Card[] = await getEmptyDeck();

            expect(emptyDeckOne).toMatchObject(EMPTY_DECK);
            expect(size(emptyDeckOne)).toEqual(0);

            emptyDeckOne.push(KING_OF_HEARTS);

            const emptyDeckTwo: Card[] = await getEmptyDeck();

            expect(emptyDeckTwo).toMatchObject(EMPTY_DECK);
            expect(size(emptyDeckTwo)).toEqual(0);
        });
    });

    describe('getHighCards', () => {
        it('should return the highest valued card in stack', async () => {
            expect(await getHighCards(TEST_DECK)).toMatchObject([
                KING_OF_HEARTS
            ]);
        });

        it('should return multiple cards with that possess the same max value', async () => {
            expect(await getHighCards(QUEEN_DECK)).toMatchObject([
                QUEEN_OF_HEARTS,
                QUEEN_OF_SPADES
            ]);
        });

        it('should return empty array if there are no cards to search through', async () => {
            expect(await getHighCards(EMPTY_DECK)).toMatchObject(EMPTY_DECK);
        });
    });

    describe('getNewDeck', () => {
        it('should run method without crashing', async () => {
            expect(await getNewDeck()).toBeTruthy();
        });

        it('should shuffle deck immediately after generating it', async () => {
            jest.spyOn(_, 'shuffle');
            await getNewDeck();
            expect(_.shuffle).toHaveBeenCalledTimes(1);
        });

        jest.retryTimes(2);
        describe.each(EACH_DECK_VARIANT)(
            'should return the correct Card instance array',
            (request: number) => {
                describe(`when requesting for ${request} decks`, () => {
                    it('should return with cards equal or greater than a single standard deck (52 cards)', async () => {
                        expect(
                            size(await getNewDeck(request))
                        ).toBeGreaterThanOrEqual(STANDARD_DECK_SIZE);
                    });

                    it('should be divisible cleanly by the standard deck size (52 cards)', async () => {
                        const totalCards: number = size(
                            await getNewDeck(request)
                        );
                        expect(
                            remainderOf(totalCards, STANDARD_DECK_SIZE)
                        ).toEqual(0);
                    });

                    it('should be divisible cleanly by the standard deck size (52 cards)', async () => {
                        const totalCards: number = size(
                            await getNewDeck(request)
                        );
                        expect(
                            remainderOf(totalCards, STANDARD_DECK_SIZE)
                        ).toEqual(0);
                    });

                    it('should have a unique card to deck total request ration of one-to-one', async () => {
                        const totalUniqueCards: number = chain(
                            await getNewDeck(request)
                        )
                            .map(hashCard)
                            .uniq()
                            .size()
                            .value();
                        expect(totalUniqueCards).toEqual(STANDARD_DECK_SIZE);
                    });
                });
            }
        );
    });

    describe('getTotalCards', () => {
        jest.retryTimes(2);
        describe.each(EACH_DECK_VARIANT)(
            'should return number of total cards expected to be',
            (totalDecks: number) => {
                it(`in ${totalDecks} decks`, async () => {
                    expect(await getTotalCards(totalDecks)).toBe(
                        multiply(STANDARD_DECK_SIZE, totalDecks)
                    );
                });
            }
        );
    });

    describe('getValidDeckTotal', () => {
        jest.retryTimes(2);
        describe.each(EACH_DECK_VARIANT_WITH_NEGATIVE)(
            'when entered with a total decks request of',
            (request: number) => {
                describe(`${request} decks`, () => {
                    it('should return a deck total number greater or equal than ONE DECK', async () => {
                        expect(
                            await getValidDeckTotal(request)
                        ).toBeGreaterThanOrEqual(ONE_DECK);
                    });

                    it('should return entered value if valid', async () => {
                        const expectedDecksTotal: number = lte(
                            request,
                            ONE_DECK
                        )
                            ? ONE_DECK
                            : request;
                        expect(await getValidDeckTotal(request)).toEqual(
                            expectedDecksTotal
                        );
                    });
                });
            }
        );
    });

    describe('hasCard', () => {
        describe('should return boolean of', () => {
            it('TRUE if card is found in array', async () => {
                expect(await hasCard(TEST_DECK, 'rank', KING)).toBe(true);
            });

            it('FALSE if card CANNOT be found in array', async () => {
                expect(await hasCard(TEST_DECK, 'rank', FIVE)).toBe(false);
            });
        });
    });

    describe('hasExactCards', () => {
        describe('should return boolean of', () => {
            it('TRUE if card array size matches requirement', async () => {
                expect(await hasExactCards(TEST_DECK, size(TEST_DECK))).toBe(
                    true
                );
            });

            it('FALSE if card does NOT match requirement', async () => {
                expect(await hasExactCards(TEST_DECK, 1)).toBe(false);
            });
        });
    });

    describe('isDeck', () => {
        it("should return boolean based on whether it's a deck instance or not", async () => {
            expect(await isDeck(new Deck(FULL_STARTER))).toBe(true);
            expect(await isDeck(TEST_DECK)).toBe(false);
        });
    });

    describe('isDeckEmpty', () => {
        it('should return TRUE if array is empty, null, or undefined', async () => {
            expect(await isDeckEmpty([])).toBe(true);
            expect(await isDeckEmpty(null)).toBe(true);
            expect(await isDeckEmpty(undefined)).toBe(true);
        });

        it('should return FALSE if array has any valid entries', async () => {
            expect(await isDeckEmpty(TEST_DECK)).toBe(false);
        });
    });

    describe('DeckBuilderOption Checkers', () => {
        describe('isEmptyStarter', () => {
            it('should return proper boolean value', async () => {
                expect(await isEmptyStarter(EMPTY_STARTER)).toBe(true);
                expect(await isEmptyStarter(FULL_STARTER)).toBe(false);
            });
        });

        describe('isFullStarter', () => {
            it('should return proper boolean value', async () => {
                expect(await isFullStarter(EMPTY_STARTER)).toBe(false);
                expect(await isFullStarter(FULL_STARTER)).toBe(true);
            });
        });
    });

    describe('isOnlyOneCard', () => {
        describe('should return proper boolean value when the entered argument is', () => {
            it('undefined', async () => {
                expect(await isOnlyOneCard(undefined)).toBe(false);
            });

            it('a Card array', async () => {
                expect(await isOnlyOneCard(TEST_DECK)).toBe(false);
                expect(await isOnlyOneCard([KING_OF_HEARTS])).toBe(true);
            });

            it('a primitive number', async () => {
                expect(await isOnlyOneCard(1)).toBe(true);
                expect(await isOnlyOneCard(2)).toBe(false);
            });
        });
    });

    describe('isQueriedCard', () => {
        it('should return boolean if card properties match asserted card object', async () => {
            expect(await isQueriedCard(KING_OF_HEARTS, 'rank', KING)).toBe(
                true
            );
            expect(await isQueriedCard(KING_OF_HEARTS, 'rank', FIVE)).toBe(
                false
            );
        });
    });

    describe('loadExistingDeck', () => {
        it('should return payload', async () => {
            expect(await loadExistingDeck(TEST_DECK_DATA)).toMatchObject(
                TEST_DECK_DATA
            );
        });
    });
});
