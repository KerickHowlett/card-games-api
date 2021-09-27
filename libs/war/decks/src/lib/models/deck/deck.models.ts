import {
    isEmptyOrUndefined as noCardsLeft,
    OrArray
} from '@card-games-api/utils';
import { size } from 'lodash';

import { DeckServices, IDeckServices } from '../../services';
import {
    CardData,
    CardOrData,
    DeckBuilderOptions,
    DeckProperties
} from '../../types';
import { Card } from '../card';

const { EMPTY_STARTER } = DeckBuilderOptions;

export class Deck {
    private cards: Card[];

    private readonly services: IDeckServices;

    constructor(
        deckOwnerOrData: DeckProperties = EMPTY_STARTER,
        totalDecks?: number
    ) {
        this.services = DeckServices;
        this.cards = this.services.getDeck(deckOwnerOrData, totalDecks);
    }

    get isEmpty(): boolean {
        return noCardsLeft(this.cards);
    }

    get size(): number {
        return size(this.cards);
    }

    public addCards(cards: OrArray<Card>): Deck {
        this.cards = this.services.addCards(cards, this.cards);
        return this;
    }

    public clear(): Deck {
        this.cards = this.services.replace();
        return this;
    }

    public clearDeckHolder(): Deck {
        this.cards = this.services.clearDeckHolderName(this.cards);
        return this;
    }

    public drawCards(totalCards = 1): Card[] {
        const [drawnCards, remainingDeck] = this.services.drawCards(
            totalCards,
            this.cards
        );

        this.cards = remainingDeck;

        return drawnCards;
    }

    public get(): Card[] {
        return this.services.replace(this.cards);
    }

    public replace(newDeck: OrArray<CardOrData>): Deck {
        this.cards = this.services.replace(newDeck);
        return this;
    }

    public shuffle(): Deck {
        this.cards = this.services.shuffle(this.cards);
        return this;
    }

    public take(): Card[] {
        const [drawnCards, emptyDeck] = this.services.take(this.cards);

        this.cards = emptyDeck;

        return drawnCards;
    }

    public toJson(): CardData[] {
        return this.services.toJson(this.cards);
    }
}
