import { COMPACTION_INTERVALS_IN_MILLISECONDS } from '@card-games-api/environment';
import { isUndefined } from 'lodash';
import Datastore, {
    DataStoreOptions,
    EnsureIndexOptions,
    UpdateOptions
} from 'nedb';

import { getDatastoreOptions } from '../helpers';
import { NeDBResponse } from '../models';
import { indexOptionsPresets, updateOptionsPresets } from '../presets/options';
import { FindByID } from '../types';

import type { WholeOrPartial } from '@card-games-api/utils';

class NeDBCore {
    private store: Datastore;

    public async clear(): Promise<NeDBResponse> {
        return new Promise<NeDBResponse>((resolve, reject) => {
            this.store.remove(
                {},
                { multi: true },
                (error: Error, totalRecordsRemoved: number) => {
                    if (error) return reject(error);
                    const response = new NeDBResponse({ totalRecordsRemoved });
                    resolve(response);
                }
            );
        });
    }

    public async connect(databaseFilepath?: string): Promise<void> {
        const options: DataStoreOptions = getDatastoreOptions(databaseFilepath);
        this.store = await new Datastore(options);
        await this.store.persistence.setAutocompactionInterval(
            COMPACTION_INTERVALS_IN_MILLISECONDS
        );
    }

    public async disconnect(): Promise<void> {
        await this.store.persistence.stopAutocompaction();
        this.store = undefined;
    }

    public async getOne<T>(query: FindByID): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.store.findOne(query, (error: Error, response: T) => {
                error ? reject(error) : resolve(response);
            });
        });
    }

    public async insert<T>(data: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.store.insert(data, (error: Error, response: T) => {
                if (error) return reject(error);
                if (isUndefined(response)) return reject(error);
                resolve(response);
            });
        });
    }

    public async remove(
        query: FindByID,
        isMultipleRecords = false
    ): Promise<NeDBResponse> {
        return new Promise<NeDBResponse>((resolve, reject) => {
            this.store.remove(
                query,
                { multi: isMultipleRecords },
                (error: Error, totalRecordsRemoved: number) => {
                    if (error) return reject(error);
                    const response = new NeDBResponse({ totalRecordsRemoved });
                    resolve(response);
                }
            );
        });
    }

    public async setIndex(
        options: EnsureIndexOptions = indexOptionsPresets
    ): Promise<void> {
        this.store.ensureIndex(options);
    }

    public async update<T>(
        query: FindByID,
        data: WholeOrPartial<T>,
        options: UpdateOptions = updateOptionsPresets
    ): Promise<NeDBResponse<T>> {
        return new Promise<NeDBResponse<T>>((resolve, reject) => {
            this.store.update(
                query,
                data,
                options,
                (
                    error: Error,
                    totalRecordsUpdated: number,
                    affectedDocuments: T,
                    isUpserted: boolean
                ) => {
                    if (error) return reject(error);
                    const response = new NeDBResponse<T>({
                        isUpserted,
                        totalRecordsUpdated,
                        affectedDocuments
                    });
                    resolve(response);
                }
            );
        });
    }
}

export type INeDBCore = NeDBCore;

const core: INeDBCore = new NeDBCore();

export { core as NeDBCore };
