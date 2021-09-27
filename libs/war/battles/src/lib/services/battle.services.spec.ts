import { ONE_CARD, TWO_CARDS } from '@card-games-api/decks';
import { Player } from '@card-games-api/players';
import {
    getDeckSizesOfPlayers,
    getGrandCardTotalOfPlayers,
    isExistingPlayerName,
    PLAYER_DECK_SETS,
    PlayerDeckSet,
    setupDynamicCardPlayer,
    setupPlayersWithNoCards
} from '@card-games-api/players/testing';
import { chain, size, sortBy, subtract } from 'lodash';

import { setupResetBattleService } from '../../testing';
import { BattleServices as service } from './battle.services';

let players: Player[];

describe('BattleServices', () => {
    it('should create instance without crashing', async () => {
        expect(service).toBeTruthy();
    });

    describe('play', () => {
        it('should execute under normal/default conditions successfully', async () => {
            players = setupDynamicCardPlayer();
            expect(await service.play(players)).toBeTruthy();
        });

        jest.retryTimes(2);
        describe.each(PLAYER_DECK_SETS)(
            'should execute with $totalPlayers player & $totalDecks decks',
            (set: PlayerDeckSet) => {
                beforeEach(() => (players = setupDynamicCardPlayer(set)));

                it('without crashing', async () => {
                    expect(await service.play(players)).toBeTruthy();
                });

                it('and maintain same total of cards it had at start of battle', async () => {
                    const originalTotal: number =
                        getGrandCardTotalOfPlayers(players);

                    const { updatedPlayers } = await service.play(players);

                    const aftermathTotal: number =
                        getGrandCardTotalOfPlayers(updatedPlayers);

                    expect(originalTotal).toEqual(aftermathTotal);
                });

                it('and update players', async () => {
                    const { updatedPlayers } = await service.play(players);
                    expect(updatedPlayers).not.toMatchObject(players);
                });

                it('and return with a winning card', async () => {
                    const { winningCard } = await service.play(players);
                    const winnerName: string =
                        await winningCard.getHolderName();
                    expect(isExistingPlayerName(winnerName, players)).toBe(
                        true
                    );
                });

                it('and return with players having different sized decks', async () => {
                    const originalSizes: number[] = sortBy(
                        await getDeckSizesOfPlayers(players)
                    );

                    const { updatedPlayers } = await service.play(players);

                    const aftermathSizes: number[] = sortBy(
                        await getDeckSizesOfPlayers(updatedPlayers)
                    );

                    expect(originalSizes).not.toEqual(aftermathSizes);
                });

                it('and have players played at least one card each', async () => {
                    const { cardsPlayed } = await service.play(players);
                    expect(size(cardsPlayed)).toBeGreaterThanOrEqual(
                        size(players)
                    );
                });

                it('and have a pot that is equal or greater to the number of cards played', async () => {
                    const { cardsPlayed, thePot } = await service.play(players);
                    expect(size(thePot)).toBeGreaterThanOrEqual(
                        size(cardsPlayed)
                    );
                });

                it('and have players with different deck sizes that matches the total in pot', async () => {
                    const { updatedPlayers, thePot } = await service.play(
                        players
                    );
                    const differenceInPlayersDecks: number = chain(
                        updatedPlayers
                    )
                        .map('deckSize')
                        .uniq()
                        .sortBy()
                        .reverse()
                        .reduce(subtract)
                        .value();
                    expect(differenceInPlayersDecks).toEqual(size(thePot));
                });
            }
        );

        describe('during events of a draw', () => {
            beforeEach(() => (players = setupResetBattleService(service)));

            it('should recursively invoke itself', async () => {
                expect(await service.play(players)).toBeTruthy();
                expect(service.play).toHaveBeenCalledTimes(2);
            });

            it('should have all but the first call have two (2) cards be costOfRound', async () => {
                await service.play(players, ONE_CARD);

                expect(service.play).toHaveBeenNthCalledWith(
                    1,
                    expect.anything(),
                    ONE_CARD
                );

                expect(service.play).toHaveBeenLastCalledWith(
                    expect.anything(),
                    TWO_CARDS,
                    expect.anything(),
                    expect.anything()
                );
            });

            //! 2 Players * ( 1 Card for first Round and 2 Card for the Draw round ) = 6 Cards.
            it('should have the pot account for the added anti of two (2) cards per tied round after the initial one (1) card round', async () => {
                const { thePot } = await service.play(players);
                expect(thePot).toHaveLength(6);
            });
        });

        describe('Error Handling', () => {
            beforeEach(() => (players = setupPlayersWithNoCards()));

            it('should throw error if there are no cards between all the players', async () => {
                await expect(() => service.play(players)).toThrow();
            });
        });
    });
});
