import { MockDecksSetup } from '@card-games-api/decks/testing';

import { Dealer, Player } from '../../lib/models';

export interface ExpectedReturn {
    totalDecks: number;
    totalPlayers: number;
}

export interface PlayerDeckSet {
    totalPlayers: number;
    totalDecks: number;
}

export interface PlayerAndDeckMocks extends MockDecksSetup {
    players: Player[];
}

export interface SetupPlayerAndDealer {
    dealer: Dealer;
    players: Player[];
}
