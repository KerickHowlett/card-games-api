import { CardData, Rank, Suite } from '../../types';

export class Card {
    constructor(card: CardData) {
        const { rank, suite, value } = card;

        this.rank = rank;
        this.suite = suite;
        this.value = value;
    }

    public readonly rank: Rank;

    public readonly suite: Suite;

    public readonly value: number;

    private holderName: string;

    public clearHolderName(): Card {
        this.holderName = undefined;
        return this;
    }

    public getHolderName(): string {
        return this.holderName || null;
    }

    public setHolderName(name: string): Card {
        this.holderName = name;
        return this;
    }

    public toJson(): CardData {
        return {
            rank: this.rank,
            suite: this.suite,
            value: this.value
        };
    }
}
