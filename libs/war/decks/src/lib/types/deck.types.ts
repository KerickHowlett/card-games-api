import { Card } from '../models/card';

import type { OrArray } from '@card-games-api/utils';

import type { DeckBuilderOption } from './deck-builder-options.types';
import type { Rank } from './rank.types';
import type { Suite } from './suite.types';

export interface CardData {
    suite: Suite;
    rank: Rank;
    value: number;
}

export type CardOrData = Card | CardData;

export type DeckProperties = OrArray<CardData> | DeckBuilderOption;
