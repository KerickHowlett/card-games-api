import { Card } from '@card-games-api/decks';
import {
    AnyArrayOrNumber,
    CountOf,
    getSize,
    isArrayOf,
    isInstanceOf,
    isObjectOf,
    numberToWord,
    ValueOf
} from '@card-games-api/utils';
import {
    chain,
    eq,
    findIndex,
    gt,
    gte,
    isNil as isNullOrUndefined,
    size
} from 'lodash';

import { NO_PLAYERS, ONE_PLAYER, TWO_PLAYERS } from '../../constants';
import { Player } from '../../models/player';
import { PlayerData, PlayerOrData, PlayerProperties } from '../../types';

export const createPlayer = (data: PlayerProperties): Player =>
    new Player(data);

export const enoughPlayers = (
    totalPlayers: CountOf<Player>,
    minPlayers: AnyArrayOrNumber
): boolean => gte(getSize(totalPlayers), getSize(minPlayers));

export const isEveryPlayerDeckEmpty = (players: Player[]): boolean =>
    isNullOrUndefined(players) ||
    chain(players)
        .countBy('isDeckEmpty')
        .at('true')
        .first()
        .eq(size(players))
        .value();

export const findPlayerIndex = (
    players: Player[],
    key: keyof Player,
    query: ValueOf<Player>
): number => {
    const byQuery = (player: Player): boolean =>
        isQueriedPlayer(player, key, query);
    return findIndex(players, byQuery);
};

export const hasExactPlayers = (
    players: CountOf<Player>,
    requiredTotal: CountOf<Player>
): boolean => eq(getSize(players), getSize(requiredTotal));

export const hasPlayers = (players: CountOf<Player>): boolean =>
    gt(getSize(players), NO_PLAYERS);

export const indexToName = (index: number): string =>
    `Player ${numberToWord(index + 1)}`;

export const isPlayerData = (object: unknown): object is PlayerData =>
    isObjectOf<PlayerData>(object, ['deck', 'name', 'deckSize']);

export const isPlayerDataArray = (array: unknown): array is PlayerData[] =>
    isArrayOf<PlayerData>(array, isPlayerData);

export const isPlayer = (object: unknown): object is Player =>
    isInstanceOf<typeof Player>(object, Player);

export const isPlayerArray = (array: unknown): array is Player[] =>
    isArrayOf<Player>(array, isPlayer);

export const isTwoPlayers = (players: CountOf<PlayerOrData>): boolean =>
    eq(getSize(players), TWO_PLAYERS);

export const isQueriedPlayer = (
    player: Player,
    key: keyof Player,
    query: ValueOf<Player>
): boolean => eq(player[key], query);

export const onlyOnePlayer = (players: CountOf<Player>) =>
    hasExactPlayers(players, ONE_PLAYER);

export const setNameToCards = (cards: Card[], name: string): Card[] =>
    chain(cards).cloneDeep().invokeMap('setHolderName', name).value();

export const tooManyPlayers = (
    players: CountOf<Player>,
    max: AnyArrayOrNumber
): boolean => gt(getSize(players), getSize(max));
