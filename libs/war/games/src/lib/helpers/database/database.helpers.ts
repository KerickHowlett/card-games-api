import { FindByID, NeDBResponse } from '@card-games-api/database/nedb';
import { hasProperty, PossibleErrors } from '@card-games-api/utils';
import createError, { HTTPError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import {
    cloneDeep,
    eq,
    isNil as isNullOrUndefined,
    isString,
    unset
} from 'lodash';

import { isGame } from '../../helpers/games';
import { GameData, GameIDState, GameIDStates, GameOrData } from '../../types';

const { HasNeither, NoUnderscore, WithUnderscore } = GameIDStates;

const { INTERNAL_SERVER_ERROR } = StatusCodes;

export const createDatabaseError = (error: PossibleErrors): HTTPError =>
    createError(INTERNAL_SERVER_ERROR, error);

export const getQueryId = (dataOrId: GameData | string): FindByID => {
    if (isString(dataOrId)) return { _id: dataOrId };

    const idState: GameIDState = hasWhichIdState(dataOrId);
    const id: string = isWithUnderscore(idState) ? dataOrId._id : dataOrId.id;

    return { _id: id };
};

export const hasWhichIdState = (gameData: GameData): GameIDState => {
    if (hasProperty(gameData, '_id')) return WithUnderscore;
    if (hasProperty(gameData, 'id')) return NoUnderscore;
    return HasNeither;
};

export const isHasNeither = (idState: GameIDState): boolean =>
    eq(idState, HasNeither);

export const isNoUnderscore = (idState: GameIDState): boolean =>
    eq(idState, NoUnderscore);

export const isWithUnderscore = (idState: GameIDState): boolean =>
    eq(idState, WithUnderscore);

export const remapIdProperty = (gameData: GameData): GameData => {
    const originalData: GameData = cloneDeep(gameData);
    const remappedGameData: GameData = removeIdProperties(gameData);

    const idState: GameIDState = hasWhichIdState(gameData);

    if (isHasNeither(idState)) return originalData;

    if (isWithUnderscore(idState))
        return { ...remappedGameData, id: originalData._id };

    return { ...remappedGameData, _id: originalData.id };
};

export const removeIdProperties = (game: GameOrData): GameData => {
    const clonedGame: GameOrData = cloneDeep(game);
    const gameData: GameData = isGame(clonedGame)
        ? clonedGame.toJson()
        : clonedGame;

    unset(gameData, 'id');
    unset(gameData, '_id');

    return gameData;
};

export const updateSuccessful = (response: NeDBResponse): boolean => {
    const { totalRecordsUpdated } = response || {};
    return (
        !isNullOrUndefined(totalRecordsUpdated) && eq(totalRecordsUpdated, 1)
    );
};
