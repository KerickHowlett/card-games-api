import type { EnsureIndexOptions } from 'nedb';

export const indexOptionsPresets: EnsureIndexOptions = {
    fieldName: '_id',
    unique: true
};
