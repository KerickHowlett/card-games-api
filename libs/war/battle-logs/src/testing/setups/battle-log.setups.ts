import { cloneDeep, shuffle } from 'lodash';

import { BattleLog } from '../../lib/types';
import { MOCK_LOGS } from '../mocks';
import { SetupAftermathAndLogs } from '../types';
import { createAftermathMock } from '../utils';

export const setupAftermathAndLogs = (): SetupAftermathAndLogs => ({
    aftermath: createAftermathMock(),
    logs: cloneDeep(MOCK_LOGS)
});

export const setupMockLogs = (
    latestLog: BattleLog,
    logs: BattleLog[] = MOCK_LOGS
): BattleLog[] => {
    const MOCK_LOGS: BattleLog[] = cloneDeep(logs);
    const mockLatestLog: BattleLog = cloneDeep(latestLog);

    MOCK_LOGS.push(mockLatestLog);

    return shuffle(MOCK_LOGS);
};
