import {
    NestedArray,
    OrArray,
    splitFromTop as cutDeckAt
} from '@card-games-api/utils';
import { castArray, chain, cloneDeep, invokeMap, shuffle } from 'lodash';

import {
    getEmptyDeck,
    getNewDeck,
    isCardDataArray,
    isDeckEmpty as isNewDeckEmpty,
    isFullStarter,
    loadExistingDeck
} from '../../helpers';
import { Card } from '../../models';

import type { CardData, CardOrData, DeckProperties } from '../../types';

class DeckServices {
    public addCards(newCards: OrArray<Card>, currentCards: Card[]): Card[] {
        return [...currentCards, ...castArray(newCards)];
    }

    public clearDeckHolderName(cards: Card[]): Card[] {
        return invokeMap(cards, 'clearHolderName');
    }

    public drawCards(total: number, cards: Card[]): NestedArray<Card> {
        return cutDeckAt<Card>(cards, total);
    }

    public getCards(cards: Card[]): Card[] {
        return cloneDeep(cards);
    }

    public getDeck(
        deckOwnerOrData: DeckProperties,
        totalDecks?: number
    ): Card[] {
        if (isFullStarter(deckOwnerOrData)) {
            return getNewDeck(totalDecks);
        }

        if (isCardDataArray(deckOwnerOrData)) {
            return loadExistingDeck(deckOwnerOrData);
        }

        return getEmptyDeck();
    }

    public replace(newDeck?: OrArray<CardOrData>): Card[] {
        if (isNewDeckEmpty(newDeck)) {
            return getEmptyDeck();
        }

        const cards: CardOrData[] = chain(newDeck)
            .cloneDeep()
            .castArray()
            .value() as CardOrData[];

        if (isCardDataArray(cards)) {
            return loadExistingDeck(cards);
        }

        return cards;
    }

    public shuffle(cards: Card[]): Card[] {
        return shuffle(cards);
    }

    public take(cards: Card[]): NestedArray<Card> {
        return [cloneDeep(cards), getEmptyDeck()];
    }

    public toJson(cards: Card[]): CardData[] {
        return invokeMap(cards, 'toJson');
    }
}

export type IDeckServices = DeckServices;

const service: IDeckServices = new DeckServices();

export { service as DeckServices };
