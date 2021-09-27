import { Player } from '@card-games-api/players';
import {
    playersData,
    setupSomeEmptyPlayers
} from '@card-games-api/players/testing';

import { PlayersAdapters } from './players.adapters';

let adapter: PlayersAdapters;
let players: Player[];

describe('PlayersAdapters', () => {
    beforeAll(() => (adapter = new PlayersAdapters()));

    it('should initiate adapter without crashing', async () => {
        expect(adapter).toBeTruthy();
    });

    describe('should execute methods without crashing', () => {
        beforeEach(() => (players = setupSomeEmptyPlayers()));

        it('getActivePlayersCount', async () => {
            expect(await adapter.getActivePlayersCount(players)).toBeTruthy();
        });

        it('getJsonForAllPlayers', async () => {
            expect(await adapter.getJsonForAllPlayers(players)).toBeTruthy();
        });

        it('getPlayerCount', async () => {
            expect(await adapter.getPlayerCount(players)).toBeTruthy();
        });

        it('getPlayers', async () => {
            expect(await adapter.getPlayers(players)).toBeTruthy();
        });

        it('loadPlayers', async () => {
            expect(await adapter.loadPlayers(playersData)).toBeTruthy();
        });

        it('updatePlayers', async () => {
            expect(await adapter.updatePlayers(players, players)).toBeTruthy();
        });
    });
});
