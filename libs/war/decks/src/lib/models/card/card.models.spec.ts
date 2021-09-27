import {
    assignCard,
    KING_OF_HEARTS,
    MOCK_ASSIGNEE,
    MOCK_CARD_ARGUMENT
} from '../../../testing';
import { Card } from './card.models';

let card: Card;

describe('Card', () => {
    it('should initialize without crashing', async () => {
        expect(await new Card(MOCK_CARD_ARGUMENT)).toBeTruthy();
    });

    describe('clearHolderName', () => {
        beforeEach(() => (card = assignCard()));

        it("should clear out card holder's name", async () => {
            expect(await card.getHolderName()).toEqual(MOCK_ASSIGNEE);
            await card.clearHolderName();
            expect(await card.getHolderName()).toBeNull();
        });
    });

    describe('getHolderName & setHolderName', () => {
        afterEach(() => KING_OF_HEARTS.clearHolderName());

        it("should clear out card holder's name", async () => {
            expect(await KING_OF_HEARTS.getHolderName()).toBeNull();
            await KING_OF_HEARTS.setHolderName(MOCK_ASSIGNEE);
            expect(await KING_OF_HEARTS.getHolderName()).toEqual(MOCK_ASSIGNEE);
        });
    });

    describe('toJson', () => {
        it('should return properties as JSON object', async () => {
            expect(KING_OF_HEARTS.toJson()).toMatchObject(MOCK_CARD_ARGUMENT);
        });
    });
});
