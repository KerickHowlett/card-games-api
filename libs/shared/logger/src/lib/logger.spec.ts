import logger from './logger';

describe('Logger', () => {
    it('should initialize the Logger without crashing', async () => {
        expect(logger).toBeTruthy();
    });
});
