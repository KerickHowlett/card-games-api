import type { Primitive } from '@card-games-api/utils';

export type KeyOrSet<T> = KeyValueSet<T> | QueryKey;

export interface KeyValueSet<T> {
    key: QueryKey;
    ttl?: number;
    value?: T;
}

export type QueryKey = Primitive;
