import { BattleServices } from '@card-games-api/battles';

import { DatabaseServices } from '../../services';
import { GameControllers } from './game.controllers';

let controller: GameControllers;

describe('GameControllers', () => {
    beforeEach(
        () =>
            (controller = new GameControllers(BattleServices, DatabaseServices))
    );

    it('should initiate instances without crashing', async () => {
        expect(controller).toBeTruthy();
        expect(controller.startNewGame).toBeTruthy();
        expect(controller.getGameScore).toBeTruthy();
        expect(controller.play).toBeTruthy();
    });
});
