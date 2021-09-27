import { isUndefined } from 'lodash';

import { NeDBResponseProperties } from '../../types';

import type { OrArray } from '@card-games-api/utils';

export class NeDBResponse<T = unknown> implements NeDBResponseProperties {
    constructor(responseProperties: NeDBResponseProperties) {
        const {
            affectedDocuments,
            isUpserted,
            totalRecordsRemoved,
            totalRecordsUpdated
        } = responseProperties;

        if (!isUndefined(affectedDocuments)) {
            this.affectedDocuments = affectedDocuments;
        }

        if (!isUndefined(totalRecordsRemoved)) {
            this.totalRecordsRemoved = totalRecordsRemoved;
        }

        if (!isUndefined(totalRecordsUpdated)) {
            this.totalRecordsUpdated = totalRecordsUpdated;
        }

        if (!isUndefined(isUpserted)) {
            this.isUpserted = isUpserted;
        }
    }

    public readonly affectedDocuments?: OrArray<T> | unknown;

    public readonly isUpserted?: boolean;

    public readonly totalRecordsRemoved?: number;

    public readonly totalRecordsUpdated?: number;
}
