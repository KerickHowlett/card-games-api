import type { UpdateOptions } from 'nedb';

export const updateOptionsPresets: UpdateOptions = {
    returnUpdatedDocs: true,
    multi: false
};
