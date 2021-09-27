import { PLAYER_TWO_NAME } from '@card-games-api/players';

import { mockPlayerLogs } from '../../testing';
import { findPlayerLog } from './battle-log.helpers';

describe('Log Helpers', () => {
    describe('findPlayerLog', () => {
        it('should return the queried player log', async () => {
            const { name } = await findPlayerLog(
                mockPlayerLogs,
                'name',
                PLAYER_TWO_NAME
            );
            expect(name).toEqual(PLAYER_TWO_NAME);
        });
    });
});
