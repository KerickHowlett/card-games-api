import { failMock, failMockArray } from '@card-games-api/utils/testing';

import {
    KING_OF_HEARTS,
    KING_OF_HEARTS_DATA,
    TEST_DECK,
    TEST_DECK_DATA
} from '../../../testing';
import {
    isCard,
    isCardArray,
    isCardData,
    isCardDataArray
} from './card.helpers';

describe('Card Helpers', () => {
    describe('isCard', () => {
        it('should return the proper booelan value dependent on card argument', async () => {
            expect(await isCard(KING_OF_HEARTS)).toBe(true);
            expect(await isCard(failMock)).toBe(false);
        });

        it('should return false if CardData', async () => {
            expect(await isCard(KING_OF_HEARTS_DATA)).toBe(false);
        });
    });

    describe('isCardArray', () => {
        it('should return the proper booelan value dependent on card argument', async () => {
            expect(await isCardArray(TEST_DECK)).toBe(true);
            expect(await isCardArray(failMockArray)).toBe(false);
        });

        it('should return FALSE if the array contains CardData instead', async () => {
            expect(await isCardArray(TEST_DECK_DATA)).toBe(false);
        });
    });

    describe('isCardData', () => {
        it('should return the proper booelan value dependent on card argument', async () => {
            expect(await isCardData(KING_OF_HEARTS_DATA)).toBe(true);
            expect(await isCardData(failMock)).toBe(false);
        });

        it('should return FALSE if the array contains a Card instance instead', async () => {
            expect(await isCardData(KING_OF_HEARTS)).toBe(false);
        });
    });

    describe('isCardDataArray', () => {
        it('should return the proper booelan value dependent on card argument', async () => {
            expect(await isCardDataArray(TEST_DECK_DATA)).toBe(true);
            expect(await isCardDataArray(failMockArray)).toBe(false);
        });

        it('should return FALSE if the array contains a Card instance instead', async () => {
            expect(await isCardDataArray(TEST_DECK)).toBe(false);
        });
    });
});
