import {
    Card,
    findCards,
    getEmptyDeck,
    getHighCards,
    hasCard,
    isOnlyOneCard,
    ONE_CARD,
    Ranks
} from '@card-games-api/decks';
import { notEmpty, Player } from '@card-games-api/players';
import { chain, cloneDeep, isUndefined, lt } from 'lodash';

import { ThePot } from '../types';

const { ACE, TWO } = Ranks;

export const findWinningCards = (battlefield: Card[]): Card[] =>
    hasAceAndTwo(battlefield)
        ? findCards(battlefield, 'rank', TWO)
        : getHighCards(battlefield);

export const hasAceAndTwo = (battlefield: Card[]): boolean =>
    hasCard(battlefield, 'rank', ACE)
        ? hasCard(battlefield, 'rank', TWO)
        : false;

export const ineligibleHandler = (
    players: Player[],
    requiredCards = ONE_CARD
): ThePot => {
    const whoCannotPayUp = ({ deckSize }): boolean =>
        lt(deckSize, requiredCards);

    const updatedPlayers = cloneDeep(players);

    const thePot: Card[] = chain(updatedPlayers)
        .filter(notEmpty)
        .filter(whoCannotPayUp)
        .invokeMap('takeDeck')
        .flatten()
        .value();

    return { updatedPlayers, thePot };
};

export const isTied = (battlefield: Card[]): boolean =>
    !isOnlyOneCard(battlefield);

export const setThePile = (updatedPot: Card[]): Card[] =>
    isUndefined(updatedPot) ? getEmptyDeck() : updatedPot;
