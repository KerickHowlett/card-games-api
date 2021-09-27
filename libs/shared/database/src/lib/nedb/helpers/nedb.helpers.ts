import { eq, isNil as isNullOrUndefined } from 'lodash';
import type { DataStoreOptions } from 'nedb';

import { inMemoryConfigPreset, permenanceConfigPreset } from '../presets';

export const isPermenance = (databaseFilepath?: string) =>
    !isNullOrUndefined(databaseFilepath) && !eq(databaseFilepath, ':memory:');

export const getDatastoreOptions = (
    databaseFilepath?: string
): DataStoreOptions =>
    isPermenance(databaseFilepath)
        ? permenanceConfigPreset(databaseFilepath)
        : inMemoryConfigPreset;
