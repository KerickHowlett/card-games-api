import type { ValueOf } from '@card-games-api/utils';

export const DeckBuilderOptions = {
    EMPTY_STARTER: 'empty',
    FULL_STARTER: 'full'
} as const;

export type DeckBuilderOption = ValueOf<typeof DeckBuilderOptions>;
