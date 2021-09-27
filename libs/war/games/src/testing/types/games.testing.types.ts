import { Aftermath } from '@card-games-api/battles';
import { SetupDatabaseSpies } from '@card-games-api/database/testing';
import { PlayerDeckSet } from '@card-games-api/players/testing';

import { Game } from '../../lib/models/game';
import { GameData, GameScore } from '../../lib/types';

import type { JestSpy } from '@card-games-api/utils/testing';
import type { Application } from 'express';

export type GameOrId = Game | string;

export interface GameTestParamSet extends PlayerDeckSet {
    mockGetRoute: string;
    mockPostRoute: string;
    mockPutRoute: string;
}

export interface MockGamesDataSetup {
    mockGameData: GameData;
    gameOptionalProps: GameData;
}

export interface MockGameServer extends SetupGameDatabaseTests {
    app: Application;
    battlePlaySpy: JestSpy;
}

export type PlayerCountOrData = GameData | number;

export interface SetupAftermathAndGame {
    aftermath: Aftermath;
    game: Game;
}

export interface SetupGameAndGameData {
    game: Game;
    gameData: GameData;
    gameScore?: GameScore;
    gameDataWithMockId?: GameData;
    gameDataWithMockUnderscoreId?: GameData;
}

export interface SetupGameDatabaseTests
    extends SetupDatabaseSpies,
        SetupGameAndGameData {
    mockDate?: Date;
}
