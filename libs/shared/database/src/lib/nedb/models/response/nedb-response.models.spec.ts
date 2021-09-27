import { hasProperty } from '@card-games-api/utils';

import { NeDBResponseProperties } from '../../types';
import { NeDBResponse } from './nedb-response.models';

describe('NeDBResponse', () => {
    it('should only produce properties when given value', async () => {
        const responseProperties: NeDBResponseProperties = {
            affectedDocuments: ['test'],
            isUpserted: false,
            totalRecordsUpdated: 1,
            totalRecordsRemoved: 0
        };

        const response: NeDBResponse = new NeDBResponse(responseProperties);

        expect(response).toBeTruthy();

        expect(hasProperty(response, 'affectedDocuments')).toBe(true);
        expect(hasProperty(response, 'isUpserted')).toBe(true);
        expect(hasProperty(response, 'totalRecordsUpdated')).toBe(true);
        expect(hasProperty(response, 'totalRecordsRemoved')).toBe(true);
    });

    it('should NOT produce properties that are left undefined', async () => {
        const responseProperties: NeDBResponseProperties = {};

        const response: NeDBResponse = new NeDBResponse(responseProperties);

        expect(response).toBeTruthy();

        expect(hasProperty(response, 'affectedDocuments')).toBe(false);
        expect(hasProperty(response, 'insertedDocuments')).toBe(false);
        expect(hasProperty(response, 'isUpserted')).toBe(false);
        expect(hasProperty(response, 'totalRecordsUpdated')).toBe(false);
        expect(hasProperty(response, 'totalRecordsRemoved')).toBe(false);
    });
});
