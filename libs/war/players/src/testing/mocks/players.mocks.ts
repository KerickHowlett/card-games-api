import { Dealer, Player } from '../../lib/models';
import { PlayerData } from '../../lib/types';
import { ExpectedReturn, PlayerDeckSet } from '../types';
import { setupAllPlayerDeckCombos } from '../utils';

export const DEFAULT_TOTAL_DECKS = 1;
export const TOO_MANY_PLAYERS = 100;
export const THREE_PLAYERS = 3;

export const MIN_DECKS = 1;
export const MAX_DECKS = 5;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

export const mockDealer: Dealer = new Dealer();
export const DEFAULT_TOTAL_PLAYERS = 2;

export const playerOne: Player = new Player(0);
export const playerTwo: Player = new Player(1);
export const playerThree: Player = new Player(3);

export const playerOneData: PlayerData = playerOne.toJson();
export const playerTwoData: PlayerData = playerTwo.toJson();
export const playerThreeData: PlayerData = playerThree.toJson();

export const players: Player[] = [playerOne, playerTwo];

export const playersData: PlayerData[] = [playerOneData, playerTwoData];

export const threePlayers: Player[] = [...players, playerThree];

export const threePlayersData: PlayerData[] = [...playersData, playerThreeData];

export const EXPECTED_PARAM_RETURN: ExpectedReturn = {
    totalPlayers: 2,
    totalDecks: 1
};

export const PLAYER_DECK_SETS: PlayerDeckSet[] = setupAllPlayerDeckCombos(
    MIN_PLAYERS,
    MAX_PLAYERS,
    MIN_DECKS,
    MAX_DECKS
);

export const DEFAULT_PLAYER_DECK_SET: PlayerDeckSet = {
    totalPlayers: 2,
    totalDecks: 1
};
