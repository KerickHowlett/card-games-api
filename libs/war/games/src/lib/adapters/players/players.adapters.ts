import {
    IPlayersServices,
    Player,
    PlayerData,
    PlayersServices
} from '@card-games-api/players';

export class PlayersAdapters {
    constructor(
        protected readonly players: IPlayersServices = PlayersServices
    ) {}

    public getActivePlayersCount(players: Player[]): number {
        return this.players.getActiveCount(players);
    }

    public getJsonForAllPlayers(players: Player[]): PlayerData[] {
        return this.players.toJsonArray(players);
    }

    public getPlayerCount(players: Player[]): number {
        return this.players.getCount(players);
    }

    public getPlayers(players: Player[]): Player[] {
        return this.players.get(players);
    }

    public loadPlayers(data: PlayerData[]): Player[] {
        return this.players.load(data);
    }

    public updatePlayers(
        updatedPlayers: Player[],
        prevPlayers: Player[]
    ): Player[] {
        return this.players.update(updatedPlayers, prevPlayers);
    }
}
