import {
    chain,
    cloneDeep,
    eq,
    every,
    isNull,
    isUndefined,
    multiply
} from 'lodash';

import { STANDARD_DECK_SIZE } from '../../lib/constants';
import { Card, Deck } from '../../lib/models';
import { DeckBuilderOptions } from '../../lib/types';
import {
    SINGLE_DECK,
    TEST_DECK,
    KING_OF_HEARTS,
    MOCK_ASSIGNEE
} from '../mocks';

const { FULL_STARTER } = DeckBuilderOptions;

export const assignCard = (
    assigneeName: string = MOCK_ASSIGNEE,
    card: Card = KING_OF_HEARTS
): Card => cloneDeep(card).setHolderName(assigneeName);

export const assignTestCards = (
    assigneeName: string = MOCK_ASSIGNEE,
    cards: Card[] = TEST_DECK
): Card[] =>
    chain(cards).cloneDeep().invokeMap('setHolderName', assigneeName).value();

export const assignTestDeck = (
    deck: Deck = new Deck(FULL_STARTER),
    assigneeName: string = MOCK_ASSIGNEE
): Deck => {
    const assignedCards: Card[] = chain(deck)
        .cloneDeep()
        .invoke('take')
        .invokeMap('setHolderName', assigneeName)
        .value();
    return deck.replace(assignedCards);
};

export const clearTestCards = (cards: Card[] = TEST_DECK): Card[] =>
    chain(cards).invokeMap('clearHolderName').value();

export const deckCountToCardCount = (totalDecks = SINGLE_DECK): number =>
    multiply(totalDecks, STANDARD_DECK_SIZE);
export const hashCard = (card: Card): string => JSON.stringify(card);

export const holderNameIs = (cards: Card[], queriedName?: string): boolean => {
    const hasHolderName = (card: Card): boolean => {
        const holderName: string = card.getHolderName();
        return isUndefined(queriedName)
            ? isNull(holderName)
            : eq(holderName, queriedName);
    };

    return every(cards, hasHolderName);
};

export const getCardsFromFullDeck = (): Card[] => new Deck(FULL_STARTER).get();
