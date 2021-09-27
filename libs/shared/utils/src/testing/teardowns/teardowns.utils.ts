import { noop, times } from 'lodash';

export const setEverythingToUndefined = (totalVariables: number): undefined[] =>
    times(totalVariables, noop) as undefined[];

export const resetAllSpiesAndTimer = (): void => {
    jest.resetAllMocks();
    jest.useRealTimers();
};
