import { KING_OF_HEARTS, TWO_CARD } from '@card-games-api/decks/testing';
import { Player } from '@card-games-api/players';
import { players } from '@card-games-api/players/testing';
import { cloneDeep } from 'lodash';

import { IBattleServices } from '../../lib/services';

export const setupResetBattleService = (service: IBattleServices): Player[] => {
    const mockedPlayers: Player[] = cloneDeep(players);

    mockedPlayers[0] = mockedPlayers[0].addCards([
        KING_OF_HEARTS,
        KING_OF_HEARTS,
        KING_OF_HEARTS,
        KING_OF_HEARTS
    ]);
    mockedPlayers[1] = mockedPlayers[1].addCards([
        TWO_CARD,
        TWO_CARD,
        TWO_CARD,
        KING_OF_HEARTS
    ]);

    jest.clearAllMocks();
    jest.spyOn(service, 'play');

    return mockedPlayers;
};
