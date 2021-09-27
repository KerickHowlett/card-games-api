import { Card, getEmptyDeck, ONE_CARD, TWO_CARDS } from '@card-games-api/decks';
import {
    findPlayerIndex,
    isEveryPlayerDeckEmpty,
    notEmpty,
    Player
} from '@card-games-api/players';
import { getErrorResponse } from '@card-games-api/utils';
import { chain, isEmpty, last as useTopCard } from 'lodash';

import {
    findWinningCards,
    ineligibleHandler,
    isTied,
    setThePile
} from '../helpers';
import { Aftermath, BattlefieldSetup } from '../types';

class BattleServices {
    public play(
        players: Player[],
        costOfRound: number = ONE_CARD,
        prevPot?: Card[],
        prevCardsPlayed?: Card[]
    ): Aftermath {
        if (isEveryPlayerDeckEmpty(players)) throw getErrorResponse();

        let thePot: Card[] = setThePile(prevPot);
        let cardsPlayed: Card[] = setThePile(prevCardsPlayed);

        const {
            battlefield,
            updatedPlayers,
            thePot: cardsForThePot
        } = this.setupBattlefield(players, costOfRound);

        thePot = [...thePot, ...cardsForThePot];
        cardsPlayed = [...cardsPlayed, ...battlefield];

        const winningCards: Card[] = findWinningCards(battlefield);

        if (isTied(winningCards)) {
            return this.play(updatedPlayers, TWO_CARDS, thePot, cardsPlayed);
        }

        const aftermath: Aftermath = {
            cardsPlayed,
            updatedPlayers,
            thePot,
            winningCard: winningCards[0]
        };

        aftermath.updatedPlayers = this.payout(aftermath);

        return aftermath;
    }

    private payout(aftermath: Aftermath): Player[] {
        const { updatedPlayers: players, thePot, winningCard } = aftermath;

        const winningPlayerName: string = winningCard.getHolderName();
        const winningPlayerIndex: number = findPlayerIndex(
            players,
            'name',
            winningPlayerName
        );

        players[winningPlayerIndex].addCards(thePot).shuffleDeck();

        return players;
    }

    private setupBattlefield(
        players: Player[],
        costOfRound: number
    ): BattlefieldSetup {
        let thePot: Card[] = getEmptyDeck();

        const addToThePot = (contribution: Card[]): Card[] => {
            if (!isEmpty(contribution)) {
                thePot = [...thePot, ...contribution];
            }
            return contribution;
        };

        const { updatedPlayers, thePot: theAnti } = ineligibleHandler(
            players,
            costOfRound
        );

        addToThePot(theAnti);

        const battlefield: Card[] = chain(updatedPlayers)
            .filter(notEmpty)
            .invokeMap('drawCards', costOfRound)
            .map(addToThePot)
            .map(useTopCard)
            .value();

        return { battlefield, thePot, updatedPlayers };
    }
}

export type IBattleServices = BattleServices;

const service: IBattleServices = new BattleServices();

export { service as BattleServices };
