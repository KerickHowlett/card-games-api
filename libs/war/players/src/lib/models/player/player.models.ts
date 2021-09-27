import { Card, DeckBuilderOptions, ONE_DECK } from '@card-games-api/decks';
import { cloneDeep, isNumber } from 'lodash';

import {
    indexToName,
    isPlayerData,
    setNameToCards
} from '../../helpers/player';
import { PlayerData, PlayerProperties } from '../../types';
import { DeckHolder } from '../deck-holder';

import type { OrArray } from '@card-games-api/utils';

const { EMPTY_STARTER } = DeckBuilderOptions;

export class Player extends DeckHolder {
    constructor(dataOrName: PlayerProperties) {
        super(EMPTY_STARTER, ONE_DECK);

        if (isPlayerData(dataOrName)) {
            const { name, deck } = dataOrName;
            this.name = name;
            this.deck.replace(deck);
            return;
        }

        if (isNumber(dataOrName)) {
            this.name = indexToName(dataOrName);
            return;
        }

        this.name = dataOrName;
    }

    public readonly name: string;

    public addCards(cards: OrArray<Card>): Player {
        this.deck.addCards(cloneDeep(cards));
        this.deck.clearDeckHolder();
        return this;
    }

    public clearDeck(): Player {
        this.deck.clear();
        return this;
    }

    public drawCards(totalCards = 1): Card[] {
        const newCards: Card[] = this.deck.drawCards(totalCards);
        return setNameToCards(newCards, this.name);
    }

    public shuffleDeck(): Player {
        this.deck.shuffle();
        return this;
    }

    public toJson(): PlayerData {
        return {
            deck: this.deck.toJson(),
            name: this.name,
            deckSize: this.deck.size
        };
    }
}
