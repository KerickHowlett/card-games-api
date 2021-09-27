import { Card, ONE_CARD, STANDARD_DECK_SIZE } from '@card-games-api/decks';
import { CountOf, divideDown, getSize } from '@card-games-api/utils';
import {
    chain,
    find,
    gt,
    isNumber,
    map,
    memoize,
    range,
    reduce,
    size,
    sortBy,
    subtract
} from 'lodash';

import { TWO_PLAYERS } from '../../lib/constants';
import { createPlayer, indexToName } from '../../lib/helpers/player';
import { Player } from '../../lib/models/player';
import { PlayerDeckSet } from '../types';

import type { PlayerOrData } from '../../lib/types';
export const decrementDeckSize = (player: Player): number =>
    subtract(player.deckSize, ONE_CARD);

export const findPlayerByName = (
    players: Player[],
    playerName: string
): Player => find(players, { name: playerName });

export const getCardsPerPlayer = (
    totalPlayers: number,
    totalDecks: number
): number => {
    const dividyByPlayers = (totalCards: number): number =>
        divideDown(totalCards, totalPlayers);
    return chain(totalDecks)
        .multiply(STANDARD_DECK_SIZE)
        .thru(dividyByPlayers)
        .value();
};

export const getDeckSizesOfPlayers = (players: Player[]): number[] =>
    map(players, 'deckSize');

export const getGrandCardTotalOfPlayers = (player: Player[]): number =>
    chain(player).map('deckSize').sum().value();

export const haveExactSameDeckSize = (players: PlayerOrData[]): boolean =>
    chain(players).map('deckSize').uniq().size().eq(1).value();

export const isExistingPlayerName = (
    playerName: string,
    players: CountOf<Player>
): boolean => {
    const totalPlayers: number = isNumber(players) ? players : size(players);
    return chain(totalPlayers)
        .range()
        .map(indexToName)
        .indexOf(playerName)
        .gt(-1)
        .value();
};

export const isEveryDeckDifferent = (players: PlayerOrData[]): boolean =>
    chain(players).invokeMap('getDeck').uniq().size().eq(1).value();

export const mockTooManyPlayers = (): Player[] => map(range(100), createPlayer);

export const moreThanTwoPlayers = (players: CountOf<PlayerOrData>): boolean =>
    gt(getSize(players), TWO_PLAYERS);

export const setupAllPlayerDeckCombos = memoize(
    (
        minPlayers: number,
        maxPlayers: number,
        minDecks: number,
        maxDecks: number
    ): PlayerDeckSet[] => {
        const playerArgs: number[] = range(minPlayers, maxPlayers + 1);
        const deckArgs: number[] = range(minDecks, maxDecks + 1);
        return reduce(
            playerArgs,
            (sets: PlayerDeckSet[], totalPlayers: number): PlayerDeckSet[] => [
                ...sets,
                ...map(
                    deckArgs,
                    (totalDecks: number): PlayerDeckSet => ({
                        totalPlayers,
                        totalDecks
                    })
                )
            ],
            []
        );
    }
);

export const sortPlayerDeck = (player: Player): Player => {
    const deck: Card[] = sortBy(player.takeDeck(), 'value');
    return player.addCards(deck);
};
