import {
    createAftermathMock,
    ONE_BATTLELOG
} from '@card-games-api/battle-logs/testing';
import { Aftermath } from '@card-games-api/battles';
import { chain, size } from 'lodash';

import { setupAdapterWithLog } from '../../../testing';
import { BattleLogAdapters } from './battle-log.adapters';

let adapter: BattleLogAdapters;

const aftermath: Aftermath = createAftermathMock();

describe('BattleLogAdapters', () => {
    describe('addToLogs', () => {
        beforeEach(() => (adapter = setupAdapterWithLog()));

        it('should add log to BattleLog array property', async () => {
            const expectedSize: number = chain(await adapter.getLogs())
                .size()
                .add(ONE_BATTLELOG)
                .value();

            await adapter.addToLogs(aftermath);

            expect(size(await adapter.getLogs())).toEqual(expectedSize);
        });
        it('should be chainable', async () => {
            expect(await adapter.addToLogs(aftermath)).toBeInstanceOf(
                BattleLogAdapters
            );
        });
    });

    describe('getLatestLog', () => {
        beforeEach(() => (adapter = setupAdapterWithLog()));

        it('should return the latest log current status of game without crashing', async () => {
            expect(await adapter.getLatestLog()).toBeTruthy();
        });
    });

    describe('getLogs', () => {
        beforeEach(() => (adapter = setupAdapterWithLog()));

        it('should return copy of logs without crashing', async () => {
            expect(size(await adapter.getLogs())).toEqual(1);
        });
    });
});
