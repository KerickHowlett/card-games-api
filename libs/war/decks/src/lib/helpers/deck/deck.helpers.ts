import {
    CountOf,
    findMax,
    getSize,
    isInstanceOf,
    OrArray,
    ValueOf
} from '@card-games-api/utils';
import {
    castArray,
    clone,
    eq,
    filter,
    findIndex,
    gt,
    isArray,
    isEmpty,
    isNil as isNullOrUndefined,
    lt,
    map,
    memoize,
    multiply,
    range,
    reduce,
    shuffle,
    size
} from 'lodash';

import {
    CARD_NOT_FOUND,
    EMPTY_DECK,
    ONE_CARD,
    ONE_DECK,
    STANDARD_DECK_SIZE
} from '../../constants';
import { Card } from '../../models/card';
import { Deck } from '../../models/deck';
import {
    CardData,
    CardOrData,
    DeckBuilderOption,
    DeckBuilderOptions,
    RanksWithValues as ranks,
    RankWithValue,
    Suite,
    Suites
} from '../../types';

const { EMPTY_STARTER, FULL_STARTER } = DeckBuilderOptions;

export const addDeck = (deck: Card[]): Card[] => [...deck, ...buildDeck()];

export const buildCard = (data: CardData): Card => new Card(data);

export const buildDeck = memoize((): Card[] =>
    reduce(
        Suites,
        (deck: Card[], suite: Suite): Card[] => [
            ...deck,
            ...map(ranks, (rankWithValue: RankWithValue): Card => {
                const { rank, value } = rankWithValue;
                return buildCard({ suite, rank, value });
            })
        ],
        getEmptyDeck()
    )
);

export const findCards = (
    cards: Card[],
    key: keyof Card,
    query: ValueOf<Card>
): Card[] =>
    filter(cards, (card: Card): boolean => isQueriedCard(card, key, query));

export const getEmptyDeck = (): Card[] => clone(EMPTY_DECK);

export const getHighCards = (cards: Card[]): Card[] => {
    const highCardValue: ValueOf<Card> = findMax<Card>(cards, 'value');

    if (isNullOrUndefined(highCardValue)) {
        return getEmptyDeck();
    }

    return findCards(cards, 'value', highCardValue);
};

export const getNewDeck = (totalRequestedDecks = ONE_DECK): Card[] => {
    const totalDecks: number = getValidDeckTotal(totalRequestedDecks);

    const newDeck: Card[] = reduce(range(totalDecks), addDeck, []);

    return shuffle(newDeck);
};

export const getTotalCards = (totalDecks: number): number =>
    multiply(totalDecks, STANDARD_DECK_SIZE);

export const getValidDeckTotal = (requestedDecks: number): number =>
    lt(requestedDecks, ONE_DECK) ? ONE_DECK : requestedDecks;

export const hasCard = (
    cards: Card[],
    key: keyof Card,
    query: ValueOf<Card>
): boolean =>
    gt(
        findIndex(cards, (card: Card): boolean =>
            isQueriedCard(card, key, query)
        ),
        CARD_NOT_FOUND
    );

export const hasExactCards = (
    cards: CountOf<Card>,
    requiredTotal: number
): boolean => eq(getSize(castArray(cards)), requiredTotal);

export const isDeck = (object: unknown): object is Deck =>
    isInstanceOf<typeof Deck>(object, Deck);

export const isDeckEmpty = (cards: CountOf<CardOrData>): boolean =>
    isNullOrUndefined(cards) || isEmpty(cards);

export const isFullStarter = (
    deckBuilder: unknown
): deckBuilder is DeckBuilderOption => eq(deckBuilder, FULL_STARTER);

export const isOnlyOneCard = (totalCards: CountOf<Card>): boolean =>
    eq(isArray(totalCards) ? size(totalCards) : totalCards, ONE_CARD);

export const isEmptyStarter = (
    deckBuilder: unknown
): deckBuilder is DeckBuilderOption => eq(deckBuilder, EMPTY_STARTER);

export const isQueriedCard = (
    card: Card,
    key: keyof Card,
    query: ValueOf<Card>
): boolean => eq(card[key], query);

export const loadExistingDeck = (deckData: OrArray<CardData>): Card[] =>
    map(castArray(deckData), buildCard);
