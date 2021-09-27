import { CardData } from '@card-games-api/decks';

import { Player } from '../models/player';

export type PlayerOrData = Player | PlayerData;

export type PlayerProperties = PlayerData | number;

export interface PlayerData {
    name: string;
    deck?: CardData[];
    deckSize?: number;
}
