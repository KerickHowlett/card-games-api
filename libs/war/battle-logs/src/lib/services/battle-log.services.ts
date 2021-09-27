import { Aftermath } from '@card-games-api/battles';
import { Card, findCards } from '@card-games-api/decks';
import {
    isTwoPlayers,
    PLAYER_ONE_NAME,
    PLAYER_TWO_NAME,
    PlayerData
} from '@card-games-api/players';
import { getDate, isEmptyOrUndefined, ValueOf } from '@card-games-api/utils';
import { chain, cloneDeep, findLast, omit } from 'lodash';

import { findPlayerLog } from '../helpers';
import { BattleLog, PlayerLog, PlayersInBattle } from '../types';

class BattleLogServices {
    public add(currentLogs: BattleLog[], aftermath: Aftermath): BattleLog[] {
        const log: BattleLog = {
            createdAt: new Date().toString(),
            winner: aftermath.winningCard.getHolderName()
        };

        const playerLogs: PlayersInBattle = this.createPlayerLogs(aftermath);
        const battleLog: BattleLog = { ...log, ...playerLogs };
        currentLogs = [...currentLogs, battleLog];

        return cloneDeep(currentLogs);
    }

    public getLatest(logs: BattleLog[]): BattleLog | null {
        if (isEmptyOrUndefined(logs)) return null;

        const maxDate: string = chain(logs)
            .map('createdAt')
            .map(getDate)
            .max()
            .invoke('toString')
            .value();

        const latestLog: BattleLog = findLast(logs, { createdAt: maxDate });

        return cloneDeep(latestLog);
    }

    public get(logs: BattleLog[]): BattleLog[] {
        return cloneDeep(logs);
    }

    private createPlayerLogs(aftermath: Aftermath): PlayersInBattle {
        const { cardsPlayed, updatedPlayers } = aftermath;

        const mapLog = (player: PlayerData): PlayerLog => ({
            cards: findCards(
                cardsPlayed,
                'holderName' as keyof Card,
                player.name as ValueOf<Card>
            ),
            deck: player.deckSize,
            name: player.name
        });

        const players: PlayerLog[] = chain(updatedPlayers)
            .invokeMap('toJson')
            .mapValues(mapLog)
            .map()
            .value();

        if (isTwoPlayers(updatedPlayers)) {
            const getPlayerLog = (playerName: string): PlayerLog =>
                omit(findPlayerLog(players, 'name', playerName), 'name');

            return {
                playerOne: getPlayerLog(PLAYER_ONE_NAME),
                playerTwo: getPlayerLog(PLAYER_TWO_NAME)
            };
        }

        return { players };
    }
}

export type IBattleLogServices = BattleLogServices;

const service: IBattleLogServices = new BattleLogServices();

export { service as BattleLogServices };
