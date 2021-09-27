import type { UnknownObject } from '@card-games-api/utils';

export interface FindByID extends IdMapping, UnknownObject {}

export interface IdMapping {
    _id?: string;
}

export interface NeDBResponseProperties {
    affectedDocuments?: unknown;
    isUpserted?: boolean;
    totalRecordsRemoved?: number;
    totalRecordsUpdated?: number;
}
