import { daysToSeconds } from '@card-games-api/utils';

import type { Options } from 'node-cache';

export const ConfigPreset: Options = {
    stdTTL: daysToSeconds(1),
    maxKeys: 100
};
