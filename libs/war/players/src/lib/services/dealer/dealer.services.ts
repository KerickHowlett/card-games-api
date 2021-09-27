import { Card, Deck } from '@card-games-api/decks';
import { divideDown, NestedArray } from '@card-games-api/utils';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { chain, chunk, size, take } from 'lodash';

import { NO_PLAYERS_MESSAGE, NOT_ENOUGH_CARDS_MESSAGE } from '../../constants';
import {
    enoughCardsPerPlayer,
    hasPlayers,
    shuffleIfDecksAreIdentical
} from '../../helpers';
import { Player } from '../../models';

const { BAD_REQUEST } = StatusCodes;

class DealerServices {
    public dealOutCards(players: Player[], dealerDeck: Deck): Player[] {
        if (!hasPlayers(players)) {
            throw createError(BAD_REQUEST, NO_PLAYERS_MESSAGE);
        }

        const dealerDeckSize: number = dealerDeck.size;

        if (!enoughCardsPerPlayer(players, dealerDeckSize)) {
            throw createError(BAD_REQUEST, NOT_ENOUGH_CARDS_MESSAGE);
        }

        const cardsPerPlayer: number = divideDown(
            dealerDeckSize,
            size(players)
        );

        const deck: Card[] = dealerDeck.shuffle().take();
        const cutDecks: NestedArray<Card> = chunk(deck, cardsPerPlayer);

        const dealtPlayers: Player[] = chain(players)
            .invokeMap('addCards', ...take(cutDecks))
            .invokeMap('shuffleDeck')
            .value();

        return shuffleIfDecksAreIdentical(dealtPlayers);
    }
}

export type IDealerServices = DealerServices;

const service: IDealerServices = new DealerServices();

export { service as DealerServices };
