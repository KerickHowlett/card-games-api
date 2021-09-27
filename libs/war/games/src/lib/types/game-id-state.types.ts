import type { PrimitiveObject, ValueOf } from '@card-games-api/utils';

export type GameIDState = ValueOf<typeof GameIDStates>;

export const GameIDStates: PrimitiveObject = {
    HasNeither: 'neither',
    NoUnderscore: 'without',
    WithUnderscore: 'with'
} as const;
