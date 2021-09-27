import type { DataStoreOptions } from 'nedb';

export const inMemoryConfigPreset: DataStoreOptions = {
    inMemoryOnly: true,
    timestampData: true
};
