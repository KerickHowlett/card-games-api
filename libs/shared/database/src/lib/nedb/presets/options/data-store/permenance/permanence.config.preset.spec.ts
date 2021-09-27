import { mockFilepath } from '../../../../../../testing/nedb';
import { permenanceConfigPreset } from './permenance.config.preset';

describe('permenanceConfigPreset', () => {
    it('should return JSON object with dynamic property successfully', async () => {
        const { filename } = permenanceConfigPreset(mockFilepath);
        expect(filename).toEqual(mockFilepath);
    });
});
