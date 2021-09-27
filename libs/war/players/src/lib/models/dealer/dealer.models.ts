import { DeckBuilderOptions } from '@card-games-api/decks';

import { DealerServices, IDealerServices } from '../../services/dealer';
import { DeckHolder } from '../deck-holder';
import { Player } from '../player';

const { FULL_STARTER } = DeckBuilderOptions;

export class Dealer extends DeckHolder {
    constructor(totalDecksToUse = 1) {
        super(FULL_STARTER, totalDecksToUse);
        this.service = DealerServices;
    }

    private readonly service: IDealerServices;

    public dealOutCards(players: Player[]): Player[] {
        const dealtPlayers: Player[] = this.service.dealOutCards(
            players,
            this.deck
        );
        this.deck.clear();
        return dealtPlayers;
    }
}
