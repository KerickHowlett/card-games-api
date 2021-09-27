import * as environment from './environment';

describe('Environment File', () => {
    it('should render and parse all environment variables without crashing', async () => {
        expect(environment).toBeTruthy();
    });
});
