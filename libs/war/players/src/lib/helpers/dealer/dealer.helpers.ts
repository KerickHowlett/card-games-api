import { Card } from '@card-games-api/decks';
import { CountOf, getSize } from '@card-games-api/utils';
import { every, gte, invokeMap, isEqual } from 'lodash';

import { Player } from '../../models';

export const enoughCardsPerPlayer = (
    players: CountOf<Player>,
    cards: CountOf<Card>
): boolean => gte(getSize(cards), getSize(players));

export const shuffleIfDecksAreIdentical = (players: Player[]): Player[] => {
    const haveIdenticalDecks = (player: Player): boolean =>
        isEqual(player.getDeck(), players[0].getDeck());

    while (every(players, haveIdenticalDecks)) {
        players = invokeMap(players, 'shuffleDeck');
    }

    return players;
};
