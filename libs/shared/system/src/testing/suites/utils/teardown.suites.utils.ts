import { resetAllSpiesAndTimer } from '@card-games-api/utils/testing';

export const teardownEveryTest = (): void => {
    resetAllSpiesAndTimer();
};
