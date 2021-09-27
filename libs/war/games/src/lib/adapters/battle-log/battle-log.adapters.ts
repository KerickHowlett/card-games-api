import {
    BattleLog,
    BattleLogServices,
    IBattleLogServices
} from '@card-games-api/battle-logs';
import { Aftermath } from '@card-games-api/battles';

export class BattleLogAdapters {
    constructor(
        private readonly battleLogsService: IBattleLogServices = BattleLogServices
    ) {
        this.logs = [];
    }

    protected logs: BattleLog[];

    public addToLogs(aftermath: Aftermath): this {
        this.logs = this.battleLogsService.add(this.logs, aftermath);
        return this;
    }

    public getLatestLog(): BattleLog {
        return this.battleLogsService.getLatest(this.logs);
    }

    public getLogs(): BattleLog[] {
        return this.battleLogsService.get(this.logs);
    }
}
