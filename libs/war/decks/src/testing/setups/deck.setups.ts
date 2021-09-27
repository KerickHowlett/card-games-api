import { Deck } from '../../lib/models/deck';
import { DeckBuilderOptions } from '../../lib/types';
import { MockDecksSetup } from '../types';
import { assignTestDeck } from '../utils';

const { EMPTY_STARTER, FULL_STARTER } = DeckBuilderOptions;

export const mockDecksSetup = (totalDecks = 1): MockDecksSetup => ({
    assignedDeck: assignTestDeck(new Deck(FULL_STARTER, totalDecks)),
    dealerDeck: new Deck(FULL_STARTER, totalDecks),
    playerDeck: new Deck(EMPTY_STARTER)
});
