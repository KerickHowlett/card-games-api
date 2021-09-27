import type { PrimitiveObject, ValueOf } from '@card-games-api/utils';

export type Suite = ValueOf<typeof Suites>;

export const Suites: PrimitiveObject = {
    CLUBS: 'clubs',
    DIAMONDS: 'diamonds',
    HEARTS: 'hearts',
    SPADES: 'spades'
} as const;
