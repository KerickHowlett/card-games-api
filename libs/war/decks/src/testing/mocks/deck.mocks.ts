import { chain } from 'lodash';

import { Card } from '../../lib/models/card';
import { CardData, RanksWithValues, Suites } from '../../lib/types';

const {
    ACE: { rank: aceRank, value: aceValue },
    KING: { rank: kingRank, value: kingValue },
    QUEEN: { rank: queenRank, value: queenValue },
    THREE: { rank: threeRank, value: threeValue },
    TWO: { rank: twoRank, value: twoValue }
} = RanksWithValues;

const { CLUBS, DIAMONDS, HEARTS, SPADES } = Suites;

export const MIN_DECKS = 1;
export const MAX_DECKS = 5;
export const SINGLE_DECK = 1;

export const EACH_DECK_VARIANT: number[] = chain(MAX_DECKS + 1)
    .range()
    .slice(MIN_DECKS)
    .value();
export const EACH_DECK_VARIANT_WITH_NEGATIVE: number[] = chain(
    EACH_DECK_VARIANT
)
    .clone()
    .push(-1)
    .value();

export const MOCK_ASSIGNEE = 'TEST';

export const MOCK_CARD_ARGUMENT: CardData = {
    suite: HEARTS,
    rank: kingRank,
    value: kingValue
};

export const TWO_CARD: Card = new Card({
    suite: DIAMONDS,
    rank: twoRank,
    value: twoValue
});

export const THREE_CARD: Card = new Card({
    suite: DIAMONDS,
    rank: threeRank,
    value: threeValue
});

export const KING_OF_HEARTS: Card = new Card({
    suite: HEARTS,
    rank: kingRank,
    value: kingValue
});

export const QUEEN_OF_HEARTS: Card = new Card({
    suite: HEARTS,
    rank: queenRank,
    value: queenValue
});

export const QUEEN_OF_SPADES: Card = new Card({
    suite: SPADES,
    rank: queenRank,
    value: queenValue
});

export const ACE_CARD: Card = new Card({
    suite: CLUBS,
    rank: aceRank,
    value: aceValue
});

export const QUEEN_OF_SPADES_DATA: CardData = QUEEN_OF_SPADES.toJson();
export const QUEEN_OF_HEARTS_DATA: CardData = QUEEN_OF_HEARTS.toJson();
export const KING_OF_HEARTS_DATA: CardData = KING_OF_HEARTS.toJson();

export const TEST_DECK: Card[] = [
    QUEEN_OF_HEARTS,
    QUEEN_OF_SPADES,
    KING_OF_HEARTS
];

export const TEST_DECK_DATA: CardData[] = [
    QUEEN_OF_HEARTS_DATA,
    QUEEN_OF_SPADES_DATA,
    KING_OF_HEARTS_DATA
];

export const DECK_WITH_ACE: Card[] = [...TEST_DECK, ACE_CARD];

export const deckWithAceAndTwo: Card[] = [...DECK_WITH_ACE, TWO_CARD];

export const QUEEN_DECK: Card[] = [
    QUEEN_OF_HEARTS,
    QUEEN_OF_SPADES,
    THREE_CARD
];
