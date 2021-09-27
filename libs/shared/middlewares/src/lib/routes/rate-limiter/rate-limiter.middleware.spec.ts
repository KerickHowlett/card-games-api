import { RateLimiter } from './rate-limiter.middleware';

describe('RateLimiter Middleware', () => {
    describe('RateLimiter', () => {
        it('should create instance without crashing', async () => {
            expect(RateLimiter).toBeTruthy();
        });
    });
});
