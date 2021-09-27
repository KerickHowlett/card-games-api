import {
    BattleServices,
    IBattleServices
} from '../../lib/services/battle.services';

import type { JestSpy } from '@card-games-api/utils/testing';

export const battleServiceSpy = (
    service: IBattleServices = BattleServices
): JestSpy => jest.spyOn(service, 'play');
