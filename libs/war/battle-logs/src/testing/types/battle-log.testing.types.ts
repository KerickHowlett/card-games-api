import { Aftermath } from '@card-games-api/battles';

import { BattleLog } from '../../lib/types';

export interface SetupAftermathAndLogs {
    aftermath: Aftermath;
    logs: BattleLog[];
}
