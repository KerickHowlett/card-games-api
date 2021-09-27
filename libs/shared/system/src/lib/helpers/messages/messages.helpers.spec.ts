import { ADDRESS, PORT } from '@card-games-api/environment';

import { confirmationMessage } from './messages.helpers';

describe('System Messages Helpers', () => {
    describe('confirmationMessage', () => {
        it('should generate confirmation message', async () => {
            expect(confirmationMessage(ADDRESS, PORT)).toEqual(
                `Card Games API War API server is now live and listening on http://${ADDRESS}:${PORT}.`
            );
        });
    });
});
