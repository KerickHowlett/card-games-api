import { chain } from 'lodash';

import { PlayerLog, PlayerLogQuery } from '../types';

import type { ValueOf } from '@card-games-api/utils';

export const findPlayerLog = (
    logs: PlayerLog[],
    key: keyof PlayerLog,
    value: ValueOf<PlayerLog>
): PlayerLog => {
    const query: PlayerLogQuery = {};
    query[key] = value;
    return chain(logs)
        .cloneDeep()
        .find(query as PlayerLog)
        .value();
};
