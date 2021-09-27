import { CountOf, getSize, ValueOf } from '@card-games-api/utils';
import createError from 'http-errors';
import StatusCodes from 'http-status-codes';
import { chain, cloneDeep, invokeMap, map, range, size } from 'lodash';

import { notEmpty, PLAYERS_UPDATE_ERROR } from '../../constants';
import {
    createPlayer,
    hasExactPlayers as hasPlayersIntegrity,
    isQueriedPlayer
} from '../../helpers/player';
import { Player } from '../../models/player';
import { PlayerData } from '../../types';

const { INTERNAL_SERVER_ERROR } = StatusCodes;

class PlayersServices {
    public create(playersRequest: CountOf<Player>): Player[] {
        const totalPlayers: number = getSize(playersRequest);
        return map(range(totalPlayers), createPlayer);
    }

    public findBy(
        players: Player[],
        key: keyof Player,
        query: ValueOf<Player>
    ): Player[] {
        const queriedPlayers = (player: Player): boolean =>
            isQueriedPlayer(player, key, query);

        return chain(players).cloneDeep().filter(queriedPlayers).value();
    }

    public get(players: Player[]): Player[] {
        return cloneDeep(players);
    }

    public getActiveCount(players: Player[]): number {
        return chain(players).filter(notEmpty).size().value();
    }

    public getCount(players: Player[]): number {
        return size(players);
    }

    public getOne(
        players: Player[],
        key: keyof Player,
        query: ValueOf<Player>
    ): Player {
        const queriedPlayer = (player: Player): boolean =>
            isQueriedPlayer(player, key, query);

        return chain(players).cloneDeep().find(queriedPlayer).value();
    }

    public load(data: PlayerData[]): Player[] {
        return map(data, createPlayer);
    }

    public update(updatedPlayers: Player[], prevPlayers: Player[]): Player[] {
        if (!hasPlayersIntegrity(updatedPlayers, prevPlayers)) {
            throw createError(INTERNAL_SERVER_ERROR, PLAYERS_UPDATE_ERROR);
        }
        return updatedPlayers;
    }

    public toJsonArray(players: Player[]): PlayerData[] {
        return invokeMap(players, 'toJson');
    }
}

export type IPlayersServices = PlayersServices;

const service: IPlayersServices = new PlayersServices();

export { service as PlayersServices };
