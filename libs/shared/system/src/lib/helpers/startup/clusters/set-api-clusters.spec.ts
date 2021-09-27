import { setupMockServer } from '@card-games-api/utils/testing';

import { setApiClusters } from './set-api-clusters';

import type { Server } from 'http';

let server: Server;

jest.mock('http', () => ({
    createServer: jest.fn(() => ({ listen: jest.fn() }))
}));

describe('setApiClusters', () => {
    beforeEach(() => ({ server } = setupMockServer()));

    describe('isMaster branch', () => {
        it("should cluster API if feature's enabled", async () => {
            expect(await setApiClusters(server)).toBeTruthy();
            expect(server.listen).toHaveBeenCalled();
        });
    });
});
