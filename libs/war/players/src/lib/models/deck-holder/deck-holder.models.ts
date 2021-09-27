import { Card, Deck, DeckProperties } from '@card-games-api/decks';
import { cloneDeep } from 'lodash';

export class DeckHolder {
    protected readonly deck: Deck;

    constructor(properties: DeckProperties, totalDecks?: number) {
        this.deck = new Deck(properties, totalDecks);
    }

    get isDeckEmpty(): boolean {
        return this.deck.isEmpty;
    }

    get deckSize(): number {
        return this.deck.size;
    }

    public clearDeck(): DeckHolder {
        this.deck.clear();
        return this;
    }

    public getDeck(): Card[] {
        return cloneDeep(this.deck.get());
    }

    public takeDeck(): Card[] {
        return this.deck.take();
    }
}
