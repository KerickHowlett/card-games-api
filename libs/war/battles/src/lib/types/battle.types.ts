import { Card } from '@card-games-api/decks';
import { Player } from '@card-games-api/players';

export interface UpdatePlayers {
    updatedPlayers: Player[];
    winningPlayer?: string;
}

export interface ThePot extends UpdatePlayers {
    thePot: Card[];
}

export interface Aftermath extends ThePot {
    cardsPlayed: Card[];
    winningCard?: Card;
}

export interface BattlefieldSetup extends UpdatePlayers {
    battlefield: Card[];
    thePot: Card[];
}
