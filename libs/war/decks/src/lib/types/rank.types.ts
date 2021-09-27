import type {
    NestedObject,
    PrimitiveObject,
    ValueOf
} from '@card-games-api/utils';

export type Rank = ValueOf<typeof Ranks>;

export interface RankProperties {
    rank: Rank;
    value: number;
}

export type RankWithValue = ValueOf<typeof RanksWithValues>;

export const Ranks: PrimitiveObject = {
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    JACK: 'Jack',
    QUEEN: 'Queen',
    KING: 'King',
    ACE: 'Ace'
} as const;

export const RanksWithValues: NestedObject<RankProperties> = {
    TWO: { rank: '2', value: 2 },
    THREE: { rank: '3', value: 3 },
    FOUR: { rank: '4', value: 4 },
    FIVE: { rank: '5', value: 5 },
    SIX: { rank: '6', value: 6 },
    SEVEN: { rank: '7', value: 7 },
    EIGHT: { rank: '8', value: 8 },
    NINE: { rank: '9', value: 9 },
    TEN: { rank: '10', value: 10 },
    JACK: { rank: 'Jack', value: 11 },
    QUEEN: { rank: 'Queen', value: 12 },
    KING: { rank: 'King', value: 13 },
    ACE: { rank: 'Ace', value: 14 }
} as const;
