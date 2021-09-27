import type { PrimitiveObject, ValueOf } from '@card-games-api/utils';

export type GameStatus = ValueOf<typeof GameStatuses>;

export const GameStatuses: PrimitiveObject = {
    GAME_JUST_STARTED: 'Game Started',
    IN_PROGRESS: 'Game In Progress',
    GAME_OVER: 'Game Over!'
} as const;
