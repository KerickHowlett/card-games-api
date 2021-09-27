import EnvConfigOptions from './environment.config';

describe('Environment Config Options', () => {
    it('should produce environment config options without crashing', async () => {
        expect(EnvConfigOptions).toBeTruthy();
    });
});
