import { Deck } from '@card-games-api/decks';
import { mockDecksSetup } from '@card-games-api/decks/testing';
import { chain } from 'lodash';

import {
    mockTooManyPlayers,
    PLAYER_DECK_SETS,
    PlayerDeckSet,
    setupDecksAndPlayersMocks
} from '../../../testing';
import { Player } from '../../models';
import { DealerServices as service } from './dealer.services';

let dealerDeck: Deck;
let players: Player[];

describe('DealerServices', () => {
    it('should build instance without crashing', async () => {
        expect(service).toBeTruthy();
    });

    describe('dealOutCards', () => {
        describe.each(PLAYER_DECK_SETS)(
            'should return an equal number of card for each player',
            (set: PlayerDeckSet) => {
                const { totalPlayers, totalDecks } = set;

                describe(`with an argument of ${totalPlayers} players & ${totalDecks} decks`, () => {
                    beforeEach(
                        () =>
                            ({ dealerDeck, players } =
                                setupDecksAndPlayersMocks(set))
                    );

                    it('dealer deck should distribute cards evenly', async () => {
                        const responsePlayers: Player[] =
                            await service.dealOutCards(players, dealerDeck);

                        const cardsAreDistributedEvenly: boolean = chain(
                            responsePlayers
                        )
                            .map('deckSize')
                            .uniq()
                            .size()
                            .eq(1)
                            .value();

                        expect(cardsAreDistributedEvenly).toBe(true);
                    });
                });
            }
        );

        describe('should throw an error', () => {
            beforeEach(() => ({ dealerDeck } = mockDecksSetup()));

            it('when there are too few players', async () => {
                await expect(() =>
                    service.dealOutCards([], dealerDeck)
                ).toThrow();
            });

            it('when there are too many players', async () => {
                await expect(() =>
                    service.dealOutCards(mockTooManyPlayers(), dealerDeck)
                ).toThrow();
            });
        });
    });
});
