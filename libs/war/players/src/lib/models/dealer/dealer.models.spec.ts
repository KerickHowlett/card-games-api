import { Card } from '@card-games-api/decks';
import {
    deckCountToCardCount,
    EACH_DECK_VARIANT
} from '@card-games-api/decks/testing';
import { divideDown, finalIndexOf, NestedArray } from '@card-games-api/utils';
import { chain, eq, every, invokeMap } from 'lodash';

import { setupPlayerAndDealer } from '../../../testing';
import { Player } from '../player';
import { Dealer } from './dealer.models';

let dealer: Dealer;
let players: Player[];

describe('Dealer', () => {
    it('should construct default instance without crashing', async () => {
        expect(new Dealer()).toBeTruthy();
    });

    describe.each(EACH_DECK_VARIANT)(
        'should build instance successfully',
        (request: number) => {
            it(`${request} total decks`, async () => {
                const dealer: Dealer = await new Dealer(request);
                expect(dealer).toBeInstanceOf(Dealer);
                expect(dealer.deckSize).toEqual(
                    await deckCountToCardCount(request)
                );
            });
        }
    );

    describe('dealOutCards', () => {
        describe('distribute cards evenly and randomly', () => {
            beforeEach(() => ({ dealer, players } = setupPlayerAndDealer()));

            it('with default number of players', async () => {
                players = await dealer.dealOutCards(players);

                const hasEqualDeck = (player: Player): boolean =>
                    !player.isDeckEmpty &&
                    eq(player.deckSize, players[0].deckSize);

                expect(await every(players, hasEqualDeck)).toBe(true);
            });

            it('with entered number of players', async () => {
                const newPlayerIndex: number = finalIndexOf(players);
                players = [...players, new Player(newPlayerIndex)];

                const totalExpectedCards: number = await divideDown(
                    dealer.deckSize,
                    players.length
                );

                players = await dealer.dealOutCards(players);

                expect(
                    await every(players, { deckSize: totalExpectedCards })
                ).toBe(true);
            });

            it('gives each player unique, randomly generated decks', async () => {
                const dealtPlayers: Player[] = await dealer.dealOutCards(
                    players
                );
                const decks: NestedArray<Card> = invokeMap(
                    dealtPlayers,
                    'getDeck'
                );

                const deckMatches = (deck: Card[]): boolean =>
                    eq(deck, decks[0]);
                const matchingDecks: number = chain(decks)
                    .filter(deckMatches)
                    .size()
                    .value();

                expect(eq(matchingDecks, 1)).toBe(true);
            });

            it("should completely empty out the dealer's deck", async () => {
                await dealer.dealOutCards(players);
                expect(dealer.isDeckEmpty).toBe(true);
            });
        });
    });
});
