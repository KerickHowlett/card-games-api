import { BattleLog } from '@card-games-api/battle-logs';
import { IdMapping } from '@card-games-api/database/nedb';
import { PlayerData } from '@card-games-api/players';

import { Game } from '../models/game';

import type { DateData } from '@card-games-api/utils';

import type { ParsedQs } from 'qs';

import type { GameStatus } from './game-status.types';

export interface GameData extends IdMapping {
    id?: string;
    players: PlayerData[];
    status: GameStatus;
    logs?: BattleLog[];
    winner?: string;
    createdAt?: DateData;
    updatedAt?: DateData;
}

export type GameOrData = Game | GameData;

export type GameOrQuery = GameData | RequestedPlayers;

export interface GameScore {
    status: GameStatus;
    players?: PlayerData[];
    playerOne?: number;
    playerTwo?: number;
    winner?: string;
}

export interface NewGameResponse {
    id: string;
}

export type RequestedPlayers = ParsedQs | number;

export interface QueryParamsReturn {
    totalDecks: number;
    totalPlayers: number;
}
