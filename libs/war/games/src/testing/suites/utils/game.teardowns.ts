import { teardownNeDBAndNodeCache } from '@card-games-api/database/testing';
import { disableMockDate } from '@card-games-api/utils/testing';

export const teardownEachTest = (): void => {
    disableMockDate();
};

export const teardownAllTests = async (): Promise<void> => {
    await disableMockDate();
    await teardownNeDBAndNodeCache();
};
