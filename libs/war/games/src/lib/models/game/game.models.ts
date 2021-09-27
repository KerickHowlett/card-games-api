import { BattleLog } from '@card-games-api/battle-logs';
import { Player, PlayerData } from '@card-games-api/players';
import { omitBy } from 'lodash';

import { BattleLogAdapters } from '../../adapters/battle-log';
import { isGameData, toJsonFilter } from '../../helpers/games';
import { GamesServices, IGamesServices } from '../../services';
import {
    GameData,
    GameOrQuery,
    GameScore,
    GameStatus,
    GameStatuses
} from '../../types';

import type { DateData } from '@card-games-api/utils';

const { GAME_JUST_STARTED } = GameStatuses;

export class Game extends BattleLogAdapters {
    private readonly gamesService: IGamesServices;

    constructor(gameOrQuery?: GameOrQuery, totalDecks?: number) {
        super();

        this.gamesService = GamesServices;

        if (isGameData(gameOrQuery)) {
            const { createdAt, id, players, status, updatedAt, logs } =
                gameOrQuery;

            this.id = id;
            this.status = status;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;

            this.logs = logs || [];

            this.players = this.gamesService.loadPlayers(players);

            return;
        }

        this.logs = [];
        this.status = GAME_JUST_STARTED;
        this.players = this.gamesService.setup(gameOrQuery, totalDecks);
    }

    private readonly createdAt: DateData;

    private readonly id: string;

    private players: Player[];

    private status: GameStatus;

    private readonly updatedAt: DateData;

    get totalActivePlayers(): number {
        return this.gamesService.getActivePlayersCount(this.players);
    }

    get totalPlayers(): number {
        return this.gamesService.getPlayerCount(this.players);
    }

    public getPlayers(): Player[] {
        return this.gamesService.getPlayers(this.players);
    }

    public getStatus(): GameStatus {
        return this.status;
    }

    public updatePlayers(players: Player[]): Game {
        this.players = this.gamesService.updatePlayers(players, this.players);
        return this;
    }

    public getScore(): GameScore {
        return this.gamesService.getScore(
            this.players,
            this.status,
            this.getLatestLog()
        ) as GameScore;
    }

    public switchStatus(): Game {
        this.status = this.gamesService.switchStatus(
            this.status,
            this.totalActivePlayers
        );
        return this;
    }

    public toJson(): GameData {
        const latestLog: BattleLog = this.getLatestLog();
        const players: PlayerData[] = this.gamesService.getJsonForAllPlayers(
            this.players
        );
        const winner: string = this.gamesService.getWinnerName(
            this.status,
            latestLog
        );

        return omitBy<GameData>(
            {
                id: this.id,
                status: this.status,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                logs: this.logs,
                players,
                winner
            },
            toJsonFilter
        ) as GameData;
    }
}
