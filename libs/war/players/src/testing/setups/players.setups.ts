import { Card, Deck, DeckBuilderOptions } from '@card-games-api/decks';
import { mockDecksSetup } from '@card-games-api/decks/testing';
import {
    chain,
    cloneDeep,
    gte,
    invokeMap,
    lt,
    map,
    memoize,
    range
} from 'lodash';

import { ONE_PLAYER } from '../../lib/constants';
import { createPlayer } from '../../lib/helpers/player';
import { Dealer, Player } from '../../lib/models';
import { PlayerData } from '../../lib/types';
import {
    DEFAULT_PLAYER_DECK_SET,
    DEFAULT_TOTAL_DECKS,
    DEFAULT_TOTAL_PLAYERS,
    mockDealer,
    playerOne as mockPlayerOne,
    players as mockPlayers
} from '../mocks';
import {
    PlayerAndDeckMocks,
    PlayerDeckSet,
    SetupPlayerAndDealer
} from '../types';

const { FULL_STARTER } = DeckBuilderOptions;

export const setupDecksAndPlayersMocks = ({
    totalDecks,
    totalPlayers
} = DEFAULT_PLAYER_DECK_SET): PlayerAndDeckMocks => ({
    players: chain(totalPlayers).range().map(createPlayer).value(),
    ...mockDecksSetup(totalDecks)
});

export const setupDynamicCardPlayer = memoize(
    (set: PlayerDeckSet = DEFAULT_PLAYER_DECK_SET): Player[] => {
        const { totalDecks, totalPlayers } = set;
        const dealer: Dealer = new Dealer(totalDecks);
        const players: Player[] = map(range(totalPlayers), createPlayer);
        return cloneDeep(dealer.dealOutCards(players));
    }
);

export const setupFullyLoadedPlayers = (
    players: Player[] = mockPlayers
): Player[] => {
    const deck: Deck = new Deck(FULL_STARTER);
    const cards: Card[] = deck.take();
    return chain(players)
        .cloneDeep()
        .invokeMap('clearDeck')
        .invokeMap('addCards', cards)
        .value();
};

export const setupCardlessPlayer = (player: Player = mockPlayerOne): Player =>
    cloneDeep(player).clearDeck();

export const setupPlayerAndDealer = (
    dealer: Dealer = mockDealer,
    players: Player[] = mockPlayers
): SetupPlayerAndDealer =>
    cloneDeep({
        dealer,
        players
    });

export const setupPlayersWithNoCards = (): Player[] => cloneDeep(mockPlayers);

export const setupSingleFullyLoadedPlayer = (
    player: Player = mockPlayerOne
): Player => setupFullyLoadedPlayers([player])[0];

export const setupSomeEmptyPlayers = (
    totalEmptyPlayers: number = ONE_PLAYER,
    totalPlayers: number = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS
): Player[] => {
    if (gte(totalEmptyPlayers, totalPlayers)) {
        return setupPlayersWithNoCards();
    }

    const players: Player[] = setupDynamicCardPlayer({
        totalDecks,
        totalPlayers
    });

    const clearDesiredPlayers = (player: Player, index: number): Player => {
        const clonedPlayer: Player = cloneDeep(player);
        if (lt(index, totalEmptyPlayers)) clonedPlayer.clearDeck();
        return clonedPlayer;
    };

    return map(players, clearDesiredPlayers);
};

export const setupSomeEmptyPlayersData = (
    totalEmptyPlayers: number = ONE_PLAYER,
    totalPlayers: number = DEFAULT_TOTAL_PLAYERS,
    totalDecks: number = DEFAULT_TOTAL_DECKS
): PlayerData[] => {
    const players: Player[] = setupSomeEmptyPlayers(
        totalEmptyPlayers,
        totalPlayers,
        totalDecks
    );
    return invokeMap(players, 'toJson');
};
