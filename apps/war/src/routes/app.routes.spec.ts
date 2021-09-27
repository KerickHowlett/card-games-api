import appRoutes from './app.routes';

describe('appRoutes', () => {
    it('should initiate without crashing', async () => {
        expect(appRoutes).toBeTruthy();
    });
});
