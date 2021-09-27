import { PLAYER_ONE_NAME, PLAYER_TWO_NAME } from '@card-games-api/players';

import type { BattleLog, PlayerLog } from '../../lib/types';

export const DEFAULT_TOTAL_DECKS = 1;
export const DEFAULT_TOTAL_PLAYERS = 2;

export const mockPlayerLog: PlayerLog = {
    cards: [],
    deck: 0,
    name: PLAYER_ONE_NAME
};

export const mockPlayerLogTwo: PlayerLog = {
    cards: [],
    deck: 0,
    name: PLAYER_TWO_NAME
};

export const mockPlayerLogs: PlayerLog[] = [
    mockPlayerLog,
    mockPlayerLogTwo,
    mockPlayerLog
];

export const MOCK_LOG: BattleLog = {
    createdAt: new Date().toString(),
    players: mockPlayerLogs,
    winner: PLAYER_ONE_NAME
};

export const mockTwoLog: BattleLog = {
    createdAt: new Date().toString(),
    players: mockPlayerLogs,
    winner: PLAYER_TWO_NAME
};

export const MOCK_LOGS: BattleLog[] = [MOCK_LOG, mockTwoLog, MOCK_LOG];

export const ONE_BATTLELOG = 1;
