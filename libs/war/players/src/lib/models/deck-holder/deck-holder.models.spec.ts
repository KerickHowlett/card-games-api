import {
    Card,
    DeckBuilderOptions,
    STANDARD_DECK_SIZE
} from '@card-games-api/decks';
import { size } from 'lodash';

import { DeckHolder } from './deck-holder.models';

const { EMPTY_STARTER, FULL_STARTER } = DeckBuilderOptions;

describe('DeckHolder', () => {
    it('should be able to create instance without crashing', async () => {
        expect(await new DeckHolder(FULL_STARTER)).toBeTruthy();
        expect(await new DeckHolder(EMPTY_STARTER)).toBeTruthy();
    });

    describe('getters', () => {
        describe('return the proper values', () => {
            it('for fully stacked decks', async () => {
                const { deckSize, isDeckEmpty } = await new DeckHolder(
                    FULL_STARTER
                );
                expect(deckSize).toEqual(STANDARD_DECK_SIZE);
                expect(isDeckEmpty).toBe(false);
            });

            it('for empty decks', async () => {
                const { deckSize, isDeckEmpty } = await new DeckHolder(
                    EMPTY_STARTER
                );
                expect(deckSize).toEqual(0);
                expect(isDeckEmpty).toBe(true);
            });
        });
    });

    describe('clearDeck', () => {
        it("should clear the owner's deck and be chainable", async () => {
            const deckHolder: DeckHolder = await new DeckHolder(FULL_STARTER);
            expect(deckHolder.deckSize).toEqual(STANDARD_DECK_SIZE);

            const { deckSize, isDeckEmpty } = await deckHolder.clearDeck();
            expect(deckSize).toEqual(0);
            expect(isDeckEmpty).toBe(true);
        });
    });

    describe('getDeck', () => {
        it('should return a copy of the entire deck from owner', async () => {
            const deckHolder: DeckHolder = await new DeckHolder(FULL_STARTER);
            const currentDeckSize: number = deckHolder.deckSize;

            const deck: Card[] = await deckHolder.getDeck();

            expect(size(deck)).toEqual(currentDeckSize);
            expect(deckHolder.deckSize).toEqual(currentDeckSize);
        });
    });

    describe('takeDeck', () => {
        it('should return the entire deck from owner and leave them empty', async () => {
            const deckHolder: DeckHolder = await new DeckHolder(FULL_STARTER);
            const currentDeckSize: number = deckHolder.deckSize;

            const deck: Card[] = await deckHolder.takeDeck();

            expect(size(deck)).toEqual(currentDeckSize);
            expect(deckHolder.deckSize).toEqual(0);
        });
    });
});
