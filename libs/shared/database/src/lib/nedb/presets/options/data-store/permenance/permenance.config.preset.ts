import type { DataStoreOptions } from 'nedb';

export const permenanceConfigPreset = (
    databaseFilepath: string
): DataStoreOptions => ({
    autoload: true,
    filename: databaseFilepath,
    inMemoryOnly: false,
    timestampData: true
});
