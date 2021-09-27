import { Aftermath } from '@card-games-api/battles';
import { Card } from '@card-games-api/decks';
import {
    assignCard,
    assignTestCards,
    TEST_DECK
} from '@card-games-api/decks/testing';
import { Player, PLAYER_ONE_NAME } from '@card-games-api/players';
import { players } from '@card-games-api/players/testing';
import { hasProperty } from '@card-games-api/utils';
import { getFutureDate } from '@card-games-api/utils/testing';
import { add, chain, cloneDeep, size, sumBy } from 'lodash';

import { BattleLog } from '../../lib/types';
import { MOCK_LOG, MOCK_LOGS } from '../mocks';

export const createAftermathMock = (
    updatedPlayers: Player[] = players,
    assigneeName: string = PLAYER_ONE_NAME,
    thePot: Card[] = TEST_DECK
): Aftermath =>
    cloneDeep({
        thePot,
        updatedPlayers,
        cardsPlayed: assignTestCards(assigneeName),
        winningCard: assignCard(assigneeName)
    });

export const getGrandTotalScore = (log: BattleLog): number =>
    hasProperty(log, 'players')
        ? sumBy(log.players, 'deck')
        : add(log.playerOne.deck, log.playerTwo.deck);

export const getTotalCardsPlayed = (log: BattleLog): number => {
    if (hasProperty(log, 'players')) {
        return chain(log.players).map('cards').size().sum().value();
    }
    const { playerOne, playerTwo } = log;
    return add(size(playerOne.cards), size(playerTwo.cards));
};

export const getMockLogs = (): BattleLog[] => cloneDeep(MOCK_LOGS);

export const getLatestMockLog = (): BattleLog => {
    const latestLog: BattleLog = cloneDeep(MOCK_LOG);
    latestLog.createdAt = getFutureDate().toString();
    return latestLog;
};
