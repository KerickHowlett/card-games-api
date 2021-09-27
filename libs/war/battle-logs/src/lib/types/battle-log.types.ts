import { Card } from '@card-games-api/decks';

import type { DateData, ObjectOf, WholeOrPartial } from '@card-games-api/utils';

export interface PlayerLog {
    cards: Card[];
    deck: number;
    name?: string;
}

export interface PlayersInBattle {
    players?: PlayerLog[];
    playerOne?: PlayerLog;
    playerTwo?: PlayerLog;
}

export interface BattleLog extends PlayersInBattle {
    createdAt?: DateData;
    winner: string;
}

export type PlayerLogQuery = WholeOrPartial<ObjectOf<PlayerLog>>;
