import { BattleLog } from '@card-games-api/battle-logs';
import { getLatestMockLog } from '@card-games-api/battle-logs/testing';
import { ONE_PLAYER, Player, TWO_PLAYERS } from '@card-games-api/players';
import {
    PLAYER_DECK_SETS,
    PlayerDeckSet,
    playerOneData,
    players,
    playersData,
    playerTwoData,
    setupFullyLoadedPlayers,
    threePlayers,
    threePlayersData,
    TOO_MANY_PLAYERS
} from '@card-games-api/players/testing';
import { every, size } from 'lodash';

import { getExpectedCardsPerPlayer, MOCK_QUERY_PARAMS } from '../../../testing';
import { DEFAULT_TOTAL_DECKS, DEFAULT_TOTAL_PLAYERS } from '../../constants';
import { GameScore, GameStatuses } from '../../types';
import { GamesServices as service } from './games.services';

import type { WholeOrPartial } from '@card-games-api/utils';

const { GAME_JUST_STARTED, GAME_OVER, IN_PROGRESS } = GameStatuses;

let latestLog: BattleLog;
let dealtPlayers: Player[];
let getExpectedCardCount: number;

const loadedPlayers: Player[] = setupFullyLoadedPlayers();

describe('GamesServices', () => {
    it('should construct instance without crashing', async () => {
        expect(await service).toBeTruthy();
    });

    describe('PlayersAdapters', () => {
        describe("should have all of the PlayersAdapters' methods working as they should", () => {
            it('getActivePlayersCount', async () => {
                expect(
                    await service.getActivePlayersCount(loadedPlayers)
                ).toBeTruthy();
            });

            it('getJsonForAllPlayers', async () => {
                expect(
                    await service.getJsonForAllPlayers(players)
                ).toBeTruthy();
            });

            it('getPlayerCount', async () => {
                expect(await service.getPlayerCount(players)).toBeTruthy();
            });

            it('getPlayers', async () => {
                expect(await service.getPlayers(players)).toBeTruthy();
            });

            it('loadPlayers', async () => {
                expect(await service.loadPlayers(playersData)).toBeTruthy();
            });

            it('updatePlayers', async () => {
                expect(
                    await service.updatePlayers(players, players)
                ).toBeTruthy();
            });
        });
    });

    describe('getScore', () => {
        describe('GameStatus', () => {
            beforeEach(() => (latestLog = getLatestMockLog()));

            it('should return status', async () => {
                const { status } = await service.getScore(
                    players,
                    GAME_JUST_STARTED,
                    latestLog
                );
                expect(status).toEqual(GAME_JUST_STARTED);
            });
        });

        describe('Player Data', () => {
            beforeEach(() => (latestLog = getLatestMockLog()));

            it('should return player deck sizes if two player game', async () => {
                const { playerOne, playerTwo } = await service.getScore(
                    players,
                    GAME_JUST_STARTED,
                    latestLog
                );
                expect(playerOne).toEqual(playerOneData.deckSize);
                expect(playerTwo).toEqual(playerTwoData.deckSize);
            });

            it('should return PlayerData array if more than two players', async () => {
                const { players: responsePlayers } = await service.getScore(
                    threePlayers,
                    GAME_JUST_STARTED,
                    latestLog
                );
                expect(responsePlayers).toMatchObject(threePlayersData);
            });
        });

        describe('Winner Name', () => {
            beforeEach(() => (latestLog = getLatestMockLog()));

            it('should omit winner name if the status is NOT set to GAME_OVER', async () => {
                const response: WholeOrPartial<GameScore> =
                    await service.getScore(
                        players,
                        GAME_JUST_STARTED,
                        latestLog
                    );
                expect(response).not.toHaveProperty('winner');
            });

            it('should include winner property if status is set to GAME_OVER', async () => {
                const { winner: expectedWinner } = latestLog;
                const { winner } = await service.getScore(
                    threePlayers,
                    GAME_OVER,
                    latestLog
                );
                expect(winner).toEqual(expectedWinner);
            });
        });
    });

    describe('getWinnerName', () => {
        beforeEach(() => (latestLog = getLatestMockLog()));

        it('should return winner name if status is GAME_OVER', async () => {
            expect(await service.getWinnerName(GAME_OVER, latestLog)).toEqual(
                latestLog.winner
            );
        });

        it('should return undefined if status is anything other than GAME_OVER', async () => {
            expect(
                await service.getWinnerName(GAME_JUST_STARTED, latestLog)
            ).toBeUndefined();
        });
    });

    describe('setup', () => {
        describe('should execute method without crashing with default arguments based on', () => {
            it('primitve numbers', async () => {
                expect(
                    await service.setup(
                        DEFAULT_TOTAL_PLAYERS,
                        DEFAULT_TOTAL_DECKS
                    )
                ).toBeTruthy();
            });

            it('request query params', async () => {
                expect(await service.setup(MOCK_QUERY_PARAMS)).toBeTruthy();
            });
        });

        describe('should throw an error when there are', () => {
            it('not enough players', async () => {
                await expect(() =>
                    service.setup(ONE_PLAYER, DEFAULT_TOTAL_DECKS)
                ).toThrow();
            });

            it('too many players', async () => {
                await expect(() =>
                    service.setup(TOO_MANY_PLAYERS, DEFAULT_TOTAL_DECKS)
                ).toThrow();
            });
        });

        jest.retryTimes(2);
        describe.each(PLAYER_DECK_SETS)(
            'should execute under special conditions successfully',
            (set: PlayerDeckSet) => {
                const { totalPlayers, totalDecks } = set;

                describe(`${totalPlayers} Requested Players & ${totalDecks} Requested Decks`, () => {
                    beforeEach(() => {
                        dealtPlayers = service.setup(totalPlayers, totalDecks);
                        getExpectedCardCount = getExpectedCardsPerPlayer(
                            totalPlayers,
                            totalDecks
                        );
                    });

                    it('should return expected number of players', async () => {
                        expect(size(dealtPlayers)).toEqual(totalPlayers);
                    });

                    it('should have each player return with equal number of cards', async () => {
                        expect(
                            await every(dealtPlayers, {
                                deckSize: getExpectedCardCount
                            })
                        ).toBe(true);
                    });
                });
            }
        );
    });

    describe('switchStatus', () => {
        describe('should return next status depending on entered GameStatus and number of active players', () => {
            describe('Current Status:', () => {
                it('GAME_JUST_STARTED', async () => {
                    expect(
                        await service.switchStatus(
                            GAME_JUST_STARTED,
                            TWO_PLAYERS
                        )
                    ).toEqual(IN_PROGRESS);
                });

                it('IN_PROGRESS (with ONE Active Player)', async () => {
                    expect(
                        await service.switchStatus(IN_PROGRESS, ONE_PLAYER)
                    ).toEqual(GAME_OVER);
                });

                it('IN_PROGRESS (with TWO Active Players)', async () => {
                    expect(
                        await service.switchStatus(IN_PROGRESS, TWO_PLAYERS)
                    ).toEqual(IN_PROGRESS);
                });

                it('GAME_OVER', async () => {
                    expect(
                        await service.switchStatus(GAME_OVER, ONE_PLAYER)
                    ).toEqual(GAME_OVER);
                });
            });
        });
    });
});
