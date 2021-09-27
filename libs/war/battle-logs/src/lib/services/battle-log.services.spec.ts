import { Aftermath } from '@card-games-api/battles';
import { threePlayers } from '@card-games-api/players/testing';
import { add, isArray, last, size } from 'lodash';

import {
    createAftermathMock,
    getLatestMockLog,
    getMockLogs,
    MOCK_LOG,
    setupAftermathAndLogs,
    setupMockLogs
} from '../../testing';
import { BattleLog, PlayerLog } from '../types';
import { BattleLogServices as service } from './battle-log.services';

let logs: BattleLog[];
const latestLog: BattleLog = getLatestMockLog();

describe('BattleLogServices', () => {
    it('should initiate service without crashing', async () => {
        expect(service).toBeTruthy();
    });

    describe('add', () => {
        it('should add new battle log', async () => {
            const { aftermath, logs } = setupAftermathAndLogs();
            const expectedNewLogsSize: number = add(size(logs), 1);
            const addedLogs: BattleLog[] = await service.add(logs, aftermath);

            expect(size(addedLogs)).toEqual(expectedNewLogsSize);
        });

        describe('createPlayerLogs', () => {
            it('should append log that has the playerOne & playerTwo properties when for a two player game', async () => {
                const aftermath: Aftermath = createAftermathMock();
                const addedLog: BattleLog = last(
                    await service.add([], aftermath)
                );

                expect(addedLog).toHaveProperty('playerOne');
                expect(addedLog).toHaveProperty('playerTwo');
            });

            it('should have players array property when ', async () => {
                const aftermath: Aftermath = createAftermathMock(threePlayers);
                const addedLog: BattleLog = last(
                    await service.add([], aftermath)
                );

                expect(addedLog).toHaveProperty('players');

                const players: PlayerLog[] = addedLog.players;

                expect(isArray(players)).toBe(true);
                expect(size(players)).toBeGreaterThan(0);
            });
        });
    });

    describe('getLatest', () => {
        beforeEach(() => (logs = setupMockLogs(latestLog)));

        it('should return the latest log', async () => {
            const log: BattleLog = await service.getLatest(logs);
            expect(log).toMatchObject(latestLog);
            expect(log).not.toMatchObject(MOCK_LOG);
        });

        it('should return null if logs are empty, null, or undefined', async () => {
            expect(await service.getLatest([])).toBeNull();
            expect(await service.getLatest(null)).toBeNull();
            expect(await service.getLatest(undefined)).toBeNull();
        });
    });

    describe('get', () => {
        beforeEach(() => (logs = getMockLogs()));

        it('should return the latest log', async () => {
            expect(await service.get(logs)).toMatchObject(logs);
        });
    });
});
