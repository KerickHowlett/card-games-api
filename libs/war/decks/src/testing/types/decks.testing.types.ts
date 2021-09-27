import { Deck } from '../../lib/models/deck';

export interface MockDecksSetup {
    assignedDeck: Deck;
    dealerDeck: Deck;
    playerDeck: Deck;
}
