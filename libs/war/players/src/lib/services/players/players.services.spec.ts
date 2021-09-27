import { size } from 'lodash';

import {
    DEFAULT_TOTAL_PLAYERS,
    setupFullyLoadedPlayers,
    playerOne,
    players,
    playersData,
    setupSomeEmptyPlayers
} from '../../../testing';
import { ONE_PLAYER, TWO_PLAYERS, PLAYER_ONE_NAME } from '../../constants';
import { Player } from '../../models/player';
import { PlayersServices as service } from './players.services';

let loadedPlayers: Player[];

describe('PlayersServices', () => {
    it('should create instance successfully', async () => {
        expect(service).toBeTruthy();
    });

    describe('create', () => {
        it('should return player with empty decks', async () => {
            expect(await service.create(TWO_PLAYERS)).toMatchObject(players);
        });
    });

    describe('findBy', () => {
        beforeEach(() => (loadedPlayers = setupSomeEmptyPlayers()));

        it('should return player with empty decks', async () => {
            const matchingPlayers: Player[] = await service.findBy(
                loadedPlayers,
                'isDeckEmpty',
                true
            );
            expect(size(matchingPlayers)).toEqual(ONE_PLAYER);
        });
    });

    describe('getOne', () => {
        it('should return player with matching name', async () => {
            const player: Player = await service.getOne(
                players,
                'name',
                PLAYER_ONE_NAME
            );
            expect(player.name).toEqual(playerOne.name);
        });
    });

    describe('get', () => {
        it('should return cloned list of players', async () => {
            expect(await service.get(players)).toBeTruthy();
        });
    });

    describe('getActiveCount', () => {
        beforeEach(async () => (loadedPlayers = setupFullyLoadedPlayers()));

        it('should return number of players with decks that are not empty', async () => {
            expect(await service.getActiveCount(loadedPlayers)).toEqual(
                DEFAULT_TOTAL_PLAYERS
            );
        });
    });

    describe('getCount', () => {
        it('get total number of players', async () => {
            expect(await service.getCount(players)).toEqual(
                DEFAULT_TOTAL_PLAYERS
            );
        });
    });

    describe('load', () => {
        it('should return player with empty decks', async () => {
            expect(await service.load(playersData)).toMatchObject(players);
        });
    });

    describe('update', () => {
        it('update all players', async () => {
            expect(await service.update(players, players)).toBeTruthy();
        });

        it('should throw if the player count does not match', async () => {
            await expect(() => service.update(players, [playerOne])).toThrow();
        });
    });

    describe('toJsonArray', () => {
        it('should return JSON data for all players', async () => {
            expect(await service.toJsonArray(players)).toMatchObject(
                playersData
            );
        });
    });
});
