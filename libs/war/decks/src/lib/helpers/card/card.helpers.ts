import { isArrayOf, isInstanceOf, isObjectOf } from '@card-games-api/utils';

import { Card } from '../../models/card';
import { CardData } from '../../types';

export const isCard = (object: unknown): object is Card =>
    isInstanceOf<typeof Card>(object, Card);

export const isCardArray = (array: unknown): array is Card[] =>
    isArrayOf(array, isCard);

export const isCardData = (object: unknown): object is CardData =>
    isObjectOf<CardData>(object, ['suite', 'rank', 'value']) && !isCard(object);

export const isCardDataArray = (array: unknown): array is CardData[] =>
    isArrayOf(array, isCardData);
