import {
    FindByID,
    INeDBCore,
    NeDBCore,
    NeDBResponse
} from '@card-games-api/database/nedb';
import {
    INodeCacheCore,
    NodeCacheCore
} from '@card-games-api/database/node-cache';
import { isNil as isNullOrUndefined } from 'lodash';

import {
    createDatabaseError,
    getQueryId,
    remapIdProperty,
    removeIdProperties,
    updateSuccessful
} from '../../helpers/database';
import { Game } from '../../models/game';
import { GameData, NewGameResponse } from '../../types';

class DatabaseServices {
    constructor(
        private readonly cache: INodeCacheCore,
        private readonly database: INeDBCore
    ) {}

    public async addNewGame(game: Game): Promise<NewGameResponse> {
        try {
            const gameData: GameData = removeIdProperties(game) as GameData;
            const newGame: GameData = await this.database.insert<GameData>(
                gameData
            );

            if (isNullOrUndefined(newGame?._id)) return null;

            const remappedGameData: GameData = remapIdProperty(newGame);
            const { id } = remappedGameData;

            await this.cache.set(id, remappedGameData);

            return { id };
        } catch (error) {
            throw createDatabaseError(error);
        }
    }

    public async getGame(gameId: string): Promise<GameData> {
        try {
            let gameData: GameData = await this.cache.get<GameData>(gameId);
            if (!isNullOrUndefined(gameData)) return gameData;

            const query: FindByID = getQueryId(gameId);
            gameData = await this.database.getOne<GameData>(query);

            if (isNullOrUndefined(gameData)) return null;

            gameData = await remapIdProperty(gameData);
            await this.cache.set(gameData.id, gameData);

            return gameData;
        } catch (error) {
            throw createDatabaseError(error);
        }
    }

    public async updateGame(game: Game): Promise<boolean> {
        try {
            const gameData: GameData = remapIdProperty(game.toJson());
            const query: FindByID = getQueryId(gameData);

            const response: NeDBResponse<GameData> =
                await this.database.update<GameData>(query, gameData);

            if (!updateSuccessful(response)) return false;

            const remappedGameData: GameData = remapIdProperty(
                response.affectedDocuments as GameData
            );

            await this.cache.set(remappedGameData.id, remappedGameData);

            return true;
        } catch (error) {
            throw createDatabaseError(error);
        }
    }
}

export type IDatabaseServices = DatabaseServices;

const service: IDatabaseServices = new DatabaseServices(
    NodeCacheCore,
    NeDBCore
);

export { service as DatabaseServices };
